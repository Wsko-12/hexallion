import {
  MAIN
} from '../../../main.js';

function  generateId(type,x){
    if(type === undefined){
      type = 'u'
    }
    if(x === undefined){
      x = 5;
    }
    let letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnPpQqRrSsTtUuVvWwXxYyZz';

    let numbers = '0123456789';
    let lettersMix,numbersMix;
    for(let i=0; i<10;i++){
      lettersMix += letters;
      numbersMix += numbers;
    }

    let mainArr = lettersMix.split('').concat(numbersMix.split(''));
    let shuffledArr = mainArr.sort(function(){
                        return Math.random() - 0.5;
                    });
    let id = type +'_';
    for(let i=0; i<=x;i++){
        id += shuffledArr[i];
    };
    return id;
};




const AUTH = {

};


AUTH.showPage = () => {
  MAIN.interface.screen.innerHTML = '';

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

  MAIN.interface.screen.innerHTML = authPage;
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
