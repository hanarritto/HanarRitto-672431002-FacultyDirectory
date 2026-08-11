const user = requireLogin();

let teacher = null;
try {
  teacher = JSON.parse(localStorage.getItem('selectedTeacher'));
} catch {}

if (!teacher) {
  teacher = FACULTY_DATA[0];
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderProfile() {
  document.getElementById('profileImage').src = teacher.image;
  document.getElementById('profileImage').alt = teacher.nameEN;

  setText('profileNameEN', teacher.nameEN);
  setText('profileNameTH', teacher.nameTH);
  setText('profilePosition', `${teacher.positionEN} | ${teacher.positionTH}`);
  setText('profileFaculty', `${teacher.facultyEN} | ${teacher.facultyTH}`);
  setText('profileDepartment', `${teacher.departmentEN} | ${teacher.departmentTH}`);
  setText('profileOffice', `${teacher.building}, Room ${teacher.room} | ${teacher.buildingTH} ห้อง ${teacher.room}`);
  setText('profileHoursEN', teacher.officeHoursEN);
  setText('profileHoursTH', teacher.officeHoursTH);

  const email = document.getElementById('profileEmail');
  email.textContent = teacher.email;
  email.href = `mailto:${teacher.email}?subject=Faculty%20Contact`;

  const phone = document.getElementById('profilePhone');
  phone.textContent = teacher.phone;
  phone.href = `tel:${teacher.phone.replace(/\s/g, '')}`;

  const interests = document.getElementById('profileInterests');
  interests.innerHTML = teacher.interests
    .map(item => `<span class="badge bg-primary-subtle text-primary-emphasis px-3 py-2">${item}</span>`)
    .join('');
}

if (user) renderProfile();
