
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
        timer = setTimeout(function () {
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
