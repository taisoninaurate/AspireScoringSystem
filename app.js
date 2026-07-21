// ASPIRE Mobile Web App - 100% Dynamic Engine with Live Submitted Score Viewing & Fetching
document.addEventListener("DOMContentLoaded", function() {

  // Deployed Apps Script Web App Endpoint
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby4O2eHnkm1eZ3ZUJbLcWIATH1te02Aheul-Ox8jtLn-AtrlFtQqLmgbvRtr7W6ab9p4w/exec";

  // Elements database for manual card descriptions
  const ELEMENTS_DATABASE = {
    1: {
      1: { name: "Stationary Scull & Layout", desc: "10 seconds in back layout position with stationary sculling" },
      2: { name: "Torpedo Scull & Travel", desc: "Head-first travel in back layout for 5 meters" },
      3: { name: "Tub Position Hold", desc: "Bend one knee to tub position, hold for 5 counts" },
      4: { name: "Ballet Leg Attempt", desc: "Raise leg to 90 degrees ballet leg position" },
      5: { name: "Submerged Back Layout", desc: "Sink to chest depth in back layout position" },
      6: { name: "Front Layout Hold", desc: "Hold front layout position with face in water" },
      7: { name: "Eggbeater Tread Water", desc: "15 seconds eggbeater tread with arms out" },
      8: { name: "Somersault Back Tuck", desc: "Complete 360 degree backward somersault in tuck" },
      9: { name: "Final Layout Cadence", desc: "Finish in crisp back layout with arm cadence" }
    },
    2: {
      1: { name: "Front Layout & Surface Scull", desc: "Hold front layout for 5 counts before transition" },
      2: { name: "Ballet Leg Double Hold", desc: "Lift right leg then left leg to single ballet leg" },
      3: { name: "Flamingo Position Hold", desc: "Pull leg to chest in flamingo position for 5 counts" },
      4: { name: "Submarine Scull Attempt", desc: "Scull with ballet leg submerged underwater" },
      5: { name: "Pike Position Transition", desc: "Bend hips to 90 degree front pike position" },
      6: { name: "Ariana Rotation", desc: "6 counts in each position" },
      7: { name: "Vertical Twist 180°", desc: "Complete 180 degree rotation in vertical position" }
    },
    3: {
      1: { name: "Kip Up to Vertical", desc: "Tuck, roll backward and extend to vertical" },
      2: { name: "Height Hold in Vertical", desc: "Maintain ankles above surface for 6 counts" },
      3: { name: "Split Position Extension", desc: "Lower legs into full split position" },
      4: { name: "Knight Position Transition", desc: "Bend front leg to knight position" },
      5: { name: "Perp Walk Travel", desc: "Travel sideways in back layout with perp scull" },
      6: { name: "Spin 360° Descent", desc: "Execute 360 degree spin during vertical descent" },
      7: { name: "Catalina Rotation", desc: "Rotate from ballet leg to crane position" },
      8: { name: "Combined Cadence Finish", desc: "Synchronized arm and leg sequence" }
    },
    4: {
      1: { name: "Barrakuda Thrust", desc: "Thrust upward from back pike to maximum height" },
      2: { name: "Hero Split Transition", desc: "Move from vertical to split with uniform speed" },
      3: { name: "Porpoise Continuous Spin", desc: "180 degree spin in front pike to vertical" },
      4: { name: "London Position Hold", desc: "Maintain London position for 4 counts" },
      5: { name: "Aurora Twist 360°", desc: "Full 360 rotation in Aurora position" },
      6: { name: "Manta Ray Extension", desc: "Arch back into Manta Ray position" },
      7: { name: "Swordsman Rotation", desc: "Rapid leg swing into Knight position" },
      8: { name: "Sub-Ballet Leg Double", desc: "Double ballet leg underwater travel" },
      9: { name: "Walkout Front", desc: "Step out from split to front layout" },
      10: { name: "Vertical Descent Controlled", desc: "Slow uniform descent to toes" }
    },
    5: {
      1: { name: "Flying Fish Thrust", desc: "Maximum height thrust into vertical" },
      2: { name: "Venus Twist 720°", desc: "Double continuous spin in Venus position" },
      3: { name: "Ibis Continuous Spin", desc: "Full 360 spin during Ibis descent" },
      4: { name: "Jupiter Position Hold", desc: "Hold Jupiter position for 6 counts" },
      5: { name: "Oceania Cadence", desc: "High-speed leg cadence sequence" },
      6: { name: "Albatross Roll", desc: "Lateral roll in Albatross position" },
      7: { name: "Butterfly Split Thrust", desc: "Thrust into 180 split with rapid join" },
      8: { name: "Submerged Twist 360°", desc: "Underwater full twist to layout" },
      9: { name: "Walkout Back", desc: "Arc backward to back layout" }
    },
    6: {
      1: { name: "Barracuda Airborne", desc: "Maximum height airborne thrust" },
      2: { name: "Twallow Spin 360°", desc: "Spin 360 in Twallow position" },
      3: { name: "Pirouette Vertical", desc: "Double rapid pirouette at maximum height" },
      4: { name: "Helicopter Leg Swing", desc: "Continuous 360 leg sweep in split" },
      5: { name: "Gavia Rotation", desc: "Complex rotation in Gavia position" },
      6: { name: "Reverse Catalina", desc: "Ballet leg rotation into back layout" },
      7: { name: "Grand Finish Vertical", desc: "Controlled descent with zero sway" }
    },
    7: {
      1: { name: "Level 7 Element 1", desc: "Senior Elite Figure Element 1" },
      2: { name: "Level 7 Element 2", desc: "Senior Elite Figure Element 2" },
      3: { name: "Level 7 Element 3", desc: "Senior Elite Figure Element 3" },
      4: { name: "Level 7 Element 4", desc: "Senior Elite Figure Element 4" },
      5: { name: "Level 7 Element 5", desc: "Senior Elite Figure Element 5" },
      6: { name: "Level 7 Element 6", desc: "Senior Elite Figure Element 6" },
      7: { name: "Level 7 Element 7", desc: "Senior Elite Figure Element 7" },
      8: { name: "Level 7 Element 8", desc: "Senior Elite Figure Element 8" },
      9: { name: "Level 7 Element 9", desc: "Senior Elite Figure Element 9" },
      10: { name: "Level 7 Element 10", desc: "Senior Elite Figure Element 10" },
      11: { name: "Level 7 Element 11", desc: "Senior Elite Figure Element 11" },
      12: { name: "Level 7 Element 12", desc: "Senior Elite Figure Element 12" }
    },
    8: {
      1: { name: "Championship Element 1", desc: "Platinum Championship Element 1" },
      2: { name: "Championship Element 2", desc: "Platinum Championship Element 2" },
      3: { name: "Championship Element 3", desc: "Platinum Championship Element 3" },
      4: { name: "Championship Element 4", desc: "Platinum Championship Element 4" },
      5: { name: "Championship Element 5", desc: "Platinum Championship Element 5" }
    }
  };

  // State
  let liveUniqueLevels = [];
  let liveJudgeMatrix = {};
  let liveSwimmerAssignments = {};
  let currentAthleteSubmittedScores = {};

  // UI Element Selectors
  const selectLevel = document.getElementById("select-level");
  const selectJudge = document.getElementById("select-judge");
  const selectElement = document.getElementById("select-element");
  const selectAthlete = document.getElementById("select-athlete");
  const displayJudgeName = document.getElementById("display-judge-name");
  
  const elementNumberTag = document.getElementById("element-number-tag");
  const elementNameTitle = document.getElementById("element-name-title");
  const elementSubtitleDesc = document.getElementById("element-subtitle-desc");

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

  // 1. Fetch Dynamic Data from Google Apps Script Web API
  async function fetchLiveMasterData() {
    if (liveStatusBadge) liveStatusBadge.textContent = "● SYNCING WITH GOOGLE SHEETS...";
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "GET_INITIAL_DATA" })
      });
      const data = await response.json();

      if (data.status === "success") {
        if (data.uniqueLevels && data.uniqueLevels.length > 0) liveUniqueLevels = data.uniqueLevels;
        if (data.judgeMatrix) liveJudgeMatrix = data.judgeMatrix;
        if (data.swimmerAssignments) liveSwimmerAssignments = data.swimmerAssignments;

        if (liveStatusBadge) liveStatusBadge.textContent = "● LIVE GOOGLE SHEETS SYNCED";
        populateLevelDropdown();
      }
    } catch (err) {
      console.warn("Could not connect to live Apps Script:", err);
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
    const judgeNo = selectJudge.value || "1";

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
    fetchAthleteSubmittedScores();
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

  // Fetch submitted scores for selected Athlete & Level
  async function fetchAthleteSubmittedScores() {
    const level = parseInt(selectLevel.value) || 1;
    const athleteNo = parseInt(selectAthlete.value) || 1;
    const judgeNo = parseInt(selectJudge.value) || 1;
    const elemNo = parseInt(selectElement.value) || 1;

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "GET_SCORES", level: level, athleteNo: athleteNo })
      });
      const data = await response.json();

      if (data.status === "success" && data.scores) {
        currentAthleteSubmittedScores = data.scores;
        populateCurrentSubmittedScore(elemNo, judgeNo, level);
      }
    } catch (err) {
      console.warn("Could not fetch submitted scores:", err);
    }
  }

  function populateCurrentSubmittedScore(elemNo, judgeNo, level) {
    const elemScores = currentAthleteSubmittedScores[elemNo];
    if (!elemScores) return;

    const judgeKey = `j${judgeNo}`;
    const judgeData = elemScores[judgeKey];
    if (!judgeData) return;

    if (level <= 3) {
      resetToggleButtons();
      if (judgeData.r1 === "C" || judgeData.r1 === "Comp") highlightToggle(1, "C");
      else if (judgeData.r1 === "NYC") highlightToggle(1, "NYC");

      if (judgeData.r2 === "C" || judgeData.r2 === "Comp") highlightToggle(2, "C");
      else if (judgeData.r2 === "NYC") highlightToggle(2, "NYC");

      if (judgeData.r3 === "C" || judgeData.r3 === "Comp") highlightToggle(3, "C");
      else if (judgeData.r3 === "NYC") highlightToggle(3, "NYC");

      if (judgeData.comments) assessorComments.value = judgeData.comments;
    } else {
      if (judgeData.score !== undefined && judgeData.score !== "" && judgeData.score !== null) {
        inputNumericScore.value = judgeData.score;
      } else {
        inputNumericScore.value = "";
      }
      if (judgeData.comments) assessorComments.value = judgeData.comments;
    }
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

  function resetToggleButtons() {
    requirementStates = { 1: null, 2: null, 3: null };
    document.querySelectorAll(".btn-toggle").forEach(btn => btn.classList.remove("active"));
    assessorComments.value = "";
    inputNumericScore.value = "";
  }

  // Toggle button event handlers
  document.querySelectorAll(".btn-toggle").forEach(button => {
    button.addEventListener("click", function() {
      const row = this.getAttribute("data-row");
      const val = this.getAttribute("data-val");
      highlightToggle(row, val);
    });
  });

  // Event Listeners for Dropdowns
  selectLevel.addEventListener("change", updateDropdowns);
  selectJudge.addEventListener("change", function() {
    updateJudgeName();
    populateCurrentSubmittedScore(selectElement.value, selectJudge.value, selectLevel.value);
  });
  selectElement.addEventListener("change", function() {
    updateJudgeName();
    updateManualCard();
    populateCurrentSubmittedScore(selectElement.value, selectJudge.value, selectLevel.value);
  });
  selectAthlete.addEventListener("change", fetchAthleteSubmittedScores);

  // Submit Score Handler
  btnSubmitScore.addEventListener("click", async function() {
    const level = parseInt(selectLevel.value);
    const judgeNo = parseInt(selectJudge.value);
    const elemNo = parseInt(selectElement.value);
    const athleteNo = parseInt(selectAthlete.value);
    const comments = assessorComments.value.trim();

    const payload = {
      action: "SUBMIT_SCORE",
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
        resetToggleButtons();
        
        // Auto-advance to next athlete
        if (selectAthlete.selectedIndex < selectAthlete.options.length - 1) {
          selectAthlete.selectedIndex++;
          fetchAthleteSubmittedScores();
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

  // View Submitted Scores Modal Handler
  btnFetchScores.addEventListener("click", async function() {
    const level = parseInt(selectLevel.value);
    const athleteNo = parseInt(selectAthlete.value);
    modalTitle.textContent = `📊 Submitted Scores - Athlete #${athleteNo} (Level ${level})`;
    scoresModal.classList.remove("hidden");
    modalScoresBody.innerHTML = `<div class="loading-spinner">Loading scores from Google Sheets...</div>`;

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "GET_SCORES", level: level, athleteNo: athleteNo })
      });
      const data = await response.json();

      if (data.status === "success" && data.scores) {
        renderScoresTable(data.scores, level);
      } else {
        modalScoresBody.innerHTML = `<p style="color:#ef4444;">No submitted scores found for Athlete #${athleteNo}.</p>`;
      }
    } catch (err) {
      modalScoresBody.innerHTML = `<p style="color:#ef4444;">Failed to fetch scores. Please try again.</p>`;
    }
  });

  btnCloseModal.addEventListener("click", function() {
    scoresModal.classList.add("hidden");
  });

  function renderScoresTable(scores, level) {
    let html = `<table class="score-table">
      <thead>
        <tr>
          <th>Elem #</th>
          <th>Judge 1</th>
          <th>Judge 2</th>
          <th>Judge 3</th>
        </tr>
      </thead>
      <tbody>`;

    for (let e = 1; e <= 12; e++) {
      const elemData = scores[e];
      if (!elemData) continue;

      if (level <= 3) {
        const j1Text = elemData.j1.r1 ? `R1:${elemData.j1.r1} R2:${elemData.j1.r2} R3:${elemData.j1.r3}` : "-";
        const j2Text = elemData.j2.r1 ? `R1:${elemData.j2.r1} R2:${elemData.j2.r2} R3:${elemData.j2.r3}` : "-";
        const j3Text = elemData.j3.r1 ? `R1:${elemData.j3.r1} R2:${elemData.j3.r2} R3:${elemData.j3.r3}` : "-";

        html += `<tr>
          <td><strong>Elem ${e}</strong></td>
          <td><span class="score-badge-pass">${j1Text}</span></td>
          <td><span class="score-badge-pass">${j2Text}</span></td>
          <td><span class="score-badge-pass">${j3Text}</span></td>
        </tr>`;
      } else {
        const j1Val = elemData.j1.score !== "" && elemData.j1.score !== undefined ? elemData.j1.score : "-";
        const j2Val = elemData.j2.score !== "" && elemData.j2.score !== undefined ? elemData.j2.score : "-";
        const j3Val = elemData.j3.score !== "" && elemData.j3.score !== undefined ? elemData.j3.score : "-";

        html += `<tr>
          <td><strong>Elem ${e}</strong></td>
          <td><span class="score-badge-num">${j1Val}</span></td>
          <td><span class="score-badge-num">${j2Val}</span></td>
          <td><span class="score-badge-num">${j3Val}</span></td>
        </tr>`;
      }
    }

    html += `</tbody></table>`;
    modalScoresBody.innerHTML = html;
  }

  // Initial Load
  fetchLiveMasterData();
});
