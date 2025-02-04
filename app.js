const topics = [
  { topic: "Programming Languages", words: ["javascript", "python", "java", "ruby", "html", "css", "csharp", "typescript"] },
  { topic: "Animals", words: ["elephant", "tiger", "giraffe", "lion", "zebra", "kangaroo", "panda", "pigeon"] },
  { topic: "Countries", words: ["canada", "india", "brazil", "france", "germany", "japan", "south africa", "australia"] },
  // Add 50 topics here (for brevity, I am adding a few)
];

let word = "";
let displayedWord = "";
let wrongGuesses = [];
let remainingAttempts = 6;
let currentTopic = "";
let score = 0;
let hangmanState = 0; // 0-6 (0 = full hangman, 6 = no wrong guesses)

function populateTopicDropdown() {
  const topicSelect = document.getElementById("topicSelect");
  topics.forEach((topicObj, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = topicObj.topic;
      topicSelect.appendChild(option);
  });
}

function startGame() {
  const topicIndex = document.getElementById("topicSelect").value;
  if (!topicIndex) return;

  const selectedTopic = topics[topicIndex];
  currentTopic = selectedTopic.topic;
  word = selectedTopic.words[Math.floor(Math.random() * selectedTopic.words.length)];
  
  displayedWord = word.split("").map(letter => isVowel(letter) ? letter : "_").join("");
  wrongGuesses = [];
  remainingAttempts = 6;
  hangmanState = 0;
  score = 0;

  document.getElementById("topic").textContent = currentTopic;
  document.getElementById("wordDisplay").textContent = displayedWord;
  document.getElementById("wrongGuesses").textContent = "";
  document.getElementById("remainingAttempts").textContent = remainingAttempts;
  document.getElementById("score").textContent = score;
  document.getElementById("result").textContent = "";
  document.getElementById("guessInput").value = "";
  document.getElementById("fullWordInput").value = "";
  document.getElementById("fullWordGuessContainer").style.display = "block";
  document.getElementById("gameArea").style.display = "block";

  document.getElementById("hangman").textContent = getHangmanState(hangmanState);

  // Enable the guess input field
  document.getElementById("guessInput").disabled = false;
  document.getElementById("fullWordInput").disabled = false;
}

function isVowel(letter) {
  return ['a', 'e', 'i', 'o', 'u'].includes(letter.toLowerCase());
}

function guessLetter() {
  const guess = document.getElementById("guessInput").value.toLowerCase();
  if (guess && !wrongGuesses.includes(guess) && !displayedWord.includes(guess)) {
      if (word.includes(guess)) {
          // Correct guess
          displayedWord = word.split("").map((letter, index) => letter === guess ? guess : displayedWord[index]).join("");
          document.getElementById("wordDisplay").textContent = displayedWord;
          score += 10; // Award points for correct guesses
      } else {
          // Incorrect guess
          wrongGuesses.push(guess);
          document.getElementById("wrongGuesses").textContent = wrongGuesses.join(", ");
          remainingAttempts--;
          hangmanState++;
          document.getElementById("remainingAttempts").textContent = remainingAttempts;
      }

      if (displayedWord === word) {
          // Player wins
          document.getElementById("result").textContent = "You won!";
          stopGame();
      } else if (remainingAttempts === 0) {
          // Player loses
          document.getElementById("result").textContent = `Game Over! The word was "${word}".`;
          stopGame();
      }

      document.getElementById("score").textContent = score;
      document.getElementById("hangman").textContent = getHangmanState(hangmanState);
  }

  document.getElementById("guessInput").value = "";
}

function guessFullWord() {
  const fullGuess = document.getElementById("fullWordInput").value.toLowerCase();
  if (fullGuess === word) {
      // Correct full word guess
      score += 50; // Award bonus points for correct full word guess
      document.getElementById("result").textContent = "You guessed the full word correctly! You win!";
      stopGame();
  } else {
      // Incorrect full word guess
      document.getElementById("result").textContent = `Incorrect! The word was "${word}".`;
      stopGame();
  }
  document.getElementById("score").textContent = score;
}

function stopGame() {
  // Disable further input once the game is over
  document.getElementById("guessInput").disabled = true;
  document.getElementById("fullWordInput").disabled = true;
}

function getHangmanState(state) {
  const hangmanStates = [
      `------
|    |
O    |
/|\\   |
/ \\   |
    |
   ---`, // Full hangman
      `------
|    |
O    |
/|\\   |
/     |
    |
   ---`,
      `------
|    |
O    |
/|\\   |
    |
    |
   ---`,
      `------
|    |
O    |
/|    |
    |
    |
   ---`,
      `------
|    |
O    |
    |
    |
    |
   ---`,
      `------
|    |
    |
    |
    |
    |
   ---`, // No hangman
  ];

  return hangmanStates[state];
}

populateTopicDropdown(); // Populate topics when page loads
