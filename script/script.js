let number = 1; // номер текущего слова
let isPlaying = false;

let mainLang = 'rus'; // направление перевода с..
let word = '';
let translate = '';
let engVoice = "UK English Female";
let rusVoice = "Russian Female";
let wordLang;
let translateLang;

//переменные для слова
let eng = '';
let pronouns = '';
let rus = '';

//пеерменные для меток
// let one = '';
// let two = '';
// let three = '';

// интервалы
let translation;
let pause;
let switching;
let timeToThink;


let baseSize = $('#base div').length;

function preparing(){

  //обновляем:

  //счётчик
  $('div.number').html(number + ' of ' + baseSize);


  // информацию о текущем слове
  eng = $('div#base div:eq(' + (number - 1) + ') p.eng').html();
  pronouns = $('div#base div:eq(' + (number - 1) + ') p.pronouns').html();
  rus = $('div#base div:eq(' + (number - 1) + ') p.rus').html();

  // проверяем напраление перевода
  if(mainLang === 'eng'){
    word = eng;
    wordLang = engVoice;
    translate = rus;
    translateLang = rusVoice;
  }else {
    word = rus;
    wordLang = rusVoice;
    translate = eng;
    translateLang = engVoice;
  }

  // выводим слова на экран
  $('p.word').html(word);
  $('p.transcription').html(pronouns);
  $('p.traslate').html(translate);

  // метки текущего слова
  // one = $('div#base div:eq(' + number + ')').data('pronouns');
  // two = $('div#base div:eq(' + number + ')').data('translate');
  // three = $('div#base div:eq(' + number + ')').data('rest');
  // lable(one, 'one');
  // lable(two, 'two');
  // lable(three, 'three');
  //
  // function lable(button, selector) {
  //   if(button){
  //     $('button.' + selector).css({
  //       backgroundColor: '#ff4040',
  //       color: 'white'
  //     });
  //   }else{
  //     $('button.' + selector).css({
  //       backgroundColor: '#c9c3ff',
  //       color: 'balck'
  //     });
  //   }
  // }

}

// запускаем подготовку
preparing();

function playing() {

    //делаем подготовку с озвучке
    preparing();

    timeToThink = translate.length * 200;

    // спрашиваем
    responsiveVoice.speak(word, wordLang, {rate: 0.8, pitch: 1, volume: 1, onend: endAsking});

    // ...думаем и отвечаем...

    // узаем правильный ответ
    function endAsking() {

        translation = setTimeout(function(){
        responsiveVoice.speak(translate, translateLang, {rate: 0.8, pitch: 1, volume: 1, onend: endAnwering});
      }, timeToThink);
    }
    //..задержка и переключение слова
    function endAnwering() {
      number++;
      pause = setTimeout(playing, 1000);
    };
  };


function timerKiller() {

  clearTimeout(translation);
  clearTimeout(pause);
  clearTimeout(switching);
  responsiveVoice.cancel();
}

// вешаем обработчики
$('div.number').on('focus', function(){
  $(this).empty();
});
$('div.number').on('blur', function(){

  number = +(($(this).html()).replace(/\D/g, "") || number);
  $(this).html(number + ' of ' + baseSize);

  if(isPlaying === true){
    timerKiller();
    preparing();
    switching = setTimeout(playing, 400);
  }else if(isPlaying === false) {
    preparing();
  };
});

$('button#play').on('click', function() {
  timerKiller();
  if(isPlaying === false) { // включаєм
    $('.display').css('backgroundColor', 'red');
    $(this).html('||');
    isPlaying = true;
    playing();
  }else if(isPlaying === true){ // выключаєм
    $('.display').css('backgroundColor', 'white');
    $(this).html('&#10148;');
    isPlaying = false;
  }
});

$('button.next').on('click', function(){
  if(isPlaying === true){
    timerKiller();
    ++number;
    preparing();
    switching = setTimeout(playing, 400);
  }else if(isPlaying === false) {
    ++number;
    preparing();
  };
});

$('button.back').on('click', function(){
  if(isPlaying === true){
    timerKiller();
    --number;
    preparing();
    switching = setTimeout(playing, 400);
  }else if(isPlaying === false) {
    --number;
    preparing();
  };
});
$('.RUSLang').on('click', function() {
    $('.button').css('backgroundColor', 'white');
    $(this).css('backgroundColor', '#00f3ff');
    $('.arrow').html('&lArr;');
    mainLang = 'eng';

    if(isPlaying === true){
      timerKiller();
      preparing();
      switching = setTimeout(playing, 400);
    }else if(isPlaying === false) {
      preparing();
    };
});

$('.ENGLang').on('click', function() {
    $('.button').css('backgroundColor', 'white');
    $(this).css('backgroundColor', '#00f3ff');
    $('.arrow').html('&rArr;');
    mainLang = 'rus';

    if(isPlaying === true){
      timerKiller();
      preparing();
      switching = setTimeout(playing, 400);
    }else if(isPlaying === false) {
      preparing();
    };
});
