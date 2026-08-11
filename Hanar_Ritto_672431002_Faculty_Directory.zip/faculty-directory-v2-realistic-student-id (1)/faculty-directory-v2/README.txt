FACULTY DIRECTORY V2
====================

Quick start
-----------
1. Extract this folder.
2. Open the folder in VS Code.
3. Run login.html with Live Server / File Server.
4. Demo login:
   Student ID: 672431002
   Password:   672431002

Main structure
--------------
css/style.css       Shared styles + global dark mode
js/data.js          400 faculty demo records + demo student validator
js/main.js          Shared user/auth helpers
js/theme.js         ONE shared dark/light mode system
js/login.js         Login + 3 failed attempts + 10-minute countdown
js/welcome.js       3-second welcome redirect
js/search.js        Search, autocomplete, filter, pagination, Grid/List,
                    recent searches, real popular-search counts (Top 7),
                    favorites, CSV export
js/favorites.js     Favorites page
js/profile.js       Faculty profile page

Notes
-----
- This is a front-end prototype. localStorage is used for demo persistence.
- Popular Searches are counted from confirmed searches in this browser.
  A production university-wide counter would require a backend/database.
- Student passwords are demo-only and default to the same value as the student ID.
- The student validator accepts 9-digit IDs beginning with 65,66,67,68,69,70.


Student ID prototype structure
------------------------------
The V2 login now validates a realistic 9-digit structure for entry years 64-69:

YY G PPP NNN

YY  = admission year (64-69)
G   = 1 male / 2 female
PPP = program code
NNN = running student number (001-999)

Example:
672431002 = 67 | 2 | 431 | 002

This preserves the user's real example and follows patterns visible in Fatoni University's
public registrar pages. Because a complete official university-wide codebook is not publicly
documented, the program-code mapping is explicitly a prototype mapping. The public code 424
is retained for the International College English preparatory example visible in registrar data.

For the prototype, password defaults to the same 9-digit Student ID. In production,
authentication must come from the university's backend/identity system and passwords must
never be derived from Student IDs.
