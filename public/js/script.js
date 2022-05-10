
let socket = io();
socket.emit('create', 'room1');

let messages = document.querySelector('section ul');
const input = document.querySelector('#chat input');

// sends messages in the chat
document.querySelector('#chat form').addEventListener('submit', event => {
  event.preventDefault();
  if (input.value) {
    socket.emit('message', input.value);
    input.value = '';
  }
})


// checks if the user clicks on the button to generate a new word
document.querySelector('#game form').addEventListener('submit', event => {
  event.preventDefault();
  socket.emit('newWord');
})

socket.on('message', message => {
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }));
  messages.scrollTop = messages.scrollHeight;
})

let keys = [];
let wordStatus = null;
let guessWord = '';
let wordDef = '';
let guessed = [];

function generateButtons() {
  let buttonsHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter =>
    `
    <button class="btn keys" id='` + letter +`' ">
    ` + letter + `
    </button>
    `
    ).join('');

    document.getElementById('keys').innerHTML = buttonsHTML;
    keys = document.querySelectorAll(".keys");
    keys.forEach(key => {
      key.addEventListener("click", key => {
        let keyId = key.target.id;
        socket.emit("clicked", keyId);
      })
    })
}

socket.on("winCount", winCount => {
  document.querySelector("#wincounter").innerHTML = winCount;
})

socket.on('newWord', newWord => {
      resetWinner = document.querySelector("#winner");
      resetWinner.classList.add("hidden");
      guessed = [];
      let keyboard_btn = document.querySelectorAll('.btn');
      keyboard_btn.forEach( item => {
        item.removeAttribute('disabled');
      })
      //if letter exsists in word then letter has bigger value than 0. If it is letter is _
      guessWord = newWord.word.toLowerCase();
      wordDef = newWord.definition;
      console.log(newWord.word)
    wordStatus = guessWord.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join("");
  
    document.getElementById('presentWord').innerHTML = wordStatus;
    document.querySelector("#winnerWord").innerHTML = newWord.word;
    document.querySelector("#definition").innerHTML = newWord.definition;

})



socket.on('clicked', chosenLetter => {
  console.log(chosenLetter);
  guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
  document.getElementById(chosenLetter).setAttribute('disabled', true);

  if (guessWord.indexOf(chosenLetter) >= 0) {
    wordStatus = guessWord.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join("");
  
    document.getElementById('presentWord').innerHTML = wordStatus;
    console.log(wordStatus);
    if (!wordStatus.includes('_')) {
      socket.emit('winner');
    }
  }
})

socket.on('winner', winner => {
  winner = document.querySelector("#winner");
  winner.classList.remove("hidden");
})

generateButtons();
