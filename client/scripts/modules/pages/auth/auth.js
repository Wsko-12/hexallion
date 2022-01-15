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
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)">
        <form id='auth' >
          <input type="text" id='login'/ style="
            -webkit-user-select: initial;
          -khtml-user-select: initial;
          -moz-user-select: initial;
          -ms-user-select: initial;
          user-select: initial;">
          <button type="submit">OK</button>
        </form>
      </div>
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
    MAIN.pages.loading.showPage({title:'Wait a bit, please...',comment:'Waiting for players'});
    MAIN.userData = {
      login:data.login,
      inRoom:false,
    };
  });

};



export {
  AUTH
};
