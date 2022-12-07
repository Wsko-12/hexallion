import {
  MAIN
} from '../../../../main.js';

function init() {
  const section = `
    <section id="turnSection">
      <div class="turn-container">
        <div id="turnButton" class="turn-button"> Закончить ход</div>
        <div id="turnInfo" class="turn-info"></div>
      </div>
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

function makeTimer() {
  let timer = 60;
  const random = Math.random();
  timerId = random;
  function animate(){
    timer--;
    const message = `turn: player ${timer}sec`;
    document.querySelector('#turnInfo').innerHTML = message;

    if(timer <= 0){
      MAIN.game.functions.turn();
    }else{
      if(timerId === random){
        setTimeout(animate,1000);
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
