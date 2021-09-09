/*
 * Этот модуль и его вложения отвечает за отображение всех страниц
 */

import {
  MAIN
} from '../../main.js';
import {
  LOADING
} from './loading/loading.js';
import {
  AUTH
} from './auth/auth.js';


const PAGES = {};
PAGES.screen = document.querySelector('#screen');
// Инициализация вложений
PAGES.auth = AUTH;
PAGES.loading = LOADING;


PAGES.showErrorPage = function(text) {
  MAIN.pages.screen.innerHTML = '';
  const error = `
  <section id='errorSection'>
      <div id="errorContainer">
        <p id="errorText">${text}</p>
      </div>
    </section>`;

  MAIN.pages.screen.innerHTML = error;
};


export {
  PAGES
};
