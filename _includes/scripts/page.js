/*(function () {

})();*/










/* LOADING TEXT ANIME */

var speed = "1000" // in ms 1000ms = 1s
var timer;
var con = "";
var c = 0;
var text = document.getElementById("loadingText").textContent;
var letters = text.split("");

//convert text to letters , and add each letter in span
function textToLetters(t) {
  for (i = 0; i < t.length; i++) {
    con += "<span id='" + i + "' class='extra' >" + t[i] + "</span>";
  }
  document.getElementById("loadingText").innerHTML = con;
}

function startAnime(id) {
  if (c < letters.length) {
    timer = setTimeout(function() {
      if (c == 0) {
        document.getElementById("" + (letters.length - 1) + "").classList.remove("anime");
      }
      if (c > 0) {
        document.getElementById("" + (c - 1) + "").classList.remove("anime");
      }
      document.getElementById("" + c + "").classList.add("anime");
      c++
      startAnime();
    }, speed);
  } else {
    c = 0;
    startAnime();
  }
}

//stop animetion
function stopAnime() {
  clearTimeout(timer);
}

textToLetters(letters);
startAnime();










/* Back to top */

const backToTopButton = document.querySelector("#back-to-top-btn");

window.addEventListener("scroll", scrollFunction);

function scrollFunction() {
  if (window.pageYOffset > 300) { // Show backToTopButton
    if(!backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnExit");
      backToTopButton.classList.add("btnEntrance");
      backToTopButton.style.display = "block";
    }
  }
  else { // Hide backToTopButton
    if(backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnEntrance");
      backToTopButton.classList.add("btnExit");
      setTimeout(function() {
        backToTopButton.style.display = "none";
      }, 250);
    }
  }
}

backToTopButton.addEventListener("click", smoothScrollBackToTop);

// function backToTop() {
//   window.scrollTo(0, 0);
// }

function smoothScrollBackToTop() {
  const targetPosition = 0;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 750;
  let start = null;
  
  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
    if (progress < duration) window.requestAnimationFrame(step);
  }
}

function easeInOutCubic(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};










/* 鼠标光标梯度跟踪 */

var btn = document.querySelector('.mouse-cursor-gradient-tracking')
btn.onmousemove = function(e) {
  var x = e.pageX - btn.offsetLeft
  var y = e.pageY - btn.offsetTop
  btn.style.setProperty('--x', x + 'px')
  btn.style.setProperty('--y', y + 'px')
}