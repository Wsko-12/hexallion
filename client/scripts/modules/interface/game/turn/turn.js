import {
  MAIN
} from '../../../../main.js';

function init() {
  const section = `
    <section id="turnSection">
      <div id="turnInfo"></div>
      <div id="turnButton" class="card"><span style="margin:auto">end</span></div>
    </section>
  `
  document.querySelector('#gameInterface').insertAdjacentHTML('beforeEnd', section);

  function nextTurn() {
    MAIN.game.functions.endTurn();
  }
  document.querySelector('#turnButton').onclick = nextTurn;
  document.querySelector('#turnButton').ontouchstart = nextTurn;

  MAIN.interface.deleteTouches(document.querySelector('#turnSection'));
};

let timerId = null;

function makeTimer(value, data) {
  let timer = value;
  let random = Math.random();
  timerId = random;
  const player = data.currentTurn;
  function animate() {
    if(document.querySelector('#turnButton')){
      if (random === timerId) {
        timer--;
        if (timer > 0) {
          if (player === MAIN.game.data.playerData.login) {
            if (MAIN.game.data.commonData.queue === MAIN.game.data.playerData.login && !MAIN.game.data.commonData.turnsPaused) {
              document.querySelector('#turnButton').style.display = `flex`;
              document.querySelector('#turnInfo').innerHTML = `${timer}sec`;
              document.querySelector('#turnInfo').style.color = `#a7ff78`;
              setTimeout(animate, 1000);
            };
          } else {
            if (player === MAIN.game.data.commonData.queue && !MAIN.game.data.commonData.turnsPaused) {
              document.querySelector('#turnButton').style.display = `none`;
              document.querySelector('#turnInfo').style.color = 'white';
              const message = `turn: <span style="color:${MAIN.game.data.commonData.playerColors[MAIN.game.data.commonData.members.indexOf(player)]}">${player}</span>  ${timer}sec`
              document.querySelector('#turnInfo').innerHTML = message;
              setTimeout(animate, 1000);
            };
          };
        };
      };
    };
  };
  animate();
};

function makeNote(note) {
  document.querySelector('#turnInfo').style.color = 'white';
  document.querySelector('#turnInfo').innerHTML = `${note}`;
};

const TURN = {
  init,
  makeTimer,
  makeNote,
};
export {
  TURN
};
