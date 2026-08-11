const user = requireLogin();

const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('suggestions');
const resultsBox = document.getElementById('results');
const facultyFilter = document.getElementById('facultyFilter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const recentBox = document.getElementById('recentSearches');
const popularBox = document.getElementById('popularSearches');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const exportBtn = document.getElementById('exportBtn');
const favoriteCount = document.getElementById('favoriteCount');

let currentPage = 1;
const itemsPerPage = 12;
let currentView = localStorage.getItem('facultyView') || 'grid';
let filteredTeachers = [...FACULTY_DATA];

function getFavorites() {
  try { return JSON.parse(localStorage.getItem('favorites')) || []; }
  catch { return []; }
}

function saveFavorites(items) {
  localStorage.setItem('favorites', JSON.stringify(items));
}

function isFavorite(name) {
  return getFavorites().includes(name);
}

function updateFavoriteCount() {
  if (favoriteCount) favoriteCount.textContent = getFavorites().length;
}

window.toggleFavorite = function (name) {
  let favorites = getFavorites();

  if (favorites.includes(name)) {
    favorites = favorites.filter(item => item !== name);
  } else {
    favorites.push(name);
  }

  saveFavorites(favorites);
  updateFavoriteCount();
  renderResults(filteredTeachers);
};

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function scoreTeacher(t, keyword) {
  const q = normalize(keyword);
  if (!q) return 0;

  const fields = [
    t.nameEN, t.nameTH,
    t.departmentEN, t.departmentTH,
    t.facultyEN, t.facultyTH
  ].map(normalize);

  let best = -1;

  fields.forEach(field => {
    if (field === q) best = Math.max(best, 100);
    else if (field.startsWith(q)) best = Math.max(best, 80);
    else if (field.split(/\s+/).some(word => word.startsWith(q))) best = Math.max(best, 70);
    else if (field.includes(q)) best = Math.max(best, 50);
  });

  return best;
}

function searchTeachers(keyword) {
  const q = normalize(keyword);
  if (!q) return [...FACULTY_DATA];

  return FACULTY_DATA
    .map(t => ({ teacher: t, score: scoreTeacher(t, q) }))
    .filter(item => item.score >= 0)
    .sort((a, b) => b.score - a.score || a.teacher.nameEN.localeCompare(b.teacher.nameEN))
    .map(item => item.teacher);
}

function getFilteredResults() {
  let list = searchTeachers(searchInput.value);

  if (facultyFilter.value) {
    list = list.filter(t => t.facultyEN === facultyFilter.value);
  }

  return list;
}

function renderResults(list) {
  filteredTeachers = list;

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / itemsPerPage));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredTeachers.slice(start, start + itemsPerPage);

  if (pageItems.length === 0) {
    resultsBox.innerHTML = `
      <div class="col-12 text-center text-muted py-5">
        <i class="bi bi-search display-5 d-block mb-3"></i>
        No faculty found | ไม่พบข้อมูลอาจารย์
      </div>`;
    updatePagination();
    return;
  }

  resultsBox.innerHTML = pageItems.map(t => `
    <div class="${currentView === 'grid' ? 'col-md-6 col-xl-4' : 'col-12'}">
      <article class="card faculty-card h-100 p-4 fade-in position-relative ${currentView === 'list' ? 'faculty-list-card' : 'text-center'}">

        <button
          class="favorite-button btn btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow-sm"
          onclick="toggleFavorite('${t.nameEN.replace(/'/g, "\\'")}')"
          title="Favorite | รายการโปรด"
          aria-label="Favorite ${t.nameEN}">
          <i class="bi ${isFavorite(t.nameEN) ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}"></i>
        </button>

        <div class="${currentView === 'list' ? 'd-md-flex align-items-center gap-4' : ''}">
          <img src="${t.image}" class="faculty-img ${currentView === 'grid' ? 'mx-auto mb-3' : 'mb-3 mb-md-0'}" alt="${t.nameEN}">

          <div class="${currentView === 'list' ? 'flex-grow-1' : ''}">
            <h5 class="fw-bold mb-1">${t.nameEN}</h5>
            <div class="text-muted mb-2">${t.nameTH}</div>

            <div class="small text-primary fw-semibold mb-1">
              ${t.departmentEN}
            </div>

            <div class="small text-muted mb-3">
              ${t.departmentTH}
            </div>

            <button
              class="btn btn-outline-primary btn-sm"
              onclick="openProfileByName('${t.nameEN.replace(/'/g, "\\'")}')">
              View Profile | ดูโปรไฟล์
            </button>
          </div>
        </div>

      </article>
    </div>
  `).join('');

  updatePagination();
}

function updatePagination() {
  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / itemsPerPage));
  pageInfo.textContent = `Page ${currentPage} of ${totalPages} | หน้า ${currentPage} จาก ${totalPages}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

function showSuggestions(list) {
  const keyword = searchInput.value.trim();

  if (!keyword || list.length === 0) {
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
    return;
  }

  suggestionsBox.innerHTML = list.slice(0, 7).map(t => `
    <button class="suggestion-item w-100 text-start border-0 bg-transparent"
            data-name="${t.nameEN.replace(/"/g, '&quot;')}">
      <div class="suggestion-name">${t.nameEN}</div>
      <div class="suggestion-dept">${t.departmentEN} | ${t.departmentTH}</div>
    </button>
  `).join('');

  suggestionsBox.style.display = 'block';

  suggestionsBox.querySelectorAll('.suggestion-item').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.dataset.name;
      searchInput.value = name;
      suggestionsBox.style.display = 'none';
      currentPage = 1;
      saveRecentSearch(name);
      recordPopularSearch(name);
      renderResults(getFilteredResults());
    });
  });
}

function saveRecentSearch(keyword) {
  const value = String(keyword || '').trim();
  if (!value) return;

  let recent = [];
  try { recent = JSON.parse(localStorage.getItem('recentSearches')) || []; }
  catch {}

  recent = recent.filter(item => normalize(item) !== normalize(value));
  recent.unshift(value);
  recent = recent.slice(0, 8);

  localStorage.setItem('recentSearches', JSON.stringify(recent));
  renderRecentSearches();
}

function renderRecentSearches() {
  let recent = [];
  try { recent = JSON.parse(localStorage.getItem('recentSearches')) || []; }
  catch {}

  if (recent.length === 0) {
    recentBox.innerHTML = `<span class="text-muted small">No recent searches | ยังไม่มีประวัติการค้นหา</span>`;
    return;
  }

  recentBox.innerHTML = recent.map(keyword => `
    <button class="btn btn-outline-secondary btn-sm rounded-pill recent-search"
            data-keyword="${String(keyword).replace(/"/g, '&quot;')}">
      <i class="bi bi-clock me-1"></i>${keyword}
    </button>
  `).join('');

  recentBox.querySelectorAll('.recent-search').forEach(button => {
    button.addEventListener('click', () => performConfirmedSearch(button.dataset.keyword));
  });
}

window.clearRecentSearches = function () {
  localStorage.removeItem('recentSearches');
  renderRecentSearches();
};

function recordPopularSearch(keyword) {
  const value = String(keyword || '').trim();
  if (!value) return;

  let counts = {};
  try { counts = JSON.parse(localStorage.getItem('popularSearchCounts')) || {}; }
  catch {}

  const key = normalize(value);

  if (!counts[key]) counts[key] = { keyword: value, count: 0 };
  counts[key].count += 1;
  counts[key].keyword = value;

  localStorage.setItem('popularSearchCounts', JSON.stringify(counts));
  renderPopularSearches();
}

function renderPopularSearches() {
  let counts = {};
  try { counts = JSON.parse(localStorage.getItem('popularSearchCounts')) || {}; }
  catch {}

  const popular = Object.values(counts)
    .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword))
    .slice(0, 7);

  if (popular.length === 0) {
    popularBox.innerHTML = `<span class="text-muted small">No popular searches yet | ยังไม่มีคำค้นหายอดนิยม</span>`;
    return;
  }

  popularBox.innerHTML = popular.map(item => `
    <button class="btn btn-outline-danger btn-sm rounded-pill popular-search"
            data-keyword="${String(item.keyword).replace(/"/g, '&quot;')}">
      <i class="bi bi-fire me-1"></i>${item.keyword}
      <span class="badge bg-danger ms-1">${item.count}</span>
    </button>
  `).join('');

  popularBox.querySelectorAll('.popular-search').forEach(button => {
    button.addEventListener('click', () => performConfirmedSearch(button.dataset.keyword));
  });
}

function performConfirmedSearch(keyword) {
  searchInput.value = keyword;
  currentPage = 1;
  saveRecentSearch(keyword);
  recordPopularSearch(keyword);
  suggestionsBox.style.display = 'none';
  renderResults(getFilteredResults());
}

window.openProfileByName = function (name) {
  const teacher = FACULTY_DATA.find(t => t.nameEN === name);
  if (!teacher) return;

  saveRecentSearch(name);
  localStorage.setItem('selectedTeacher', JSON.stringify(teacher));
  window.location.href = 'profile.html';
};

function exportFacultyCSV() {
  if (filteredTeachers.length === 0) {
    alert('No faculty data to export | ไม่มีข้อมูลอาจารย์สำหรับส่งออก');
    return;
  }

  const headers = [
    'ID','Name (English)','Name (Thai)',
    'Faculty (English)','Faculty (Thai)',
    'Department (English)','Department (Thai)',
    'Email','Phone'
  ];

  const rows = filteredTeachers.map(t => [
    t.id, t.nameEN, t.nameTH,
    t.facultyEN, t.facultyTH,
    t.departmentEN, t.departmentTH,
    t.email, t.phone
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `faculty-directory-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

searchInput.addEventListener('input', () => {
  currentPage = 1;
  const list = getFilteredResults();
  renderResults(list);
  showSuggestions(list);
});

searchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const keyword = searchInput.value.trim();
    if (keyword) performConfirmedSearch(keyword);
  }
});

facultyFilter.addEventListener('change', () => {
  currentPage = 1;
  renderResults(getFilteredResults());
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderResults(filteredTeachers);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

nextBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage += 1;
    renderResults(filteredTeachers);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

gridViewBtn.addEventListener('click', () => {
  currentView = 'grid';
  localStorage.setItem('facultyView', currentView);
  gridViewBtn.className = 'btn btn-primary btn-sm';
  listViewBtn.className = 'btn btn-outline-primary btn-sm';
  renderResults(filteredTeachers);
});

listViewBtn.addEventListener('click', () => {
  currentView = 'list';
  localStorage.setItem('facultyView', currentView);
  listViewBtn.className = 'btn btn-primary btn-sm';
  gridViewBtn.className = 'btn btn-outline-primary btn-sm';
  renderResults(filteredTeachers);
});

exportBtn.addEventListener('click', exportFacultyCSV);

document.addEventListener('click', event => {
  if (!event.target.closest('.search-container')) {
    suggestionsBox.style.display = 'none';
  }
});

function initializeSearchPage() {
  FACULTIES.forEach(([en, th]) => {
    const option = document.createElement('option');
    option.value = en;
    option.textContent = `${en} | ${th}`;
    facultyFilter.appendChild(option);
  });

  if (currentView === 'list') {
    listViewBtn.className = 'btn btn-primary btn-sm';
    gridViewBtn.className = 'btn btn-outline-primary btn-sm';
  }

  renderRecentSearches();
  renderPopularSearches();
  updateFavoriteCount();
  renderResults(FACULTY_DATA);
}

if (user) initializeSearchPage();
