let socket = io();
let messages = document.querySelector('section ul');
const input = document.querySelector('#chat input');

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  if (input.value) {
    socket.emit('message', input.value);
    input.value = '';
  }
})

socket.on('message', message => {
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }));
  messages.scrollTop = messages.scrollHeight;
})

const wordInput = document.querySelector('#wordInput');
let wordHidden = [];


const btn = document.querySelector("#makeWord button");
btn.addEventListener("click", function() {
  let word = wordInput.value;
  
  for (var i = 0; i < word.length; i++) {
    wordHidden[i] = "_";
  }
  console.log(wordHidden);
  wordHidden.forEach(item => {
    tempItem = document.createElement('span');
    tempItem.innerHTML = item;
    document.getElementById('presentWord').appendChild(tempItem);
  })
})
