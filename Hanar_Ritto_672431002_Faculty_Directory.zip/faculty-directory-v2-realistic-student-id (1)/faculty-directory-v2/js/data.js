// ===============================
// Faculty Directory V2 - Demo Data
// ===============================

const FIRST_NAMES = [
  'Somchai','Suda','Niran','Kanya','Anucha','Siriporn','Prasert','Wimon',
  'Wei','Li','Xiao','Chen','Mei','Jun','Lin','Hua',
  'Ahmad','Amina','Nurul','Huda','Yusuf','Siti','Farid','Zainab',
  'Rajesh','Priya','Anita','Vikram','Arjun','Kavita','Ravi','Neha',
  'Muhammad','Fatimah','Omar','Khadijah','Abdullah','Safiya','Hasan','Nadia',
  'Bounmy','Khamla','Souk','Chantha','Vieng','Phonexay',
  'Rahim','Karim','Salma','Jahan'
];

const LAST_NAMES = [
  'Sukjai','Thongdee','Saelim','Rattanakul','Wongsa','Boonsri',
  'Zhang','Wang','Li','Chen','Liu','Yang','Huang','Zhao',
  'Yusuf','Rahman','Ismail','Abdullah','Karim','Hassan','Latif',
  'Sharma','Patel','Singh','Kumar','Gupta','Rao','Das',
  'Al-Hassan','Al-Farooq','Al-Rashid','Mahmud','Salim',
  'Phommasane','Inthavong','Sengdara','Vongsa',
  'Chowdhury','Hossain','Rahman'
];

const PROGRAMS = [
  ['Computer Science','วิทยาการคอมพิวเตอร์'],
  ['Information Technology','เทคโนโลยีสารสนเทศ'],
  ['Data Science','วิทยาการข้อมูล'],
  ['Artificial Intelligence','ปัญญาประดิษฐ์'],
  ['Business Administration','บริหารธุรกิจ'],
  ['Marketing','การตลาด'],
  ['Accounting','การบัญชี'],
  ['English Language','ภาษาอังกฤษ'],
  ['Malay Language','ภาษามลายู'],
  ['Arabic Language','ภาษาอาหรับ'],
  ['Educational Technology','เทคโนโลยีการศึกษา'],
  ['Mathematics Education','คณิตศาสตร์ศึกษา'],
  ['Science Education','วิทยาศาสตร์ศึกษา'],
  ['Islamic Studies','อิสลามศึกษา'],
  ['Shariah','ชะรีอะฮ์'],
  ['Quran and Sunnah','อัลกุรอานและซุนนะฮ์'],
  ['Digital Media','สื่อดิจิทัล'],
  ['Public Relations','ประชาสัมพันธ์'],
  ['Journalism','วารสารศาสตร์'],
  ['Broadcasting','วิทยุกระจายเสียงและโทรทัศน์']
];

const FACULTIES = [
  ['Faculty of Science and Technology','คณะวิทยาศาสตร์และเทคโนโลยี'],
  ['Faculty of Business Administration','คณะบริหารธุรกิจ'],
  ['Faculty of Liberal Arts','คณะศิลปศาสตร์'],
  ['Faculty of Education','คณะศึกษาศาสตร์'],
  ['Faculty of Islamic Studies','คณะอิสลามศึกษา'],
  ['Faculty of Communication Arts','คณะนิเทศศาสตร์']
];

function facultyIndexFromProgram(p) {
  if (p <= 3) return 0;
  if (p <= 6) return 1;
  if (p <= 9) return 2;
  if (p <= 12) return 3;
  if (p <= 15) return 4;
  return 5;
}

window.FACULTY_DATA = [];
let facultyId = 1;

for (let p = 0; p < PROGRAMS.length; p++) {
  for (let i = 0; i < 20; i++) {
    const seed = p * 20 + i;
    const first = FIRST_NAMES[seed % FIRST_NAMES.length];
    const last = LAST_NAMES[(seed * 3 + p) % LAST_NAMES.length];
    const facultyIndex = facultyIndexFromProgram(p);
    const emailName = `${first}.${last}`.toLowerCase().replace(/[^a-z0-9.]/g, '');

    FACULTY_DATA.push({
      id: facultyId++,
      nameEN: `${first} ${last}`,
      nameTH: `${first} ${last}`,
      facultyEN: FACULTIES[facultyIndex][0],
      facultyTH: FACULTIES[facultyIndex][1],
      departmentEN: PROGRAMS[p][0],
      departmentTH: PROGRAMS[p][1],
      positionEN: ['Lecturer','Assistant Professor','Associate Professor'][seed % 3],
      positionTH: ['อาจารย์','ผู้ช่วยศาสตราจารย์','รองศาสตราจารย์'][seed % 3],
      email: `${emailName}@university.ac.th`,
      phone: `+66 74 12${String(3000 + seed).slice(-4)}`,
      building: `Building ${String.fromCharCode(65 + facultyIndex)}`,
      buildingTH: `อาคาร ${String.fromCharCode(65 + facultyIndex)}`,
      room: `${200 + (seed % 80)}`,
      officeHoursEN: 'Monday - Friday 09:00 - 12:00',
      officeHoursTH: 'จันทร์ - ศุกร์ 09:00 - 12:00 น.',
      interests: [
        PROGRAMS[p][0],
        ['Research','Web Technology','Data Analysis','Digital Innovation'][seed % 4]
      ],
      image: `https://i.pravatar.cc/300?img=${(seed % 70) + 1}`
    });
  }
}

// ===============================
// Student ID Prototype Structure
// ===============================
// Format used by this prototype:
// YY G PPP NNN
//
// YY  = admission year (64-69)
// G   = gender/section code: 1 = male, 2 = female
// PPP = program code
// NNN = running student number within the intake/program group
//
// This structure is based on the user's real example 672431002 and
// publicly visible registrar examples such as 671424049 / 682424037.
// The exact university-wide official codebook is not publicly documented,
// so the program-code table below is a realistic PROTOTYPE mapping.
//
// Important real example preserved:
// 67 2 431 002
// 67  = admission year 2567
// 2   = female group
// 431 = Information Technology (prototype mapping for this project)
// 002 = running number

window.STUDENT_PROGRAM_CODES = {
  '430': { facultyEN: 'Faculty of Science and Technology', facultyTH: 'คณะวิทยาศาสตร์และเทคโนโลยี', programEN: 'Computer Science', programTH: 'วิทยาการคอมพิวเตอร์' },
  '431': { facultyEN: 'Faculty of Science and Technology', facultyTH: 'คณะวิทยาศาสตร์และเทคโนโลยี', programEN: 'Information Technology', programTH: 'เทคโนโลยีสารสนเทศ' },
  '432': { facultyEN: 'Faculty of Science and Technology', facultyTH: 'คณะวิทยาศาสตร์และเทคโนโลยี', programEN: 'Data Science', programTH: 'วิทยาการข้อมูล' },
  '433': { facultyEN: 'Faculty of Science and Technology', facultyTH: 'คณะวิทยาศาสตร์และเทคโนโลยี', programEN: 'Artificial Intelligence', programTH: 'ปัญญาประดิษฐ์' },

  '440': { facultyEN: 'Faculty of Business Administration', facultyTH: 'คณะบริหารธุรกิจ', programEN: 'Business Administration', programTH: 'บริหารธุรกิจ' },
  '441': { facultyEN: 'Faculty of Business Administration', facultyTH: 'คณะบริหารธุรกิจ', programEN: 'Marketing', programTH: 'การตลาด' },
  '442': { facultyEN: 'Faculty of Business Administration', facultyTH: 'คณะบริหารธุรกิจ', programEN: 'Accounting', programTH: 'การบัญชี' },

  '450': { facultyEN: 'Faculty of Liberal Arts', facultyTH: 'คณะศิลปศาสตร์', programEN: 'English Language', programTH: 'ภาษาอังกฤษ' },
  '451': { facultyEN: 'Faculty of Liberal Arts', facultyTH: 'คณะศิลปศาสตร์', programEN: 'Malay Language', programTH: 'ภาษามลายู' },
  '452': { facultyEN: 'Faculty of Liberal Arts', facultyTH: 'คณะศิลปศาสตร์', programEN: 'Arabic Language', programTH: 'ภาษาอาหรับ' },

  '460': { facultyEN: 'Faculty of Education', facultyTH: 'คณะศึกษาศาสตร์', programEN: 'Educational Technology', programTH: 'เทคโนโลยีการศึกษา' },
  '461': { facultyEN: 'Faculty of Education', facultyTH: 'คณะศึกษาศาสตร์', programEN: 'Mathematics Education', programTH: 'คณิตศาสตร์ศึกษา' },
  '462': { facultyEN: 'Faculty of Education', facultyTH: 'คณะศึกษาศาสตร์', programEN: 'Science Education', programTH: 'วิทยาศาสตร์ศึกษา' },

  '470': { facultyEN: 'Faculty of Islamic Studies', facultyTH: 'คณะอิสลามศึกษา', programEN: 'Islamic Studies', programTH: 'อิสลามศึกษา' },
  '471': { facultyEN: 'Faculty of Islamic Studies', facultyTH: 'คณะอิสลามศึกษา', programEN: 'Shariah', programTH: 'ชะรีอะฮ์' },
  '472': { facultyEN: 'Faculty of Islamic Studies', facultyTH: 'คณะอิสลามศึกษา', programEN: 'Quran and Sunnah', programTH: 'อัลกุรอานและซุนนะฮ์' },

  '480': { facultyEN: 'Faculty of Communication Arts', facultyTH: 'คณะนิเทศศาสตร์', programEN: 'Digital Media', programTH: 'สื่อดิจิทัล' },
  '481': { facultyEN: 'Faculty of Communication Arts', facultyTH: 'คณะนิเทศศาสตร์', programEN: 'Public Relations', programTH: 'ประชาสัมพันธ์' },
  '482': { facultyEN: 'Faculty of Communication Arts', facultyTH: 'คณะนิเทศศาสตร์', programEN: 'Journalism', programTH: 'วารสารศาสตร์' },
  '483': { facultyEN: 'Faculty of Communication Arts', facultyTH: 'คณะนิเทศศาสตร์', programEN: 'Broadcasting', programTH: 'วิทยุกระจายเสียงและโทรทัศน์' },

  // Public registrar example retained for realism.
  // Registrar pages show code 424 for English preparatory / International College.
  '424': { facultyEN: 'International College', facultyTH: 'วิทยาลัยนานาชาติ', programEN: 'English Preparatory Program', programTH: 'ภาษาอังกฤษ (เตรียมภาษาอังกฤษ)' }
};

const STUDENT_FIRST_NAMES = {
  1: ['Ahmad','Muhammad','Yusuf','Hasan','Omar','Farid','Niran','Somchai','Wei','Rajesh','Bounmy','Rahim'],
  2: ['Amina','Nurul','Siti','Fatimah','Nadia','Kanya','Siriporn','Mei','Priya','Neha','Zainab','Salma']
};

const STUDENT_LAST_NAMES = [
  'Ali','Yusuf','Rahman','Hassan','Abdullah','Sukjai','Thongdee','Zhang',
  'Wang','Sharma','Patel','Phommasane','Chowdhury','Hossain','Saelim'
];

window.parseStudentId = function(studentId) {
  const id = String(studentId || '').trim();

  if (!/^\d{9}$/.test(id)) {
    return { valid: false, reason: 'Student ID must contain 9 digits. | รหัสนักศึกษาต้องมี 9 หลัก' };
  }

  const year = id.slice(0, 2);
  const genderCode = id.slice(2, 3);
  const programCode = id.slice(3, 6);
  const runningNumber = id.slice(6, 9);

  if (!['64','65','66','67','68','69'].includes(year)) {
    return { valid: false, reason: 'Admission year must be 64-69. | ปีที่เข้าศึกษาต้องอยู่ระหว่าง 64-69' };
  }

  if (!['1','2'].includes(genderCode)) {
    return { valid: false, reason: 'Gender/section code must be 1 or 2. | รหัสกลุ่มเพศต้องเป็น 1 หรือ 2' };
  }

  const program = STUDENT_PROGRAM_CODES[programCode];
  if (!program) {
    return { valid: false, reason: 'Unknown program code. | ไม่พบรหัสสาขาวิชาในระบบต้นแบบ' };
  }

  const running = Number(runningNumber);
  if (running < 1 || running > 999) {
    return { valid: false, reason: 'Invalid running number. | ลำดับนักศึกษาไม่ถูกต้อง' };
  }

  return {
    valid: true,
    id,
    year,
    admissionYearBE: 2500 + Number(year),
    genderCode,
    genderEN: genderCode === '1' ? 'Male' : 'Female',
    genderTH: genderCode === '1' ? 'ชาย' : 'หญิง',
    programCode,
    runningNumber,
    running,
    ...program
  };
};

function deterministicStudentName(parsed) {
  // Preserve the user's real/demo account.
  if (parsed.id === '672431002') return 'Student 672431002';

  const firstPool = STUDENT_FIRST_NAMES[Number(parsed.genderCode)];
  const seed = Number(parsed.year) * 100000 + Number(parsed.programCode) * 1000 + parsed.running;
  const first = firstPool[seed % firstPool.length];
  const last = STUDENT_LAST_NAMES[(seed * 7) % STUDENT_LAST_NAMES.length];
  return `${first} ${last}`;
}

window.getStudentById = function(studentId) {
  const parsed = parseStudentId(studentId);
  if (!parsed.valid) return null;

  return {
    id: parsed.id,
    name: deterministicStudentName(parsed),
    password: parsed.id, // prototype default only
    admissionYear: parsed.admissionYearBE,
    genderCode: parsed.genderCode,
    genderEN: parsed.genderEN,
    genderTH: parsed.genderTH,
    programCode: parsed.programCode,
    programEN: parsed.programEN,
    programTH: parsed.programTH,
    facultyEN: parsed.facultyEN,
    facultyTH: parsed.facultyTH,
    runningNumber: parsed.runningNumber
  };
};
