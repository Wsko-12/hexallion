import {
  MAIN
} from '../../../main.js';

//динаммически подключаем стили этой страницы
const elem = document.createElement('link');
elem.rel = 'stylesheet';
elem.type = 'text/css';
document.body.appendChild(elem);
elem.href = 'scripts/modules/pages/loading/loadingPage.css';





const LOADING = {};

LOADING.animate = {
  status: 0,
  start: () => {
    LOADING.animate.status += 1;
    if (LOADING.animate.status % 4 === 0) {
      LOADING.animate.status = 0;
    }

    const animDOM = document.querySelector('#loadingAnimation');
    if (animDOM) {

      let string = ''
      for (let i = 0; i < LOADING.animate.status; i++) {
        string += '.';
      };

      animDOM.innerHTML = string;
      setTimeout(() => {
        LOADING.animate.start();
      }, 500);
    };
  }
};

LOADING.showPage = (parameters) => {
  MAIN.pages.screen.innerHTML = '';

  if (!parameters) {
    parameters = {
      bar: false,
      title: 'Loading',
      comment: '',
    };
  };

  let legend = {
    title: parameters.title || 'Loading',
    comment: parameters.comment || '',
  };


  let section;
  if (parameters.bar) {
    section = `
      <section id="loadingSection">
        <div id="loadingContainer">
          <div id="loadingTitle">${legend.title}</div>
          <div id="loadingComment">${legend.comment}</div>
          <div id="loadingBar">
            <div id="loadingProgress">

            </div>
          </div>
        </div>
      </section>
    `;
  } else {
    section = `
      <section id="loadingSection">
        <div id="loadingContainer">
          <div id="loadingTitle">${legend.title}</div>
          <div id="loadingComment">${legend.comment}</div>
          <div id="loadingAnimation">
            ...
          </div>
      </section>
    `;
  };


  MAIN.pages.screen.innerHTML = section;
  if (!parameters.bar) {
    LOADING.animate.start();
  };
};

LOADING.changeComment = (comment) => {
  const commentDOM = document.querySelector('#loadingComment');
  if (commentDOM) {
    commentDOM.innerHTML = comment;
  };
};

LOADING.changeTitle = (title) => {
  const titleDOM = document.querySelector('#loadingTitle');
  if (titleDOM) {
    titleDOM.innerHTML = title;
  };
};

LOADING.changeProgress = (progress) => {
  const progressDOM = document.querySelector('#loadingProgress');
  if (progressDOM) {
    if (progress > 0) {
      progress = progress / 100;
    };
    progressDOM.style.transform = `scale(${progress},1)`;
  };
};

LOADING.close = () => {
  MAIN.pages.screen.innerHTML = '';
};



export {
  LOADING
};
