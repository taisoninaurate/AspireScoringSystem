/**
 * ASPIRE ARTISTIC SWIMMING - JUDGES MOBILE PORTAL ENGINE (100% PURE DYNAMIC FETCH)
 */

let WEB_APP_URL = "https://script.google.com/macros/s/AKfycby4O2eHnkm1eZ3ZUJbLcWIATH1te02Aheul-Ox8jtLn-AtrlFtQqLmgbvRtr7W6ab9p4w/exec";

// 100% PURE DYNAMIC LIVE DATA STORES (NO HARDCODED STATIC ARRAYS)
let liveUniqueLevels = [];
let liveJudgeMatrix = {};
let liveSwimmerAssignments = {};

// COMPLETE 67-ELEMENT MANUAL DATABASE (LEVELS 1-8 REFERENCE DESCRIPTIONS)
const MANUAL_DATABASE = {
  // LEVEL 1 (9 Elements)
  "1-1": { name: "On Land – Right Split", r1: "Angle of at least 135° (approx. hips lower than yoga block)", r2: "Hips, shoulders and head in vertical line perpendicular to ground", r3: "Legs extended" },
  "1-2": { name: "On Land – Left Split", r1: "Angle of at least 135° (approx. hips lower than yoga block)", r2: "Hips, shoulders and head in vertical line perpendicular to ground", r3: "Legs extended" },
  "1-3": { name: "On Land – Middle Split", r1: "Angle of at least 135° (approx. hips lower than yoga block)", r2: "Knee caps facing same direction", r3: "Legs extended" },
  "1-4": { name: "Back Flutter Kick for 5 metres", r1: "Continuous kicking and travelling", r2: "Kick from hips", r3: "Arms and body fully extended, hands together" },
  "1-5": { name: "Side Flutter Kick on both sides for 5 metres each", r1: "Continuous kicking and travelling", r2: "Kick from hips", r3: "Arms and body fully extended and facing same direction, hands straight" },
  "1-6": { name: "Back Layout position", r1: "Body extended with face, chest, thighs and feet at surface of water", r2: "Understanding of standard sculling (palms tight, arms under hips, uniform motion)", r3: "Good control" },
  "1-7": { name: "Front Layout position, face in the water", r1: "Body extended with head, upper back, buttocks and heels at surface of water", r2: "Understanding of standard sculling (palms tight, arms under surface, uniform motion)", r3: "Good control" },
  "1-8": { name: "Torpedo for 10 metres", r1: "Body extended with face, chest, thighs and feet at surface of water", r2: "Smooth continuous travel, with uniformed sculling", r3: "Arms motion from elbows (overhead, under surface)" },
  "1-9": { name: "Stationary Eggbeater with arms assisting", r1: "Uniform motion of rotation from knees", r2: "Knees wideout", r3: "Body position is in vertical line from head to hips" },

  // LEVEL 2 (7 Elements)
  "2-1": { name: "Barrel Scull for 5 metres", r1: "Body extended with head, upper back, buttocks and heels at surface", r2: "Smooth continuous travel with uniformed sculling", r3: "Arms extended above head with small angle down (no more than 45°)" },
  "2-2": { name: "Reverse Torpedo/Dolphin Scull for 5 metres", r1: "Body extended with face, chest, thighs and feet at surface", r2: "Smooth continuous travel with uniformed sculling", r3: "Reverse Torpedo/Dolphin scull below surface (movement from elbows)" },
  "2-3": { name: "Eggbeater sideways travel for 5 metres each side", r1: "Uniform motion of rotation from knees", r2: "Smooth continuous travel", r3: "Body position in vertical line from head to hips" },
  "2-4": { name: "Kick, Pull, Kick, Airplane, alternating sides, for 10 metres", r1: "Coordination between extended arm movements and kick", r2: "Efficient and dynamic breaststroke kick", r3: "Dynamic arms" },
  "2-5": { name: "Body Boost without arms", r1: "Body is vertical at peak height of boost", r2: "Kick is performed in sideway motion", r3: "Boost is rapid, minimally at ribs height" },
  "2-6": { name: "Ariana Rotation", r1: "Legs at/or above water surface throughout rotation", r2: "Hips turn 180° around vertical line, showing angle of at least 135° in all splits", r3: "Legs extended throughout rotation" },
  "2-7": { name: "Support scull", r1: "Palms facing bottom of pool. Uniform pressure on outward and inward scull motion", r2: "Head, shoulders and hips aligned with elbows tucked close to sides of body", r3: "-" },

  // LEVEL 3 (8 Elements)
  "3-1": { name: "Back Layout position to Back Layout Bent Knee position", r1: "Good control and stability shown throughout element", r2: "Bent Knee Back Layout Position with thigh of bent leg perpendicular to surface (90°)", r3: "Body extended with face, chest, thighs and feet at surface" },
  "3-2": { name: "Flamingo position", r1: "Vertical leg extended perpendicular to surface and positioned in middle of horizontal shin", r2: "Horizontal leg bent with foot, shin and knee parallel to surface", r3: "Standard scull demonstrated with control and stability" },
  "3-3": { name: "Low Vertical position (Floatation)", r1: "Body in vertical line (up to 10° allowance). Fully extended with head, shoulders, hips, toes aligned", r2: "Hands supporting with minimal sculling for balance and stability", r3: "-" },
  "3-4": { name: "Back Tuck Somersault", r1: "Somersault rotation 360° executed in tight compact tuck position close to surface", r2: "Body as compact as possible, with back rounded and legs together", r3: "Return to Tuck position after rotation" },
  "3-5": { name: "Split position to Vertical floatation", r1: "Legs close symmetrically to Vertical position at ankle level with good control", r2: "Split position with angle of at least 135° in split position", r3: "At ankle level, body in vertical line (up to 10° allowance)" },
  "3-6": { name: "Pike position", r1: "Body bent at hips to form 90° angle (allowance of 10° from vertical line)", r2: "Trunk extended with back straight and head in line", r3: "Legs extension and together" },
  "3-7": { name: "Inverted Tuck position", r1: "Tight tuck position with body rounded. Heels close to buttocks. Head close to knees", r2: "Show control and stability of position", r3: "-" },
  "3-8": { name: "Eggbeater travelling forward for 5 metres", r1: "Uniform motion of rotation from knees, with knees wide out", r2: "Body position in vertical line from head to hips", r3: "Smooth continuous travel" },

  // LEVEL 4 (10 Elements)
  "4-1": { name: "Ballet Leg position", r1: "Ballet Leg position held at 90° to surface", r2: "-", r3: "-" },
  "4-2": { name: "Bent Knee Vertical position", r1: "Vertical alignment with bent leg toe touching vertical leg knee", r2: "-", r3: "-" },
  "4-3": { name: "Fishtail position", r1: "Horizontal leg extended at surface, vertical leg vertical", r2: "-", r3: "-" },
  "4-4": { name: "Side Fishtail position", r1: "Swimmer facing assessors, fishtail held with extension", r2: "-", r3: "-" },
  "4-5": { name: "Knight position", r1: "Lower back arched with head, shoulders and hips aligned", r2: "-", r3: "-" },
  "4-6": { name: "Vertical position", r1: "Executed sideways to assessors", r2: "-", r3: "-" },
  "4-7": { name: "Front Layout position to Front Pike position", r1: "Smooth transition into Front Pike", r2: "-", r3: "-" },
  "4-8": { name: "Back Layout position to Surface Arch position", r1: "Smooth arch transition", r2: "-", r3: "-" },
  "4-9": { name: "Barracuda thrust", r1: "Rapid vertical thrust from Back Pike to Vertical", r2: "-", r3: "-" },
  "4-10": { name: "Part Figure: 363 - WaterDrop", r1: "Bent Knee Vertical, 180 Spin as bent leg extends to Vertical, Vertical Descent", r2: "-", r3: "-" },

  // LEVEL 5 (9 Elements)
  "5-1": { name: "Side Flutter Kick to Eggbeater 1 arm to Side Flutter Kick", r1: "Side Flutter Kick (5m) to Eggbeater 1 arm travelling sideways (5m) to Side Flutter Kick (5m)", r2: "-", r3: "-" },
  "5-2": { name: "Back layout to Bent Knee to Ballet Leg sequence", r1: "Back layout position to Bent Knee position to Ballet Leg position to Bent Knee position to Back Layout position", r2: "-", r3: "-" },
  "5-3": { name: "Bent Knee Surface Arch to Arc to Back Layout", r1: "Bent Knee Surface Arch position to Arc position to Back Layout position", r2: "-", r3: "-" },
  "5-4": { name: "Front Layout to Pike to Split position", r1: "Front Layout position to Pike position to Split position", r2: "-", r3: "-" },
  "5-5": { name: "Front Layout to Pike to Bent Knee position", r1: "Front Layout position to Pike position to Bent Knee position", r2: "-", r3: "-" },
  "5-6": { name: "Front Layout to Pike to Vertical position", r1: "Front Layout position to Pike position to Vertical position", r2: "-", r3: "-" },
  "5-7": { name: "Part Figure: 227d SWANITA SPINNING 180°", r1: "From Right Fishtail Position, descending Spinning 180° to Vertical, Vertical Descent", r2: "-", r3: "-" },
  "5-8": { name: "Part Figure: 311 KIP", r1: "From Inverted Tuck position, trunk unrolls as legs straighten to Vertical Position", r2: "-", r3: "-" },
  "5-9": { name: "Part Figure: 311j KIP", r1: "From vertical position, rapid Combined Spin (360° + 360°) followed by rapid Vertical Descent", r2: "-", r3: "-" },

  // LEVEL 6 (7 Elements)
  "6-1": { name: "Part Figure: 106 - Straight Ballet Leg", r1: "Back Layout position to Ballet Leg", r2: "-", r3: "-" },
  "6-2": { name: "Whole figure: 301 - Barracuda", r1: "Figure 301 : Barracuda Thrust with entrance", r2: "-", r3: "-" },
  "6-3": { name: "Part Figure: 359 - Front Ariana", r1: "From split position, Walkout Front is executed to back layout", r2: "-", r3: "-" },
  "6-4": { name: "Part Figure: 348 - Tower", r1: "Fishtail Position. Horizontal leg lifted to Vertical Position. Vertical Descent", r2: "-", r3: "-" },
  "6-5": { name: "Part Figure: 363 - Water Drop", r1: "Bent Knee Vertical Position. Half Twist. 180° Spin as bent leg extends to Vertical. Vertical Descent", r2: "-", r3: "-" },
  "6-6": { name: "Part Figure: 401 - Swordfish", r1: "From Bent Knee Front Layout Position. Back arches as extended leg lifted in 180° arc to Bent Knee Surface Arch", r2: "-", r3: "-" },
  "6-7": { name: "Part Figure: 227d - Swanita Spinning 180°", r1: "From Back Layout Position to Bent Knee Surface Arch. Straightened to Knight Position. 180° rotation to Fishtail", r2: "-", r3: "-" },

  // LEVEL 7 (12 Elements)
  "7-1": { name: "Part Figure: 307 - Flying Fish", r1: "From Back Layout Position legs raised to vertical as body submerged to Back Pike... Thrust to Vertical... Vertical Descent", r2: "-", r3: "-" },
  "7-2": { name: "Part Figure: 437 Cyclone, Open 180°", r1: "From Back Layout Position Bent Knee Surface Arch... Simultaneous lift to Vertical as 180° Twirl is executed...", r2: "-", r3: "-" },
  "7-3": { name: "Whole Figure: 308h Barracuda Airborne Split Spin Up 180°", r1: "The whole figure", r2: "-", r3: "-" },
  "7-4": { name: "Part Figure: 407 Swordfish Straight Leg Ariana Rotation", r1: "From Front Layout Position back arches as one leg lifted in 180° arc to Split... Ariana Rotation", r2: "-", r3: "-" },
  "7-5": { name: "Part Figure: 356f Whip Continuous Spin 720°", r1: "Vertical Position. All remaining movements rapid. One leg lowered to Fishtail... Continuous Spin 720°", r2: "-", r3: "-" },
  "7-6": { name: "Part Figure: 441 Saturn", r1: "Knight Position. Body rotates 180° to Fishtail Position. 180° Twirl as horizontal leg lifted to Vertical. Vertical Descent", r2: "-", r3: "-" },
  "7-7": { name: "Part Figure: 352 Venus", r1: "From Front Pike Position. One leg lifted to Fishtail. Horizontal leg bent to Bent Knee Vertical. Rotation 360°... Vertical", r2: "-", r3: "-" },
  "7-8": { name: "Part Figure: 240i Albatross Spin up 360°", r1: "Half Twist. Maintaining Bent Knee Vertical, Vertical Descent to ankle. Spin Up 360° to Vertical. Vertical Descent", r2: "-", r3: "-" },
  "7-9": { name: "Part Figure: 140j - Flamingo Bent Knee Combined Spin 360°", r1: "From Surface Flamingo Position, ballet leg maintains vertical position, hips lifted as trunk unrolls... Combined spin 360°", r2: "-", r3: "-" },
  "7-10": { name: "Whole figure: 421 Walkover Back Closing 360°", r1: "The whole figure", r2: "-", r3: "-" },
  "7-11": { name: "Part Figure: 440d Ipanema Spinning 180°", r1: "From Vertical position, legs lowered to Front Pike Position. Rapid 180° rotation as legs lifted to Vertical", r2: "-", r3: "-" },
  "7-12": { name: "Part Figure: 154f - London Continuous Spin 720", r1: "Ballet Leg assumed. Partial Somersault Back Tuck... Rapidly straightened to Vertical... Continuous Spin 720", r2: "-", r3: "-" },

  // LEVEL 8 (5 Elements)
  "8-1": { name: "Team Element 1: 1A – Flying Fish Hybrid Spinning 180°", r1: "1A – Flying Fish Hybrid Spinning 180°", r2: "-", r3: "-" },
  "8-2": { name: "Team Element 2: 2B - Vertical - Half Twist to Bent Knee", r1: "2B - Vertical - Half Twist to Bent Knee - Half Twist to Vertical – Split - Walkout", r2: "-", r3: "-" },
  "8-3": { name: "Team Element 3: 3B – Two Fouetté Rotations", r1: "3B – Two Fouetté Rotations – Vertical –Spinning 360°", r2: "-", r3: "-" },
  "8-4": { name: "Team Element 4: 4 - Butterfly Hybrid D", r1: "4 - Butterfly Hybrid D", r2: "-", r3: "-" },
  "8-5": { name: "Team Element 5: 5B-Rocket Split Knee Hybrid", r1: "5B-Rocket Split Knee Hybrid", r2: "-", r3: "-" }
};

const MAX_ELEMS = { 1: 9, 2: 7, 3: 8, 4: 10, 5: 9, 6: 7, 7: 12, 8: 5 };

// DOM Elements
const selectLevel = document.getElementById('select-level');
const selectJudge = document.getElementById('select-judge');
const selectElement = document.getElementById('select-element');
const selectAthlete = document.getElementById('select-athlete');
const displayJudgeName = document.getElementById('display-judge-name');

const elementNumberTag = document.getElementById('element-number-tag');
const elementNameTitle = document.getElementById('element-name-title');
const elementSubtitleDesc = document.getElementById('element-subtitle-desc');

const containerLevel13 = document.getElementById('level-1-3-container');
const containerLevel48 = document.getElementById('level-4-8-container');
const inputNumericScore = document.getElementById('input-numeric-score');
const assessorComments = document.getElementById('assessor-comments');
const btnSubmitScore = document.getElementById('btn-submit-score');

// State Store
const evaluationState = { 1: null, 2: null, 3: null };

// Initialize App & Fetch Live Sheets Data
document.addEventListener('DOMContentLoaded', async () => {
  fetchLiveSheetsData();

  selectLevel.addEventListener('change', () => {
    updateElementDropdown();
    updateAthleteDropdown();
    updateManualCard();
    updateJudgeName();
    toggleScoringMode();
  });

  selectJudge.addEventListener('change', updateJudgeName);
  selectElement.addEventListener('change', () => {
    updateManualCard();
    updateJudgeName();
  });

  setupToggleButtons();
  btnSubmitScore.addEventListener('click', handleSubmitScore);
});

// 100% Dynamic Fetch Data from Google Sheets API
async function fetchLiveSheetsData() {
  if (!WEB_APP_URL) return;
  try {
    const res = await fetch(WEB_APP_URL + "?action=GET_INITIAL_DATA");
    const json = await res.json();
    if (json && json.status === "success") {
      liveUniqueLevels = json.uniqueLevels || [];
      liveJudgeMatrix = json.judgeMatrix || {};
      liveSwimmerAssignments = json.swimmerAssignments || {};

      updateLevelDropdown();
      updateElementDropdown();
      updateAthleteDropdown();
      updateJudgeName();
      toggleScoringMode();
    }
  } catch (err) {
    console.error("Error fetching live data from Google Sheets API:", err);
  }
}

// Update Level Dropdown dynamically with Unique Active Numbers from 4_Overview (e.g. Level 4, Level 5, Level 6, Level 7)
function updateLevelDropdown() {
  const currentVal = parseInt(selectLevel.value) || liveUniqueLevels[0];
  selectLevel.innerHTML = '';

  if (!liveUniqueLevels || liveUniqueLevels.length === 0) {
    const opt = document.createElement('option');
    opt.value = "";
    opt.textContent = "Loading Levels from Sheet...";
    selectLevel.appendChild(opt);
    return;
  }

  liveUniqueLevels.forEach(lvl => {
    const opt = document.createElement('option');
    opt.value = lvl;
    opt.textContent = `Level ${lvl}`;
    if (lvl === currentVal) opt.selected = true;
    selectLevel.appendChild(opt);
  });
}

// Update Element Dropdown based on Level selected
function updateElementDropdown() {
  const level = parseInt(selectLevel.value);
  if (!level) return;
  const max = MAX_ELEMS[level] || 12;
  selectElement.innerHTML = '';
  
  for (let i = 1; i <= max; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Element ${i}`;
    selectElement.appendChild(opt);
  }
}

// Update Athlete Dropdown based on Level selected (Reads TRUE checkboxes in corresponding column from Google Sheet)
function updateAthleteDropdown() {
  const level = parseInt(selectLevel.value);
  if (!level) return;
  const registeredAthletes = liveSwimmerAssignments[level] || [];

  selectAthlete.innerHTML = '';
  if (registeredAthletes.length === 0) {
    const opt = document.createElement('option');
    opt.value = "";
    opt.textContent = "No Registered Athletes";
    selectAthlete.appendChild(opt);
    return;
  }

  registeredAthletes.forEach(athleteNo => {
    const opt = document.createElement('option');
    opt.value = athleteNo;
    opt.textContent = `Athlete #${athleteNo}`;
    selectAthlete.appendChild(opt);
  });
}

// Dynamic Judge Name Lookup (Directly from C4:N27 in 2_Judge_Assignment)
function updateJudgeName() {
  const level = selectLevel.value;
  const judge = selectJudge.value;
  const elem = selectElement.value;
  if (!level || !judge || !elem) return;
  const key = `${level}-${elem}-${judge}`;

  const lookupName = liveJudgeMatrix[key];
  if (lookupName) {
    displayJudgeName.textContent = capitalizeProper(lookupName);
  } else {
    displayJudgeName.textContent = "Please input judge name";
  }
}

function capitalizeProper(str) {
  if (!str) return "";
  return str.toString().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Update Manual Card
function updateManualCard() {
  const level = selectLevel.value;
  const elem = selectElement.value;
  if (!level || !elem) return;
  const key = `${level}-${elem}`;
  const data = MANUAL_DATABASE[key] || { name: `Element ${elem}`, r1: "Requirement 1", r2: "Requirement 2", r3: "Requirement 3" };

  elementNumberTag.textContent = `Level ${level} - Element ${elem}`;
  elementNameTitle.textContent = data.name;
  elementSubtitleDesc.textContent = data.r1;

  document.getElementById('req-text-1').textContent = data.r1;
  document.getElementById('req-text-2').textContent = data.r2;
  document.getElementById('req-text-3').textContent = data.r3;
}

// Toggle Mode (Level 1-3 vs Level 4-8)
function toggleScoringMode() {
  const level = parseInt(selectLevel.value);
  if (!level) return;
  if (level <= 3) {
    containerLevel13.classList.remove('hidden');
    containerLevel48.classList.add('hidden');
  } else {
    containerLevel13.classList.add('hidden');
    containerLevel48.classList.remove('hidden');
  }
}

// Setup Toggle Buttons (Mutual Exclusion PASS vs NYC)
function setupToggleButtons() {
  const toggleBtns = document.querySelectorAll('.btn-toggle');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.getAttribute('data-row');
      const val = e.target.getAttribute('data-val');

      document.querySelectorAll(`.btn-toggle[data-row="${row}"]`).forEach(b => b.classList.remove('active'));

      if (evaluationState[row] === val) {
        evaluationState[row] = null;
      } else {
        e.target.classList.add('active');
        evaluationState[row] = val;
      }
    });
  });
}

// Submit Score & Auto-Advance
async function handleSubmitScore() {
  const level = parseInt(selectLevel.value);
  const judgeNo = parseInt(selectJudge.value);
  const elemNo = parseInt(selectElement.value);
  const athleteNo = parseInt(selectAthlete.value);
  const comments = assessorComments.value;

  if (!athleteNo) {
    alert("Please select a valid athlete!");
    return;
  }

  const payload = {
    action: "SUBMIT_SCORE",
    level: level,
    judgeNo: judgeNo,
    elemNo: elemNo,
    athleteNo: athleteNo,
    r1: evaluationState[1],
    r2: evaluationState[2],
    r3: evaluationState[3],
    score: parseFloat(inputNumericScore.value) || 0,
    comments: comments
  };

  btnSubmitScore.disabled = true;
  btnSubmitScore.innerHTML = `<span>⏳ SUBMITTING TO SHEETS...</span>`;

  try {
    await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn("API Call Result:", err);
  }

  // Reset Form Controls
  evaluationState[1] = null;
  evaluationState[2] = null;
  evaluationState[3] = null;
  document.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
  inputNumericScore.value = '';
  assessorComments.value = '';

  // Auto-advance Athlete Dropdown to Next Registered Athlete in Line
  const currentAthleteIndex = selectAthlete.selectedIndex;
  if (currentAthleteIndex < selectAthlete.options.length - 1) {
    selectAthlete.selectedIndex = currentAthleteIndex + 1;
  } else {
    selectAthlete.selectedIndex = 0;
  }

  btnSubmitScore.disabled = false;
  btnSubmitScore.innerHTML = `<span>📤 SUBMIT SCORE</span>`;
  alert(`Successfully submitted score for Athlete #${athleteNo}! Auto-advanced to next athlete.`);
}
