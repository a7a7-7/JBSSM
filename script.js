let lineNumber = 0;
let studentNumber = 0;
let seats = [];
let clickedCell = null;
let readOnly = true;

document.getElementById('inputForm').addEventListener('input', validateInput);
document.getElementById('resetForm').addEventListener('submit', handleReset);
document.getElementById('shuffleForm').addEventListener('submit', shuffleTable);

function validateInput() {
  lineNumber = parseInt(document.getElementById('lineNumber').value);
  studentNumber = parseInt(document.getElementById('studentNumber').value);
  generateTable();
}

function handleReset(event) {
  event.preventDefault();
  lineNumber = 0;
  studentNumber = 0;
  seats = [];
  // 리셋 시 인풋 값 0으로 설정
  document.getElementById('lineNumber').value = 0;
  document.getElementById('studentNumber').value = 0;
  updateTable();
}

function generateTable() {
  if (lineNumber > 0 && lineNumber < studentNumber && lineNumber < 40 && studentNumber < 40) {
    seats = makeSeats(lineNumber, studentNumber);
    updateTable();
  }
}

function shuffleTable(event) {
  event.preventDefault();
  seats = shuffleSeats(seats);
  updateTable();
}

function updateTable() {
  const tableBody = document.getElementById('seats-table');
  tableBody.innerHTML = '';
  seats.forEach((row, rowIndex) => {
    const rowElement = document.createElement('tr');
    row.forEach((person, colIndex) => {
      const cellElement = document.createElement('td');
      const inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.value = person;
      inputElement.readOnly = readOnly;
      inputElement.classList.add('table_cell');
      inputElement.addEventListener('click', (event) => onClickCell(event, rowIndex, colIndex));
      inputElement.addEventListener('dblclick', () => onDoubleClick(inputElement));
      inputElement.addEventListener('input', (event) => onInputChange(event, rowIndex, colIndex));
      inputElement.addEventListener("keydown", onInputKeydown);
      cellElement.appendChild(inputElement);
      rowElement.appendChild(cellElement);
    });
    tableBody.appendChild(rowElement);
  });
}

function onInputKeydown(event) {
  let eventTarget = event.target;
  if (event.key === "Enter") {
    event.target.blur(); // Enter 누르면 포커스 해제
    activeCell = null; // active 상태 초기화
    eventTarget.classList.remove("active");
  }
}

function onClickCell(event, row, col) {
  let eventTarget = event.target;
  event.stopPropagation();
  if (clickedCell && clickedCell.row === row && clickedCell.col === col) {
    return;
  }
  if (clickedCell === null) {
    clickedCell = { row, col };
    eventTarget.classList.add("active");
  } else {
    const temp = seats[row][col];
    eventTarget.classList.remove("active");
    seats[row][col] = seats[clickedCell.row][clickedCell.col];
    seats[clickedCell.row][clickedCell.col] = temp;
    clickedCell = null;
    updateTable();
  }
}

function onDoubleClick(inputElement) {
  inputElement.readOnly = false;  // 더블클릭 시 입력 가능
}

function makeSeats(lineNum, studentNum) {
  let result = [];
  let oneLineStudent = Math.floor(studentNum / lineNum);
  let restStudent = studentNum % lineNum;
  let mainStudent = studentNum - restStudent;

  for (let i = 0; i < oneLineStudent; i++) {
    let row = [];
    for (let j = 0; j < lineNum; j++) {
      row.push(i * lineNum + j + 1);
    }
    result.push(row);
  }

  let lastRow = [];
  for (let i = 0; i < restStudent; i++) {
    lastRow.push(mainStudent + i + 1);
  }
  result.push(lastRow);

  return result.map(row => row.map(num => num.toString()));
}

function makeSeatsFromArr(lineNum, flattenSeats) {
  let result = [];
  
  for (let i = 0; i < flattenSeats.length; i += lineNum) {
    result.push(flattenSeats.slice(i, i + lineNum));
  }

  return result;
}

function shuffleSeats(seats) {
  console.log(seats)
  let flatSeats = seats.flat();
  for (let i = flatSeats.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flatSeats[i], flatSeats[j]] = [flatSeats[j], flatSeats[i]];
  }
  return makeSeatsFromArr(lineNumber, flatSeats);  // 기존 자리배치 배열을 사용
}

function onInputChange(event, row, col) {
  const newValue = event.target.value;
  seats[row][col] = newValue;  // 배열의 특정 셀 값 업데이트
}
