import {
  MAIN
} from '../../../main.js';

//динаммически подключаем стили этой страницы
const elem = document.createElement('link');
elem.rel = 'stylesheet';
elem.type = 'text/css';
document.body.appendChild(elem);
elem.href = 'scripts/modules/pages/auth/authPage.css';



const AUTH = {

};

function checkLogin(login) {
  const reg = /^[a-z][a-z0-9_]{3,15}/;
  const found = login.match(reg);
  if (found) {
    if (found[0] === found.input) {
      return true;
    } else {
      return false;
    };
  } else {
    return false;
  };
};




AUTH.showPage = () => {
  MAIN.pages.screen.innerHTML = '';

  const authPage = `
    <section id="authSection">
      <div class="authSection-background"></div>
      <div class="authContainer">
        <form id='auth' >
          <input type="text" id='login' class="authInput"/>
          <div id="login_error"></div>
          <input type="password" id='password' class="authInput"/>
          <div id="password_error"></div>
          <div class="auth_mainButtonContainer">
            <button id="auth_mainButton" type="submit" class="authButton">войти</button>
          </div>
          <div class="auth_switchButtonContainer">
            <button id="auth_switchButton" type="button" class="authButton_small">регистрация</button>
          </div>
        </form>
      </div>
    </section>
  `;

  MAIN.pages.screen.innerHTML = authPage;


  let login = true;
  const errorDiv = document.querySelector('#login_error');
  const errorMesages = {
    badLogin: 'Логин должен начинаться с латинской буквы(a-z), может содержать цифры(0-9) и символ нижнего подчеркивания (_)',
    loginExist: 'Такой логин уже существует',
  };

  document.querySelector('#auth_switchButton').onclick = function() {
    const mainButton = document.querySelector('#auth_mainButton');
    const switchButton = document.querySelector('#auth_switchButton');
    if (login) {
      login = false;
      mainButton.innerHTML = 'создать';
      switchButton.innerHTML = 'вход';
    } else {
      login = true;
      mainButton.innerHTML = 'войти';
      switchButton.innerHTML = 'регистрация';
    };
  };


  document.querySelector('#login').addEventListener('input', function() {
    this.value = this.value.toLowerCase();
    if (this.value.length > 3) {
      if (checkLogin(this.value)) {

        errorDiv.style.display = 'none';

        this.style.color = 'white'
      } else {
        errorDiv.innerHTML = errorMesages.badLogin;
        errorDiv.style.display = 'block';
        this.style.color = '#ff5858';
      };
    } else {
      errorDiv.style.display = 'none';

      this.style.color = 'white'
    };
  });
  document.querySelector('#login').addEventListener('change', function() {
    this.value = this.value.toLowerCase();
    if (checkLogin(this.value)) {
      errorDiv.style.display = 'none';

      this.style.color = 'white'
    } else {
      showError('badLogin');
      this.style.color = '#ff5858';
    };
  });

  document.querySelector('#password').addEventListener('input', function() {
    document.querySelector('#password_error').style.display = 'none';
  });




  const form = document.querySelector('#auth');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const loginInp = document.querySelector('#login');
    if (checkLogin(loginInp.value)) {
      document.querySelector('#login_error').style.display = 'none';
      loginInp.style.color = 'white';
    } else {
      showError('badLogin');
      return;
    };

    const passwordInp = document.querySelector('#password');
    if (passwordInp.value.length < 8) {
      showError('badPassword', true);
      return;
    };

    if (login) {
      // MAIN.socket.emit('auth',data);
      // return;


      // //log in
      //
      // // if(form.login.value === ''){
      // //   form.login.value = generateId();
      // // };
      //
      // checkLogin(form.login.value);
      //
      //
      // const data = {
      //   login:form.login.value,
      //   password:form.password.value,
      // }
      //
      // MAIN.pages.loading.showPage({title:'Wait a bit, please...',comment:'Waiting for players'});
      // MAIN.userData = {
      //   login:data.login,
      //   inRoom:false,
      // };
      const data = {
        login: loginInp.value,
        password: password.value,
        registration: false,
      };
      MAIN.socket.emit('AUTH', data);


    } else {
      //registration
      const data = {
        login: loginInp.value,
        password: password.value,
        registration: true,
      };
      MAIN.socket.emit('AUTH', data);
    };
  });

};

function showError(code, password) {
  if (password) {
    const errorDiv = document.querySelector('#password_error');
    const errorMesages = {
      badPassword: 'Пароль должен содержать минимум 8 символов',
    };
    errorDiv.innerHTML = errorMesages[code];
    errorDiv.style.display = 'block';
    return;
  }
  const errorDiv = document.querySelector('#login_error');
  const errorMesages = {
    badLogin: 'Логин должен начинаться с латинской буквы(a-z), может содержать цифры(0-9) и символ нижнего подчеркивания (_) и быть длиннее 3 символов',
    loginExist: 'Такой логин уже существует',
    unexpected: 'Произошла ошибка, попробуйте позже',
    loginPasswordFalse: 'Неверный логин или пароль',
    userOnline: 'Данный пользователь уже в игре',
  };
  errorDiv.innerHTML = errorMesages[code];
  errorDiv.style.display = 'block';
  document.querySelector('#login').style.color = '#ff5858';
};

AUTH.showError = showError;

export {
  AUTH
};
