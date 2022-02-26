import {
  MAIN
} from '../../../../main.js';




function openSettings(bool) {
  if (bool) {
    document.querySelector('#settingsContainer').style.display = 'block';
    document.querySelector('#settingsSection').style.pointerEvents = 'auto';
  } else {
    document.querySelector('#settingsSection').style.pointerEvents = 'none';
    document.querySelector('#settingsContainer').style.display = 'none';
  };
}

function init() {
  document.querySelector('#settingsButton').onclick = () => {
    openSettings(true);
  };
  document.querySelector('#settingsButton').ontouchstart = () => {
    openSettings(true);
  };

  document.querySelector('#settingsSection').onclick = (e) => {
    if (e.target === document.querySelector('#settingsSection')) {
      openSettings(false);
    };
  };
  document.querySelector('#settingsSection').ontouchstart = (e) => {
    if (e.target === document.querySelector('#settingsSection')) {
      openSettings(false);
    };
  };


  document.querySelector('#settingsButton_close').onclick = () => {
    openSettings(false);
  };
  document.querySelector('#settingsButton_close').ontouchstart = () => {
    openSettings(false);
  };






  //video
  document.querySelector('#settingsSection_fullScreen').onclick = function() {
    if (!document.fullscreenElement) {
      document.body.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      };
    };
  };
  const noiseCheck = document.querySelector('#settingsSection_noiseCheck');
  const blurCheck = document.querySelector('#settingsSection_blurCheck');
  const brShadowsCheck = document.querySelector('#settingsSection_brShadowsCheck');

  let noise = true;
  function changeNoise(){
    if(noise){
      noise = false;
      MAIN.renderer.postrocessors.postrocessorMerged.material.uniforms.uIntensity.value = 0;
      noiseCheck.className = 'settingsContainer-body-checkBox';
    }else{
      noise = true;
      MAIN.renderer.postrocessors.postrocessorMerged.material.uniforms.uIntensity.value = 0.7;
      noiseCheck.className = 'settingsContainer-body-checkBox-checked';
    };
  };
  noiseCheck.onclick = changeNoise;
  noiseCheck.ontouchstart = changeNoise;


  let blur = true;
  function changeBlur(){
    if(blur){
      blur = false;
      MAIN.renderer.postrocessors.postrocessorMerged.material.uniforms.uStrength.value = 0;
      blurCheck.className = 'settingsContainer-body-checkBox';
    }else{
      blur = true;
      MAIN.renderer.postrocessors.postrocessorMerged.material.uniforms.uStrength.value = 2;
      blurCheck.className = 'settingsContainer-body-checkBox-checked';
    };
  };
  blurCheck.onclick = changeBlur;
  blurCheck.ontouchstart = changeBlur;

  let brShadows = true;
  function changeBrShadows(){
    if(brShadows){
      brShadows = false;
      MAIN.renderer.postrocessors.postrocessorMerged.material.uniforms.uShadowWhite.value = 0;
      brShadowsCheck.className = 'settingsContainer-body-checkBox';
    }else{
      brShadows = true;
      MAIN.renderer.postrocessors.postrocessorMerged.material.uniforms.uShadowWhite.value = 0.25;
      brShadowsCheck.className = 'settingsContainer-body-checkBox-checked';
    };
  };
  brShadowsCheck.onclick = changeBrShadows;
  brShadowsCheck.ontouchstart = changeBrShadows;



  const shadQ = [null, null, null, null];

  function changeShadowQuality(value) {
    shadQ.forEach((item, i) => {
      const elem = document.querySelector(`#settingsSection_shadQ_${i}`);
      elem.className = '';
      if (value === i) {
        elem.className = 'settingsContainer-body-line-button-checked';
      } else {
        elem.className = 'settingsContainer-body-line-button';
      };
    });
    const light = MAIN.game.scene.lights.lightMain;


    switch (value) {
      case 0:
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        break;
      case 1:
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        break;
      case 2:
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        break;
      case 3:
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        break;
      default:

    };

    light.shadow.map.dispose(); // important
    light.shadow.map = null;
  };
  shadQ.forEach((item, i) => {
    const elem = document.querySelector(`#settingsSection_shadQ_${i}`);
    elem.onclick = () => {
      changeShadowQuality(i)
    };
    elem.ontouchstart = () => {
      changeShadowQuality(i);
    };
  });




  //game
  const time = ['morning', 'day', 'evening'];
  function changeTime(indx){
    time.forEach((item, i) => {
      const elem = document.querySelector(`#settingsSection_time_${i}`);
      elem.className = '';
      if (indx === i) {
        elem.className = 'settingsContainer-body-line-button-wide-checked';
      } else {
        elem.className = 'settingsContainer-body-line-button-wide';
      };
    });
    MAIN.game.scene.time.time = time[indx];
    MAIN.game.scene.sun.update();
    MAIN.renderer.renderer.shadowMap.needsUpdate = true;
  };


  time.forEach((item, i) => {
    const elem = document.querySelector(`#settingsSection_time_${i}`);
    elem.onclick = () => {
      changeTime(i)
    };
    elem.ontouchstart = () => {
      changeTime(i);
    };
  });

};





const SETTINGS = {
  init
};









export {
  SETTINGS
}
