/**
 * ==============================================================================================
 * ASPIRE ARTISTIC SWIMMING - PURE DYNAMIC GOOGLE APPS SCRIPT WEB APP REST API
 * ==============================================================================================
 */

function doGet(e) {
  return handleGetInitialData();
}

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;

    if (action === "GET_INITIAL_DATA") return handleGetInitialData();

    if (action === "SUBMIT_SCORE") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const level = contents.level;
      const judgeNo = contents.judgeNo;
      const elemNo = contents.elemNo;
      const athleteNo = contents.athleteNo;
      const comments = contents.comments;

      if (level <= 3) {
        const targetSheet = ss.getSheetByName('5_Scoring_Level_1-3');
        const data = targetSheet.getRange("B6:E155").getValues();
        let targetRow = -1;
        for (let i = 0; i < data.length; i++) {
          if (data[i][0] == athleteNo && data[i][3] == level) {
            targetRow = 6 + i;
            break;
          }
        }
        if (targetRow !== -1) {
          const startCol = 20 + (elemNo - 1) * 12;
          targetSheet.getRange(targetRow, startCol + (judgeNo - 1)).setValue(contents.r1 || "");
          targetSheet.getRange(targetRow, startCol + 3 + (judgeNo - 1)).setValue(contents.r2 || "");
          targetSheet.getRange(targetRow, startCol + 6 + (judgeNo - 1)).setValue(contents.r3 || "");
          if (comments) targetSheet.getRange(targetRow, startCol + 9 + (judgeNo - 1)).setValue(comments);
        }
      } else {
        const targetSheet = ss.getSheetByName('6_Scoring_Level_4-8');
        const data = targetSheet.getRange("B6:E155").getValues();
        let targetRow = -1;
        for (let i = 0; i < data.length; i++) {
          if (data[i][0] == athleteNo && data[i][3] == level) {
            targetRow = 6 + i;
            break;
          }
        }
        if (targetRow !== -1) {
          const startCol = 20 + (elemNo - 1) * 6;
          targetSheet.getRange(targetRow, startCol + (judgeNo - 1)).setValue(contents.score || 0);
          if (comments) targetSheet.getRange(targetRow, startCol + 3 + (judgeNo - 1)).setValue(comments);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Score submitted successfully" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return handleGetInitialData();

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleGetInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const judgeSheet = ss.getSheetByName('2_Judge_Assignment');
  const swimmerSheet = ss.getSheetByName('3_Swimmer_Assignment');
  const overviewSheet = ss.getSheetByName('4_Overview');

  // 1. DYNAMIC JUDGE ASSIGNMENT RANGE C4:N27 (24 rows x 12 cols)
  const judgeMatrix = {};
  if (judgeSheet) {
    const data = judgeSheet.getRange("C4:N27").getValues();
    for (let l = 1; l <= 8; l++) {
      for (let j = 1; j <= 3; j++) {
        const rowIndex = (l - 1) * 3 + (j - 1);
        if (rowIndex < data.length) {
          const row = data[rowIndex];
          for (let e = 1; e <= 12; e++) {
            const name = row[e - 1];
            if (name && name.toString().trim() !== "") {
              judgeMatrix[`${l}-${e}-${j}`] = name.toString().trim();
            }
          }
        }
      }
    }
  }

  // 2. DYNAMIC SWIMMER ASSIGNMENT RANGE C4:L153
  // Col C (0) = Swimmer No
  // Range D4:L153:
  // Col D (0) = Level 1, Col E (1) = Level 2, Col F (2) = Level 3, Col G (3) = Level 4,
  // Col H (4) = Level 5, Col I (5) = Level 6, Col J (6) = Level 7, Col K (7) = Level 8, Col L (8) = Level 9
  const swimmerAssignments = {};
  for (let l = 1; l <= 9; l++) swimmerAssignments[l] = [];

  const activeLevelsSet = new Set();

  if (swimmerSheet) {
    const swimmerNos = swimmerSheet.getRange("C4:C153").getValues();
    const levelCheckboxes = swimmerSheet.getRange("D4:L153").getValues();

    for (let i = 0; i < swimmerNos.length; i++) {
      const swimmerNo = swimmerNos[i][0];
      if (swimmerNo !== "" && swimmerNo !== null && !isNaN(swimmerNo)) {
        for (let l = 1; l <= 9; l++) {
          const isChecked = levelCheckboxes[i][l - 1] === true; // Level l -> index l - 1
          if (isChecked) {
            swimmerAssignments[l].push(parseInt(swimmerNo));
            activeLevelsSet.add(l);
          }
        }
      }
    }
  }

  // 3. READ UNIQUE ACTIVE LEVEL NUMBERS FROM 4_OVERVIEW COLUMN D / E
  if (overviewSheet) {
    const overviewData = overviewSheet.getRange("D6:E153").getValues();
    for (let i = 0; i < overviewData.length; i++) {
      const valD = overviewData[i][0];
      const valE = overviewData[i][1];
      if (valD !== "" && valD !== null && !isNaN(valD)) activeLevelsSet.add(parseInt(valD));
      if (valE !== "" && valE !== null && !isNaN(valE)) activeLevelsSet.add(parseInt(valE));
    }
  }

  const uniqueLevels = Array.from(activeLevelsSet).sort((a, b) => a - b);

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    uniqueLevels: uniqueLevels,
    judgeMatrix: judgeMatrix,
    swimmerAssignments: swimmerAssignments
  })).setMimeType(ContentService.MimeType.JSON);
}
