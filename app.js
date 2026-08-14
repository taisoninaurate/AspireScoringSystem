// ASPIRE Mobile Web App - Secured Daily Calendar PIN & Endpoints
document.addEventListener("DOMContentLoaded", function() {

  // Deployed Apps Script Web App Endpoint
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby4O2eHnkm1eZ3ZUJbLcWIATH1te02Aheul-Ox8jtLn-AtrlFtQqLmgbvRtr7W6ab9p4w/exec";

  // PIN Overlay UI Elements
  const pinLockOverlay = document.getElementById("pin-lock-overlay");
  const pinCardBox = document.getElementById("pin-card-box");
  const pinErrorMsg = document.getElementById("pin-error-msg");
  const keyButtons = document.querySelectorAll(".key-btn[data-key]");
  const keyClearBtn = document.getElementById("key-clear");
  const keyDelBtn = document.getElementById("key-del");

  // In-Memory Security States (Zero localStorage footprint)
  let enteredPin = "";
  let sessionVerifiedPin = "";

  function updatePinDots() {
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`dot-${i}`);
      if (dot) {
        if (i < enteredPin.length) dot.classList.add("filled");
        else dot.classList.remove("filled");
      }
    }
  }

  function handleDigitInput(digit) {
    if (enteredPin.length < 4) {
      enteredPin += digit;
      updatePinDots();
      if (pinErrorMsg) pinErrorMsg.classList.add("hidden");
    }

    if (enteredPin.length === 4) {
      setTimeout(async () => {
        try {
          // Verify entered PIN against private calendar table on backend
          const response = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              action: "VERIFY_PIN",
              pin: enteredPin
            })
          });
          const resData = await response.json();

          if (resData.status === "success") {
            // Unlocked: Store valid PIN in memory for subsequent API authentications
            sessionVerifiedPin = enteredPin;
            
            // Sync assignments and setup dropdowns now that access is approved
            fetchLiveMasterData();

            if (pinLockOverlay) pinLockOverlay.classList.add("hidden");
            enteredPin = "";
            updatePinDots();
          } else {
            // Failure: Shake & Error
            if (pinErrorMsg) pinErrorMsg.classList.remove("hidden");
            if (pinCardBox) {
              pinCardBox.classList.add("pin-error");
              setTimeout(() => pinCardBox.classList.remove("pin-error"), 400);
            }
            enteredPin = "";
            updatePinDots();
          }
        } catch (err) {
          alert("❌ Network Error. Cannot verify PIN.");
          enteredPin = "";
          updatePinDots();
        }
      }, 150);
    }
  }

  function deleteLastDigit() {
    if (enteredPin.length > 0) {
      enteredPin = enteredPin.slice(0, -1);
      updatePinDots();
      if (pinErrorMsg) pinErrorMsg.classList.add("hidden");
    }
  }

  function clearPinInput() {
    enteredPin = "";
    updatePinDots();
    if (pinErrorMsg) pinErrorMsg.classList.add("hidden");
  }

  // Keypad Click Listeners
  keyButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      const k = this.getAttribute("data-key");
      if (k) handleDigitInput(k);
    });
  });

  if (keyDelBtn) keyDelBtn.addEventListener("click", deleteLastDigit);
  if (keyClearBtn) keyClearBtn.addEventListener("click", clearPinInput);

  // Physical Keyboard Listener (for laptops / desktops)
  document.addEventListener("keydown", function(e) {
    if (pinLockOverlay && !pinLockOverlay.classList.contains("hidden")) {
      if (e.key >= "0" && e.key <= "9") {
        handleDigitInput(e.key);
      } else if (e.key === "Backspace") {
        deleteLastDigit();
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
        clearPinInput();
      }
    }
  });

  // Official ASPIRE Reference Table Transcribed directly from Master Google Sheet
  const ELEMENTS_DATABASE = {
    // LEVEL 1 (9 Elements)
    1: {
      1: { name: "On Land – Right Split", desc: "On land right split assessment", req1: "Angle of at least 135° (approx. hips lower than yoga block)", req2: "Hips, shoulders and head in vertical line perpendicular to ground", req3: "Legs extended" },
      2: { name: "On Land – Left Split", desc: "On land left split assessment", req1: "Angle of at least 135° (approx. hips lower than yoga block)", req2: "Hips, shoulders and head in vertical line perpendicular to ground", req3: "Legs extended" },
      3: { name: "On Land – Middle Split", desc: "On land middle split assessment", req1: "Angle of at least 135° (approx. hips lower than yoga block)", req2: "Knee caps facing same direction", req3: "Legs extended" },
      4: { name: "Back Flutter Kick for 5 metres", desc: "Continuous back flutter kick travel for 5 meters", req1: "Continuous kicking and travelling", req2: "Kick from hips", req3: "Arms and body fully extended, hands together" },
      5: { name: "Side Flutter Kick on both sides for 5 metres each", desc: "Continuous side flutter kick travel on both sides", req1: "Continuous kicking and travelling", req2: "Kick from hips", req3: "Arms and body fully extended and facing same direction, hands straight" },
      6: { name: "Back Layout position", desc: "Back layout position with standard sculling", req1: "Body extended with face, chest, thighs and feet at surface of water", req2: "Understanding of standard sculling (palms tight, arms under hips, uniform motion)", req3: "Good control" },
      7: { name: "Front Layout position, face in the water", desc: "Front layout position with face submerged", req1: "Body extended with head, upper back, buttocks and heels at surface of water", req2: "Understanding of standard sculling (palms tight, arms under surface, uniform motion)", req3: "Good control" },
      8: { name: "Torpedo for 10 metres", desc: "Head-first torpedo travel for 10 meters", req1: "Body extended with face, chest, thighs and feet at surface of water", req2: "Smooth continuous travel, with uniformed sculling", req3: "Arms motion from elbows (overhead, under surface)" },
      9: { name: "Stationary Eggbeater with arms assisting", desc: "Eggbeater tread water with arm assistance", req1: "Uniform motion of rotation from knees", req2: "Knees wideout", req3: "Body position is in vertical line from head to hips" }
    },

    // LEVEL 2 (7 Elements)
    2: {
      1: { name: "Barrel Scull for 5 metres", desc: "Travel overhead in barrel scull position for 5 meters", req1: "Body extended with head, upper back, buttocks and heels at surface", req2: "Smooth continuous travel with uniformed sculling", req3: "Arms extended above head with small angle down (no more than 45°)" },
      2: { name: "Reverse Torpedo/Dolphin Scull for 5 metres", desc: "Travel feet-first for 5 meters with dolphin scull", req1: "Body extended with face, chest, thighs and feet at surface", req2: "Smooth continuous travel with uniformed sculling", req3: "Reverse Torpedo/Dolphin scull below surface (movement from elbows)" },
      3: { name: "Eggbeater sideways travel for 5 metres each side", desc: "Eggbeater sideways travel for 5 meters on each side", req1: "Uniform motion of rotation from knees", req2: "Smooth continuous travel", req3: "Body position in vertical line from head to hips" },
      4: { name: "Kick, Pull, Kick, Airplane, alternating sides, for 10 metres", desc: "Dynamic breaststroke kick and airplane arm stroke", req1: "Coordination between extended arm movements and kick", req2: "Efficient and dynamic breaststroke kick", req3: "Dynamic arms" },
      5: { name: "Body Boost without arms", desc: "Vertical body boost using leg kick only", req1: "Body is vertical at peak height of boost", req2: "Kick is performed in sideway motion", req3: "Boost is rapid, minimally at ribs height" },
      6: { name: "Ariana Rotation", desc: "6 counts in each position with split rotation", req1: "Legs at/or above water surface throughout rotation", req2: "Hips turn 180° around vertical line, showing angle of at least 135° in all splits", req3: "Legs extended throughout rotation" },
      7: { name: "Support scull", desc: "Support scull in vertical position", req1: "Palms facing bottom of pool. Uniform pressure on outward and inward scull motion", req2: "Head, shoulders and hips aligned with elbows tucked close to sides of body", req3: "-" }
    },

    // LEVEL 3 (8 Elements)
    3: {
      1: { name: "Back Layout position to Back Layout Bent Knee position", desc: "Transition from back layout to bent knee position", req1: "Good control and stability shown throughout element", req2: "Bent Knee Back Layout Position with thigh of bent leg perpendicular to surface (90°)", req3: "Body extended with face, chest, thighs and feet at surface" },
      2: { name: "Flamingo position", desc: "Flamingo position hold with ballet leg and bent leg", req1: "Vertical leg extended perpendicular to surface and positioned in middle of horizontal shin", req2: "Horizontal leg bent with foot, shin and knee parallel to surface", req3: "Standard scull demonstrated with control and stability" },
      3: { name: "Low Vertical position (Floatation)", desc: "Low vertical flotation with head and toes aligned", req1: "Body in vertical line (up to 10° allowance). Fully extended with head, shoulders, hips, toes aligned", req2: "Hands supporting with minimal sculling for balance and stability", req3: "-" },
      4: { name: "Back Tuck Somersault", desc: "Complete 360 degree backward somersault in compact tuck", req1: "Somersault rotation 360° executed in tight compact tuck position close to surface", req2: "Body as compact as possible, with back rounded and legs together", req3: "Return to Tuck position after rotation" },
      5: { name: "Split position to Vertical floatation", desc: "Close split legs symmetrically to vertical position", req1: "Legs close symmetrically to Vertical position at ankle level with good control", req2: "Split position with angle of at least 135° in split position", req3: "At ankle level, body in vertical line (up to 10° allowance)" },
      6: { name: "Pike position", desc: "Front pike position with 90 degree hip bend", req1: "Body bent at hips to form 90° angle (allowance of 10° from vertical line)", req2: "Trunk extended with back straight and head in line", req3: "Legs extension and together" },
      7: { name: "Inverted Tuck position", desc: "Tight inverted tuck position near surface", req1: "Tight tuck position with body rounded. Heels close to buttocks. Head close to knees", req2: "Show control and stability of position", req3: "-" },
      8: { name: "Eggbeater travelling forward for 5 metres", desc: "Forward eggbeater travel for 5 meters", req1: "Uniform motion of rotation from knees, with knees wide out", req2: "Body position in vertical line from head to hips", req3: "Smooth continuous travel" }
    },

    // LEVEL 4 (10 Elements)
    4: {
      1: { name: "Ballet Leg position", desc: "Ballet Leg position held at 90° to surface" },
      2: { name: "Bent Knee Vertical position", desc: "Vertical alignment with bent leg toe touching vertical leg knee" },
      3: { name: "Fishtail position", desc: "Horizontal leg extended at surface, vertical leg vertical" },
      4: { name: "Side Fishtail position", desc: "Swimmer facing assessors, fishtail held with extension" },
      5: { name: "Knight position", desc: "Lower back arched with head, shoulders and hips aligned" },
      6: { name: "Vertical position", desc: "Executed sideways to assessors" },
      7: { name: "Front Layout position to Front Pike position", desc: "Smooth transition into Front Pike" },
      8: { name: "Back Layout position to Surface Arch position", desc: "Smooth arch transition" },
      9: { name: "Barracuda thrust", desc: "Rapid vertical thrust from Back Pike to Vertical" },
      10: { name: "Part Figure: 363 - WaterDrop", desc: "Bent Knee Vertical, 180 Spin as bent leg extends to Vertical, Vertical Descent" }
    },

    // LEVEL 5 (9 Elements)
    5: {
      1: { name: "Side Flutter Kick to Eggbeater 1 arm to Side Flutter Kick", desc: "Side Flutter Kick (5m) to Eggbeater 1 arm travelling sideways (5m) to Side Flutter Kick (5m)" },
      2: { name: "Back layout to Bent Knee to Ballet Leg sequence", desc: "Back layout position to Bent Knee position to Ballet Leg position to Bent Knee position to Back Layout position" },
      3: { name: "Bent Knee Surface Arch to Arc to Back Layout", desc: "Bent Knee Surface Arch position to Arc position to Back Layout position" },
      4: { name: "Front Layout to Pike to Split position", desc: "Front Layout position to Pike position to Split position" },
      5: { name: "Front Layout to Pike to Bent Knee position", desc: "Front Layout position to Pike position to Bent Knee position" },
      6: { name: "Front Layout to Pike to Vertical position", desc: "Front Layout position to Pike position to Vertical position" },
      7: { name: "Part Figure: 227d SWANITA SPINNING 180°", desc: "From Right Fishtail Position, descending Spinning 180° to Vertical, Vertical Descent" },
      8: { name: "Part Figure: 311 KIP", desc: "From Inverted Tuck position, trunk unrolls as legs straighten to Vertical Position" },
      9: { name: "Part Figure: 311j KIP", desc: "From vertical position, rapid Combined Spin (360° + 360°) followed by rapid Vertical Descent" }
    },

    // LEVEL 6 (7 Elements)
    6: {
      1: { name: "Part Figure: 106 - Straight Ballet Leg", desc: "Back Layout position to Ballet Leg" },
      2: { name: "Whole figure: 301 - Barracuda", desc: "Figure 301 : Barracuda Thrust with entrance" },
      3: { name: "Part Figure: 359 - Front Ariana", desc: "From split position, Walkout Front is executed to back layout" },
      4: { name: "Part Figure: 348 - Tower", desc: "Fishtail Position. Horizontal leg lifted to Vertical Position. Vertical Descent" },
      5: { name: "Part Figure: 363 - Water Drop", desc: "Bent Knee Vertical Position. Half Twist. 180° Spin as bent leg extends to Vertical. Vertical Descent" },
      6: { name: "Part Figure: 401 - Swordfish", desc: "From Bent Knee Front Layout Position. Back arches as extended leg lifted in 180° arc to Bent Knee Surface Arch" },
      7: { name: "Part Figure: 227d - Swanita Spinning 180°", desc: "From Back Layout Position to Bent Knee Surface Arch. Straightened to Knight Position. 180° rotation to Fishtail" }
    },

    // LEVEL 7 (12 Elements)
    7: {
      1: { name: "Part Figure: 307 - Flying Fish", desc: "From Back Layout Position legs raised to vertical as body submerged to Back Pike... Thrust to Vertical... Vertical Descent" },
      2: { name: "Part Figure: 437 Cyclone, Open 180°", desc: "From Back Layout Position Bent Knee Surface Arch... Simultaneous lift to Vertical as 180° Twirl is executed..." },
      3: { name: "Whole Figure: 308h Barracuda Airborne Split Spin Up 180°", desc: "The whole figure" },
      4: { name: "Part Figure: 407 Swordfish Straight Leg Ariana Rotation", desc: "From Front Layout Position back arches as one leg lifted in 180° arc to Split... Ariana Rotation" },
      5: { name: "Part Figure: 356f Whip Continuous Spin 720°", desc: "Vertical Position. All remaining movements rapid. One leg lowered to Fishtail... Continuous Spin 720°" },
      6: { name: "Part Figure: 441 Saturn", desc: "Knight Position. Body rotates 180° to Fishtail Position. 180° Twirl as horizontal leg lifted to Vertical. Vertical Descent" },
      7: { name: "Part Figure: 352 Venus", desc: "From Front Pike Position. One leg lifted to Fishtail. Horizontal leg bent to Bent Knee Vertical. Rotation 360°... Vertical" },
      8: { name: "Part Figure: 240i Albatross Spin up 360°", desc: "Half Twist. Maintaining Bent Knee Vertical, Vertical Descent to ankle. Spin Up 360° to Vertical. Vertical Descent" },
      9: { name: "Part Figure: 140j - Flamingo Bent Knee Combined Spin 360°", desc: "From Surface Flamingo Position, ballet leg maintains vertical position, hips lifted as trunk unrolls... Combined spin 360°" },
      10: { name: "Whole figure: 421 Walkover Back Closing 360°", desc: "The whole figure" },
      11: { name: "Part Figure: 440d Ipanema Spinning 180°", desc: "From Vertical position, legs lowered to Front Pike Position. Rapid 180° rotation as legs lifted to Vertical" },
      12: { name: "Part Figure: 154f - London Continuous Spin 720", desc: "Ballet Leg assumed. Partial Somersault Back Tuck... Rapidly straightened to Vertical... Continuous Spin 720" }
    },

    // LEVEL 8 (5 Elements)
    8: {
      1: { name: "Team Element 1: 1A – Flying Fish Hybrid Spinning 180°", desc: "1A – Flying Fish Hybrid Spinning 180°" },
      2: { name: "Team Element 2: 2B - Vertical - Half Twist to Bent Knee", desc: "2B - Vertical - Half Twist to Bent Knee - Half Twist to Vertical – Split - Walkout" },
      3: { name: "Team Element 3: 3B – Two Fouetté Rotations", desc: "3B – Two Fouetté Rotations – Vertical –Spinning 360°" },
      4: { name: "Team Element 4: 4 - Butterfly Hybrid D", desc: "4 - Butterfly Hybrid D" },
      5: { name: "Team Element 5: 5B-Rocket Split Bent Knee Hybrid", desc: "5B-Rocket Split Bent Knee Hybrid" }
    }
  };

  // State
  let liveUniqueLevels = [];
  let liveJudgeMatrix = {};
  let liveSwimmerAssignments = {};

  // UI Element Selectors
  const selectLevel = document.getElementById("select-level");
  const selectJudge = document.getElementById("select-judge");
  const selectElement = document.getElementById("select-element");
  const selectAthlete = document.getElementById("select-athlete");
  const displayJudgeName = document.getElementById("display-judge-name");
  
  const elementNumberTag = document.getElementById("element-number-tag");
  const elementNameTitle = document.getElementById("element-name-title");
  const elementSubtitleDesc = document.getElementById("element-subtitle-desc");

  const reqText1 = document.getElementById("req-text-1");
  const reqText2 = document.getElementById("req-text-2");
  const reqText3 = document.getElementById("req-text-3");

  const level13Container = document.getElementById("level-1-3-container");
  const level48Container = document.getElementById("level-4-8-container");
  const inputNumericScore = document.getElementById("input-numeric-score");
  const assessorComments = document.getElementById("assessor-comments");
  const btnSubmitScore = document.getElementById("btn-submit-score");
  const liveStatusBadge = document.getElementById("live-status-badge");

  const btnFetchScores = document.getElementById("btn-fetch-scores");
  const scoresModal = document.getElementById("scores-modal");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalScoresBody = document.getElementById("modal-scores-body");

  let requirementStates = { 1: null, 2: null, 3: null };

  // Explicitly clear main input fields on page load
  resetMainScoringInputs();

  // 1. Fetch Dynamic Data from Database Web API (Secure POST Request with Verified Session PIN)
  async function fetchLiveMasterData() {
    if (liveStatusBadge) liveStatusBadge.textContent = "● SYNCING WITH DATABASE...";
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "GET_INITIAL_DATA",
          pin: sessionVerifiedPin
        })
      });
      const data = await response.json();

      if (data.status === "success") {
        if (data.uniqueLevels && data.uniqueLevels.length > 0) liveUniqueLevels = data.uniqueLevels;
        if (data.judgeMatrix) liveJudgeMatrix = data.judgeMatrix;
        if (data.swimmerAssignments) liveSwimmerAssignments = data.swimmerAssignments;

        if (liveStatusBadge) liveStatusBadge.textContent = "● LIVE DATABASE SYNCED";
        populateLevelDropdown();
      } else {
        if (liveStatusBadge) liveStatusBadge.textContent = "● SYNC ERROR: UNAUTHORIZED";
      }
    } catch (err) {
      console.warn("Could not connect to live database:", err);
      if (liveStatusBadge) liveStatusBadge.textContent = "● OFFLINE / MANUAL MODE";
    }
  }

  function populateLevelDropdown() {
    selectLevel.innerHTML = "";
    if (liveUniqueLevels.length === 0) {
      for (let l = 1; l <= 8; l++) {
        const opt = document.createElement("option");
        opt.value = l;
        opt.textContent = `Level ${l}`;
        selectLevel.appendChild(opt);
      }
    } else {
      liveUniqueLevels.forEach(lvl => {
        const opt = document.createElement("option");
        opt.value = lvl;
        opt.textContent = `Level ${lvl}`;
        selectLevel.appendChild(opt);
      });
    }
    updateDropdowns();
  }

  function updateDropdowns() {
    const level = parseInt(selectLevel.value) || 1;

    // Populate Element Dropdown
    selectElement.innerHTML = "";
    const levelElems = ELEMENTS_DATABASE[level] || {};
    const maxElems = Object.keys(levelElems).length || 9;

    for (let e = 1; e <= maxElems; e++) {
      const opt = document.createElement("option");
      opt.value = e;
      opt.textContent = `Element ${e}`;
      selectElement.appendChild(opt);
    }

    // Populate Athlete Dropdown
    selectAthlete.innerHTML = "";
    const registeredAthletes = liveSwimmerAssignments[level] || [];

    if (registeredAthletes.length === 0) {
      for (let a = 1; a <= 15; a++) {
        const opt = document.createElement("option");
        opt.value = a;
        opt.textContent = `Athlete #${a}`;
        selectAthlete.appendChild(opt);
      }
    } else {
      registeredAthletes.forEach(athNo => {
        const opt = document.createElement("option");
        opt.value = athNo;
        opt.textContent = `Athlete #${athNo}`;
        selectAthlete.appendChild(opt);
      });
    }

    updateJudgeName();
    updateManualCard();
    updateScoringMode();
    resetMainScoringInputs();
  }

  function updateJudgeName() {
    const level = selectLevel.value;
    const elemNo = selectElement.value;
    const judgeNo = selectJudge.value;
    const key = `${level}-${elemNo}-${judgeNo}`;
    displayJudgeName.textContent = liveJudgeMatrix[key] || `Judge ${judgeNo}`;
  }

  function updateManualCard() {
    const level = parseInt(selectLevel.value) || 1;
    const elemNo = parseInt(selectElement.value) || 1;
    const elemData = (ELEMENTS_DATABASE[level] && ELEMENTS_DATABASE[level][elemNo]) ? 
                     ELEMENTS_DATABASE[level][elemNo] : 
                     { name: `Element ${elemNo}`, desc: `Perform element ${elemNo} according to bulletin` };

    elementNumberTag.textContent = `Level ${level} - Element ${elemNo}`;
    elementNameTitle.textContent = elemData.name;
    elementSubtitleDesc.textContent = elemData.desc;

    // Dynamically update Level 1-3 Requirements text from Table Reference
    if (level <= 3) {
      if (reqText1) reqText1.textContent = elemData.req1 || "Requirement 1 evaluation";
      if (reqText2) reqText2.textContent = elemData.req2 || "Requirement 2 evaluation";
      if (reqText3) reqText3.textContent = elemData.req3 || "Requirement 3 evaluation";
    }
  }

  function updateScoringMode() {
    const level = parseInt(selectLevel.value) || 1;
    if (level <= 3) {
      level13Container.classList.remove("hidden");
      level48Container.classList.add("hidden");
    } else {
      level13Container.classList.add("hidden");
      level48Container.classList.remove("hidden");
    }
  }

  function resetMainScoringInputs() {
    requirementStates = { 1: null, 2: null, 3: null };
    document.querySelectorAll(".btn-toggle").forEach(btn => btn.classList.remove("active"));
    if (inputNumericScore) inputNumericScore.value = "";
    if (assessorComments) assessorComments.value = "";
  }

  function highlightToggle(row, val) {
    requirementStates[row] = val;
    const btnPass = document.querySelector(`.btn-pass[data-row="${row}"]`);
    const btnNyc = document.querySelector(`.btn-nyc[data-row="${row}"]`);
    if (val === "C") {
      if (btnPass) btnPass.classList.add("active");
      if (btnNyc) btnNyc.classList.remove("active");
    } else if (val === "NYC") {
      if (btnNyc) btnNyc.classList.add("active");
      if (btnPass) btnPass.classList.remove("active");
    }
  }

  // Toggle button event handlers
  document.querySelectorAll(".btn-toggle").forEach(button => {
    button.addEventListener("click", function() {
      const row = this.getAttribute("data-row");
      const val = this.getAttribute("data-val");
      highlightToggle(row, val);
    });
  });

  // Event Listeners for Dropdowns (Always Reset Inputs to Blank)
  selectLevel.addEventListener("change", updateDropdowns);
  selectJudge.addEventListener("change", function() {
    updateJudgeName();
    resetMainScoringInputs();
  });
  selectElement.addEventListener("change", function() {
    updateJudgeName();
    updateManualCard();
    resetMainScoringInputs();
  });
  selectAthlete.addEventListener("change", resetMainScoringInputs);

  // Submit Score Handler (Secure POST Request passing Verified Session PIN)
  btnSubmitScore.addEventListener("click", async function() {
    const level = parseInt(selectLevel.value);
    const judgeNo = parseInt(selectJudge.value);
    const elemNo = parseInt(selectElement.value);
    const athleteNo = parseInt(selectAthlete.value);
    const comments = assessorComments.value.trim();

    const payload = {
      action: "SUBMIT_SCORE",
      pin: sessionVerifiedPin,
      level: level,
      judgeNo: judgeNo,
      elemNo: elemNo,
      athleteNo: athleteNo,
      comments: comments
    };

    if (level <= 3) {
      payload.r1 = requirementStates[1] || "";
      payload.r2 = requirementStates[2] || "";
      payload.r3 = requirementStates[3] || "";
    } else {
      payload.score = parseFloat(inputNumericScore.value) || 0.0;
    }

    btnSubmitScore.disabled = true;
    btnSubmitScore.innerHTML = "<span>⏳ SUBMITTING...</span>";

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();

      if (resData.status === "success") {
        alert(`✅ Score for Athlete #${athleteNo} (Element ${elemNo}) submitted successfully!`);
        resetMainScoringInputs();
        
        // Auto-advance to next athlete
        if (selectAthlete.selectedIndex < selectAthlete.options.length - 1) {
          selectAthlete.selectedIndex++;
          resetMainScoringInputs();
        }
      } else {
        alert("⚠️ Submission Error: " + resData.message);
      }
    } catch (err) {
      alert("❌ Submission Failed. Check network connection.");
    } finally {
      btnSubmitScore.disabled = false;
      btnSubmitScore.innerHTML = "<span>📤 SUBMIT SCORE</span>";
    }
  });

  // Focused 1-Session View Score Handler (Secure query passing Verified Session PIN)
  if (btnFetchScores) {
    btnFetchScores.addEventListener("click", async function(e) {
      if (e) e.preventDefault();
      
      const level = parseInt(selectLevel.value);
      const judgeNo = parseInt(selectJudge.value);
      const elemNo = parseInt(selectElement.value);
      const athleteNo = parseInt(selectAthlete.value);
      const judgeName = displayJudgeName.textContent;

      modalTitle.textContent = `📊 Current Session Score Record`;
      scoresModal.classList.remove("hidden");
      modalScoresBody.innerHTML = `<div class="loading-spinner" style="padding:20px; text-align:center; color:#94a3b8;">Fetching score from Google Sheets...</div>`;

      try {
        const getUrl = `${APPS_SCRIPT_URL}?action=GET_SCORES&level=${level}&athleteNo=${athleteNo}&pin=${encodeURIComponent(sessionVerifiedPin)}`;
        const response = await fetch(getUrl);
        const data = await response.json();

        if (data.status === "success" && data.scores && data.scores[elemNo]) {
          const elemData = data.scores[elemNo];
          const judgeData = elemData[`j${judgeNo}`];

          renderSingleScoreCard(level, judgeNo, judgeName, elemNo, athleteNo, judgeData);
        } else {
          renderEmptySingleScoreCard(level, judgeNo, judgeName, elemNo, athleteNo);
        }
      } catch (err) {
        modalScoresBody.innerHTML = `<p style="color:#ef4444; padding:20px; text-align:center;">Failed to fetch score. Please check network connection.</p>`;
      }
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", function() {
      scoresModal.classList.add("hidden");
    });
  }

  function renderSingleScoreCard(level, judgeNo, judgeName, elemNo, athleteNo, judgeData) {
    let scoreDisplay = "";
    let commentsDisplay = (judgeData && judgeData.comments && judgeData.comments.toString().trim() !== "") ? 
                          judgeData.comments : "No comments entered";

    if (level <= 3) {
      const r1 = (judgeData && judgeData.r1) ? judgeData.r1 : "-";
      const r2 = (judgeData && judgeData.r2) ? judgeData.r2 : "-";
      const r3 = (judgeData && judgeData.r3) ? judgeData.r3 : "-";

      scoreDisplay = `
        <div class="single-score-grid">
          <div class="score-box-item">
            <span class="box-lbl">Req 1</span>
            <span class="box-val ${r1==='C'||r1==='Comp'?'val-pass':'val-nyc'}">${r1}</span>
          </div>
          <div class="score-box-item">
            <span class="box-lbl">Req 2</span>
            <span class="box-val ${r2==='C'||r2==='Comp'?'val-pass':'val-nyc'}">${r2}</span>
          </div>
          <div class="score-box-item">
            <span class="box-lbl">Req 3</span>
            <span class="box-val ${r3==='C'||r3==='Comp'?'val-pass':'val-nyc'}">${r3}</span>
          </div>
        </div>`;
    } else {
      const scoreVal = (judgeData && judgeData.score !== undefined && judgeData.score !== "" && judgeData.score !== null) ? 
                       parseFloat(judgeData.score).toFixed(1) : "0.0";
      
      scoreDisplay = `<div class="single-numeric-score-display">${scoreVal}</div>`;
    }

    modalScoresBody.innerHTML = `
      <div class="single-session-card">
        <div class="session-card-header">
          <div class="session-info">
            <span class="badge-tag">Level ${level} • Element ${elemNo}</span>
            <h2>Athlete #${athleteNo}</h2>
          </div>
          <div class="judge-info-badge">
            <span class="j-title">Judge ${judgeNo}</span>
            <span class="j-name">${judgeName}</span>
          </div>
        </div>

        <div class="session-card-body">
          <label class="info-label">Submitted Evaluation:</label>
          ${scoreDisplay}

          <label class="info-label" style="margin-top:16px;">Assessor Comments:</label>
          <div class="comments-output-box">${commentsDisplay}</div>
        </div>
      </div>`;
  }

  function renderEmptySingleScoreCard(level, judgeNo, judgeName, elemNo, athleteNo) {
    modalScoresBody.innerHTML = `
      <div class="single-session-card empty-state">
        <div class="session-card-header">
          <div class="session-info">
            <span class="badge-tag">Level ${level} • Element ${elemNo}</span>
            <h2>Athlete #${athleteNo}</h2>
          </div>
          <div class="judge-info-badge">
            <span class="j-title">Judge ${judgeNo}</span>
            <span class="j-name">${judgeName}</span>
          </div>
        </div>
        <div class="session-card-body">
          <div class="empty-alert-box">
            ⚠️ No score has been submitted yet for this session.
          </div>
        </div>
      </div>`;
  }
});
