let socket = io();
socket.emit('create', 'room1');

let messages = document.querySelector('section ul');
const input = document.querySelector('#chat input');

document.querySelector('#chat form').addEventListener('submit', event => {
  event.preventDefault();
  if (input.value) {
    socket.emit('message', input.value);
    input.value = '';
  }
})

document.querySelector('#game form').addEventListener('submit', event => {
  event.preventDefault();
  socket.emit('newWord');
})

socket.on('message', message => {
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }));
  messages.scrollTop = messages.scrollHeight;
})


// const wordInput = document.querySelector('#wordInput');
// let wordHidden = [];


// const makeWord = document.querySelector("#makeWord");
// document.querySelector('#game').addEventListener('submit', event => {
//   event.preventDefault();
//   let guessWord = word.word;
//   socket.emit(" ", guessWord)
//   for (var i = 0; i < guessWord.length; i++) {
//     wordHidden[i] = "_";
//   }
//   wordHidden.forEach(item => {
//     tempItem = document.createElement('span');
//     tempItem.innerHTML = item;
//     document.getElementById('presentWord').appendChild(tempItem);
//   })

//   makeWord.classList.add("hidden");
// })


let wordStatus = null;
let guessed = [];

function generateButtons() {
  let buttonsHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter =>
    `
    <button class="" id '` + letter +`' onClick="handleGuess('` + letter + `')">
    ` + letter + `
    </button>
    `
    ).join('');

    document.getElementById('keys').innerHTML = buttonsHTML;
}

socket.on('newWord', newWord => {
  console.log(newWord);
    // answer meot word.word worden
  
    //if letter exsists in word then letter has bigger value than 0. If it is letter is _
    wordStatus = newWord.word.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join("");
  
    document.getElementById('presentWord').innerHTML = wordStatus;
})

generateButtons();
// guessedWord();