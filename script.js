let option = document.querySelectorAll(".dropdown-item");
let startBtn = document.querySelector("#startBtn");

let categoryBtn = document.querySelector("#categoryBtn");

let difficultyBtn = document.querySelector("#difficultyBtn");

let highScore = document.querySelector("#highScore");

const toastTrigger = document.querySelector("#startBtn");

const toastLiveExample = document.getElementById("liveToast");

let options = [];
let answers = [];
let dataArray;
let num = 0;
let rightQuestions = 0;
let highScoreNum = 0;

if (localStorage.getItem("highScore") === null) {
  localStorage.setItem("highScore", 0);
}

highScore.innerHTML = `<h3>Your High score: ${localStorage.getItem(
  "highScore"
)}</h3>`;

option.forEach((element) => {
  element.addEventListener("click", showGenre);
});

startBtn.addEventListener("click", getQuiz);

function showGenre(e) {
  e.currentTarget.parentElement.parentElement.previousElementSibling.innerText =
    e.target.innerText;

  switch (e.target.innerText) {
    case "General Knowledge":
      options[0] = 9;
      break;
    case "Sports":
      options[0] = 21;
      break;
    case "History":
      options[0] = 23;
      break;
    case "Hard":
      options[1] = "hard";
      break;
    case "Medium":
      options[1] = "medium";
      break;
    case "Easy":
      options[1] = "easy";
      break;
    default:
      break;
  }
}

async function getQuiz() {
  if (options.length == 2) {
    await fetch(
      `https://opentdb.com/api.php?amount=10&category=${options[0]}&difficulty=${options[1]}&type=multiple`
    )
      .then((response) => response.json())
      .then((data) => {
        dataArray = data;
        writeQuiz(dataArray, num);
      });
  } else {
    order();
  }
}

function order() {
  const toast = new bootstrap.Toast(toastLiveExample);
  toast.show();
}

function writeQuiz(data, num) {
  if (num < data.results.length) {
    document.querySelector(".quiz").setAttribute("style", "display: block;");
    let correctAnswer = data.results[num].correct_answer;
    answers.push(correctAnswer);
    for (let i = 0; i < data.results[num].incorrect_answers.length; i++) {
      answers.push(data.results[num].incorrect_answers[i]);
    }
    document
      .querySelector(".menu")
      .setAttribute("style", "display:none!important;");
    document.querySelector(".quiz").innerHTML = `
  <div class="row m-4">
    <div class="card w-100">
      <div class="card-body question">
        <h5 class="card-title">Question #${num + 1}</h5>
        <p class="card-text">
          ${data.results[num].question}
        </p>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-6 mb-3">
    <div class="card">
        <div class="card-body" id="answer-1" onClick='check("answer-1", "${correctAnswer}", "${dataArray}")' role="button">
          <h5 class="card-title">${randomize()}</h5>
        </div>
      </div>
      </div>
      <div class="col-6 mb1">
      <div class="card">
        <div class="card-body" id="answer-2" onClick='check("answer-2", "${correctAnswer}", "${dataArray}")' role="button">
          <h5 class="card-title">${randomize()}</h5>
        </div>
        </div>
        </div>
  </div>
  <div class="row">
  <div class="col-6 mb-3">
  <div class="card">
        <div class="card-body" id="answer-3" onClick='check("answer-3", "${correctAnswer}", "${dataArray}")' role="button">
        <h5 class="card-title">${randomize()}</h5>
        </div>
        </div>
        </div>
    <div class="col-6 mb-3">
      <div class="card">
        <div class="card-body" id="answer-4" onClick="check('answer-4', '${correctAnswer}', '${dataArray}')" role="button">
          <h5 class="card-title">${randomize()}</h5>
      </div>
    </div>
  </div>`;
  } else {
    if (rightQuestions > highScoreNum) {
      highScoreNum = rightQuestions;
      localStorage.setItem("highScore", highScoreNum);
    }
    document.querySelector(".quiz").setAttribute("style", "display: none;");
    document.querySelector(".end").setAttribute("style", "display: block;");
    document.querySelector(".end").innerHTML = `
    <h2>Congratulations!! you answered ${highScoreNum} questions out of 10!!</h2>
    <div class="m-3">
      <button class="btn btn-primary px-5" onClick="playAgain()">Play Again</button>
    </div>
  `;
  }
}

function playAgain() {
  options = [];
  answers = [];
  dataArray;
  num = 0;
  rightQuestions = 0;
  highScore.innerHTML = `<h3>Your High score: ${localStorage.getItem(
    "highScore"
  )}</h3>`;
  categoryBtn.innerText = "Choose Category";
  difficultyBtn.innerText = "Choose Difficulty";
  document.querySelector(".end").setAttribute("style", "display: none;");
  document
    .querySelector(".menu")
    .setAttribute("style", "display: flex!important;");
}

function randomize() {
  let randomNum = Math.floor(Math.random() * answers.length);
  let answer = answers[randomNum];
  answers.splice(answers.indexOf(answers[randomNum]), 1);
  return answer;
}

function check(id, correctAnswer, data) {
  chosenAnswer = document.getElementById(id).innerText;
  if (chosenAnswer == correctAnswer) {
    rightQuestions += 1;
    document.getElementById(id).classList.add("anim");
    document.getElementById(id).classList.add("bg-success");
    for (let i = 1; i <= 4; i++) {
      document.getElementById(`answer-${i}`).classList.add("text-white");
      if (
        !document.getElementById(`answer-${i}`).classList.contains("bg-success")
      ) {
        document.getElementById(`answer-${i}`).classList.add("bg-danger");
      }
    }
    num += 1;
    setTimeout(() => writeQuiz(dataArray, num), 2000);
  } else {
    document.getElementById(id).classList.add("shake-horizontal");
    for (let i = 1; i <= 4; i++) {
      document.getElementById(`answer-${i}`).classList.add("text-white");
      if (document.getElementById(`answer-${i}`).innerText === correctAnswer) {
        document.getElementById(`answer-${i}`).classList.add("bg-success");
      } else {
        document.getElementById(`answer-${i}`).classList.add("bg-danger");
      }
    }
    num += 1;
    setTimeout(() => writeQuiz(dataArray, num), 2000);
  }
}
