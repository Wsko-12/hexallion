import {
  MAIN
} from '../../../main.js';

//динаммически подключаем стили этой страницы
const elem = document.createElement( 'link' );
elem.rel = 'stylesheet';
elem.type = 'text/css';
document.body.appendChild( elem );
elem.href = 'scripts/modules/pages/auth/authPage.css';



const AUTH = {

};



AUTH.showPage = () => {
  MAIN.pages.screen.innerHTML = '';

  /*
  * Это страница-заглушка, рандомный логин чисто чтобы начать игру
  * Как только зайдет нужное кол-во человек, на первую страницу придет сокет с началом старта игры
  */

  const authPage = `
    <form id='auth'>
      <input id='login'>
      <button type="submit">OK</button>
    </form>
  `;

  MAIN.pages.screen.innerHTML = authPage;
  const form = document.querySelector('#auth');

  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(form.login.value === ''){
      form.login.value = generateId();
    };

    const data = {
      login:form.login.value
    }
    MAIN.socket.emit('auth',data);
  });

};



export {
  AUTH
};
