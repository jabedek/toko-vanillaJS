Array.prototype.eventPush = function (e, t) {
  this.push(e), t(this);
};
let app = document.getElementById("app"),
  start = document.getElementById("start"),
  startButton = document.getElementById("startButton");
startButton.addEventListener("click", (e) => {
  e.preventDefault(),
    (start.style = "display: none"),
    (app.style = "display: block"),
    setTimeout(function () {
      setupVoices(),
        void 0 !== speechSynthesis.onvoiceschanged &&
          (speechSynthesis.onvoiceschanged = setupVoices);
    }, 0),
    setTimeout(function () {
      welcome();
    }, 1e3);
});
let username = document.getElementById("username"),
  nameHolder = document.getElementById("nameHolder");
nameHolder.style = "display: none";
let usernameInput = document.getElementById("usernameInput");
usernameInput.addEventListener("input", () => {
  usernameLength.innerHTML = usernameInput.value.length;
});
let goButton = document.getElementById("goButton");
goButton.addEventListener("click", (e) => {
  (e.target.style = "display: none; width: 0;"), animateUsername();
}),
  usernameInput.addEventListener("focus", () => {
    goButton.style = "display: flex";
  }),
  usernameInput.addEventListener("change", () => {
    goButton.style = "display: flex";
  });
let usernameLength = document.getElementById("usernameLength"),
  speechyStateProcess = document.getElementById("speechyStateProcess");
speechyStateProcess.innerHTML = " - Nie działa w Firefox";
const voiceSelect = document.querySelector("select"),
  initialName = generateUsername();
(usernameInput.value = initialName),
  (usernameLength.innerHTML = initialName.length);
const SpeechRecognition = webkitSpeechRecognition,
  SpeechGrammarList = webkitSpeechGrammarList,
  SpeechRecognitionEvent = webkitSpeechRecognitionEvent;
(speechyStateProcess.innerHTML = " ..."),
  (speechyStateProcess.style = "color: grey");
const terms = ["kanon", "anon", "anno domini"],
  grammar =
    "#JSGF V1.0; grammar terms; public <terms> = " + terms.join(" | ") + " ;",
  speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
const recognition = new SpeechRecognition();
(recognition.grammars = speechRecognitionList),
  (recognition.continuous = !1),
  (recognition.lang = "pl-PL"),
  (recognition.interimResults = !1),
  (recognition.maxAlternatives = 1);
const synth = window.speechSynthesis;
synth.resume();
let userAnswers = [],
  lastReaction = ["Życzę miłego dnia!"];

(nameReaction = ["Super", "Okej"]),
  (tokoQuestions = []),
  (tokoReactions = { nameReaction: nameReaction }),
  (voices = []),
  (voicesPL = []),
  (voicesRemote = []);
function init() {}
function generateUsername() {
  const e = ["unique", "magnificent", "wonderful"],
    t = ["entity", "bastard", "subject"],
    n = [];
  return (
    e[Math.floor(Math.random() * (e.length - 0)) + 0] +
    "-" +
    t[Math.floor(Math.random() * (t.length - 0)) + 0] +
    "-" +
    n[Math.floor(Math.random() * (n.length - 0)) + 0]
  );
}
function animateUsername() {
  (nameHolder.innerHTML = usernameInput.value),
    (nameHolder.style = "display: initial"),
    (username.style = "display: none"),
    setTimeout(() => {
      nameHolder.classList.add("slide-to-leftTop"),
        (goButton.style.display = "none");
    }, 0),
    setTimeout(() => {
      nameHolder.classList.add("name__holder--moved");
    }, 800);
}
function welcome() {
  say("Witaj człowieku. "),
    say("Jestem Toko."),
    say("A jak wołają na ciebie?"),
    setTimeout(() => {
      hear();
    }, 5000);
}
function hear() {
  (speechyStateProcess.innerHTML = " czeka na odpowiedź"),
    (speechyStateProcess.style = "color: blue"),
    console.log("[Listening for speech...]"),
    recognition.start();
}
function say(e, t = 1.1, n = 0.9) {
  (speechyStateProcess.innerHTML = " mówi"),
    (speechyStateProcess.style = "color: orange");
  let o = new SpeechSynthesisUtterance(e);
  (o.voice = voicesRemote[0] || voicesPL[0]),
    (o.pitch = t),
    (o.rate = n),
    (o.onpause = function (e) {
      let t = e.utterance.text.charAt(e.charIndex);
      console.log(
        "Speech paused at character " +
          e.charIndex +
          ' of "' +
          e.utterance.text +
          '", which is "' +
          t +
          '".'
      );
    }),
    synth.speak(o);
}

function sayMany(parts, t, n) {
  parts.forEach((part, i) => {
    say(parts[i], t, n);
  });
}

function getRndArrItem(e) {
  return e[Math.floor(Math.random() * (e.length - 0)) + 0];
}
function setupVoices() {
  if (
    (synth.getVoices().forEach((e) => {
      "pl-PL" === e.lang &&
        (voicesPL.push(e), !1 === e.localService && voicesRemote.push(e));
    }),
    voicesPL.length)
  ) {
    let e = [];
    if (voicesRemote.length) {
      e = [...voicesRemote, ...voicesPL];
      let t = document.createElement("option");
      (t.textContent = voicesRemote[0].name),
        t.setAttribute("data-lang", voicesRemote[0].lang),
        t.setAttribute("data-name", voicesRemote[0].name),
        voiceSelect.appendChild(t),
        (document.getElementById(
          "default-voice"
        ).innerHTML = `[domyślny głos: ${voicesRemote[0].name}]`);
    } else e = voicesPL;
    for (i = 0; i < voicesPL.length; i++) {
      let e = document.createElement("option");
      (e.textContent = voicesPL[i].name),
        e.setAttribute("data-lang", voicesPL[i].lang),
        e.setAttribute("data-name", voicesPL[i].name),
        voiceSelect.appendChild(e);
    }
  }
}
recognition.addEventListener("result", (e) => {
  (speechyStateProcess.innerHTML = " analizuje wypowiedź"),
    (speechyStateProcess.style = "color: #f3eada");
  var t = e.results[0][0].transcript;
  userAnswers.eventPush(t, (e) => {}),
    1 === userAnswers.length &&
      ((usernameInput.value = userAnswers[0]),
      (usernameLength.innerHTML = usernameInput.value.length),
      setTimeout(() => {
        animateUsername(),
          say(userAnswers[0] + "?"),
          say(getRndArrItem(tokoReactions.nameReaction));

        say("To już koniec tego demo...", 1.1, 0.9);
        say(lastReaction.join(), 1.1, 0.9);
      }, 700)),
    (speechyStateProcess.innerHTML = " nasłuchuje..."),
    (speechyStateProcess.style = "color: #f3eada"),
    console.log(
      "[Recognized: '" +
        t +
        "', Confidence: " +
        e.results[0][0].confidence +
        "]"
    );
}),
  recognition.addEventListener("speechend", (e) => {
    recognition.stop(),
      (speechyStateProcess.innerHTML = " odpoczywa"),
      (speechyStateProcess.style = "color: #f3eada"),
      console.log("[Recognition stopped on speech end]");
  }),
  recognition.addEventListener("nomatch", (e) => {
    (speechyStateProcess.innerHTML = " nie zrozumiał tej wypowiedzi"),
      (speechyStateProcess.style = "color: lightcoral"),
      console.log("[Didnt recognize that - " + e.error + "]"),
      setTimeout(() => {
        animateUsername();
      }, 700);
  }),
  recognition.addEventListener("error", (e) => {
    (speechyStateProcess.innerHTML = " umarło"),
      (speechyStateProcess.style = "color: red"),
      console.log("[Error occurred in recognition: " + e.error + "]"),
      setTimeout(() => {
        animateUsername();
      }, 700);
  });
