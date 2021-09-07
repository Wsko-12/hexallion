import {
  MAIN
} from '../main.js';






const INTERFACE = {};



INTERFACE.showError = function(text){

  MAIN.interface.screen.innerHTML = '';
  const error = `
  <section id='errorSection'>
      <div id="errorContainer">
        <p id="errorText">${text}</p>
      </div>
    </section>`;

    MAIN.interface.screen.innerHTML = error;
};
INTERFACE.showAuthPage = function(){
  MAIN.interface.screen.innerHTML = '';




  

};

export {
  INTERFACE
};
