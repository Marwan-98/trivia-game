const option = document.querySelectorAll(".dropdown-item");
const startBtn = document.querySelector("#startBtn");
const categoryBtn = document.querySelector("#categoryBtn");
const difficultyBtn = document.querySelector("#difficultyBtn");
const highScore = document.querySelector("#highScore");
const toastTrigger = document.querySelector("#startBtn");
const toastLiveExample = document.getElementById("liveToast");
const quiz = document.querySelector(".quiz");
const menu = document.querySelector(".menu");
const end = document.querySelector(".end");

let options = [];
let answers = [];
let answersArray;
let dataArray;
let num = 0;
let rightQuestions = 0;
let highScoreNum;

if (localStorage.getItem("highScore") === null) {
  localStorage.setItem("highScore", 0);
  highScoreNum = parseInt(localStorage.getItem("highScore"));
} else {
  highScoreNum = parseInt(localStorage.getItem("highScore"));
}

highScore.innerHTML = `<h3>Your High score: ${highScoreNum}</h3>`;

option.forEach((e) => e.addEventListener("click", showGenre));

startBtn.addEventListener("click", getQuiz);

function showGenre(e) {
  e.currentTarget.parentElement.parentElement.previousElementSibling.innerText =
    e.target.innerText;

  switch (e.target.innerText) {
    case "General Knowledge":
      options[0] = 9;
      break;
    case "Books":
      options[0] = 10;
      break;
    case "Films":
      options[0] = 11;
      break;
    case "Music":
      options[0] = 12;
      break;
    case "Television":
      options[0] = 14;
      break;
    case "Video Games":
      options[0] = 15;
      break;
    case "Science & Nature":
      options[0] = 17;
      break;
    case "Computers":
      options[0] = 18;
      break;
    case "Mathematics":
      options[0] = 19;
      break;
    case "Mythology":
      options[0] = 20;
      break;
    case "Sports":
      options[0] = 21;
      break;
    case "Geography":
      options[0] = 22;
      break;
    case "History":
      options[0] = 23;
      break;
    case "Politics":
      options[0] = 24;
      break;
    case "Art":
      options[0] = 25;
      break;
    case "Animals":
      options[0] = 27;
      break;
    case "Vehicles":
      options[0] = 28;
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
    quiz.setAttribute("style", "display: block;");
    let correctAnswer = data.results[num].correct_answer;
    answers.push(correctAnswer);
    for (let i = 0; i < data.results[num].incorrect_answers.length; i++) {
      answers.push(data.results[num].incorrect_answers[i]);
    }
    menu.setAttribute("style", "display:none!important;");
    quiz.innerHTML = `
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
    answersArray = Array.from(document.querySelectorAll(".card-body"));
    answersArray.shift();
  } else {
    if (rightQuestions > highScoreNum) {
      console.log(highScoreNum);
      console.log(rightQuestions);
      highScoreNum = rightQuestions;
      localStorage.setItem("highScore", highScoreNum);
    }
    quiz.setAttribute("style", "display: none;");
    end.setAttribute("style", "display: block;");
    end.innerHTML = `
    <h2>Congratulations!! you answered ${rightQuestions} questions out of 10!!</h2>
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
  end.setAttribute("style", "display: none;");
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
  chosenAnswer = document.getElementById(id);
  if (chosenAnswer.innerText == correctAnswer) {
    chosenAnswer.parentElement.classList.add("anim");
    chosenAnswer.classList.add("right");
    answersArray.forEach((item) => {
      item.style = "pointer-events: none";
      if (!item.classList.contains("right")) {
        item.classList.add("wrong");
      }
    });
    num += 1;
    rightQuestions += 1;
    setTimeout(() => writeQuiz(dataArray, num), 2000);
  } else {
    chosenAnswer.parentElement.classList.add("shake-horizontal");
    answersArray.forEach((item) => {
      item.style = "pointer-events: none";
      if (item.innerText === correctAnswer) {
        item.classList.add("right");
      } else {
        item.classList.add("wrong");
      }
    });
    num += 1;
    setTimeout(() => writeQuiz(dataArray, num), 2000);
  }
}
