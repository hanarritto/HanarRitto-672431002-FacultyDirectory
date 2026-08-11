const user = requireLogin();

const favoritesContainer = document.getElementById('favoritesContainer');
const favoriteEmpty = document.getElementById('favoriteEmpty');

function getFavorites() {
  try { return JSON.parse(localStorage.getItem('favorites')) || []; }
  catch { return []; }
}

function renderFavorites() {
  const names = getFavorites();
  const teachers = FACULTY_DATA.filter(t => names.includes(t.nameEN));

  favoriteEmpty.classList.toggle('d-none', teachers.length !== 0);

  favoritesContainer.innerHTML = teachers.map(t => `
    <div class="col-md-6 col-xl-4">
      <article class="card faculty-card h-100 p-4 text-center">
        <img src="${t.image}" class="faculty-img mx-auto mb-3" alt="${t.nameEN}">
        <h5 class="fw-bold">${t.nameEN}</h5>
        <div class="text-muted mb-2">${t.departmentEN} | ${t.departmentTH}</div>

        <div class="d-flex gap-2 justify-content-center mt-3">
          <button class="btn btn-outline-primary btn-sm"
                  onclick="viewFavoriteProfile('${t.nameEN.replace(/'/g, "\\'")}')">
            View Profile | ดูโปรไฟล์
          </button>

          <button class="btn btn-outline-danger btn-sm"
                  onclick="removeFavorite('${t.nameEN.replace(/'/g, "\\'")}')">
            <i class="bi bi-trash me-1"></i>
            Remove | ลบ
          </button>
        </div>
      </article>
    </div>
  `).join('');
}

window.removeFavorite = function (name) {
  const next = getFavorites().filter(item => item !== name);
  localStorage.setItem('favorites', JSON.stringify(next));
  renderFavorites();
};

window.viewFavoriteProfile = function (name) {
  const teacher = FACULTY_DATA.find(t => t.nameEN === name);
  if (!teacher) return;
  localStorage.setItem('selectedTeacher', JSON.stringify(teacher));
  window.location.href = 'profile.html';
};

if (user) renderFavorites();
