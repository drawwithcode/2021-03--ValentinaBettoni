//variabili per canzone e per doc json
let mySong;
let treni = [];

//variabili per motion testo
var joinedText;
var alphabet;
var drawLetters = [];

var posX;
var posY;

var drawLines = false;
var drawText = true;

function preload() {
  //doc testo canzone
  joinedText = loadStrings("assets/golgota.txt");
  mySong = loadSound("./assets/Golgota.mp3");
  data = loadJSON("./assets/train.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log(data);

  // impostazioni testo
  textAlign(CENTER);
  textFont("Cutive Mono", 18);
  fill(255);

  // per testo
  joinedText = joinedText.join(" ");
  alphabet = getUniqCharacters();
  for (var i = 0; i < alphabet.length; i++) {
    drawLetters[i] = true;
  }

  // per treni
  for (let i = 0; i < data.treni.length; i++) {
    addPeople(
      random(windowWidth),
      random(windowHeight),
      data.treni[i].binario,
      data.treni[i].cambi,
      data.treni[i].destinazione
    );
  }
}

function draw() {
  background(0);

  // divido lo schermo in 3, mouse su terzo superiore ed inferiore mette in pausa la canzone
  if (mouseY > (height / 8) * 3 && mouseY < (height / 8) * 6) {
    background(255);
    fill(0);
    mySong.pause();
  } else {
    if (mySong.isPlaying() === false) {
      mySong.loop();
    }
    fill(255);

    for (let i = 0; i < treni.length; i++) {
      treni[i].run();
    }
  }

  // posizione testo canzone
  posX = 20;
  posY = (windowHeight / 8) * 3;
  var oldX = 0;
  var oldY = 0;

  for (var i = 0; i < joinedText.length; i++) {
    // charAt icava il carattere della frase alla posizione indicata

    var upperCaseChar = joinedText.charAt(i).toUpperCase();
    var index = alphabet.indexOf(upperCaseChar);
    if (index < 0) continue;

    var sortY = index * 20 + 40;
    var m = map(mouseX, 50, width - 50, 0, 1);
    m = constrain(m, 0, 1);
    var interY = lerp(posY, sortY, m);

    if (drawLetters[index]) {
      if (drawLines) {
        if (oldX != 0 && oldY != 0) {
          stroke(181, 157, 0, 100);
          line(oldX, oldY, posX, interY);
        }
        oldX = posX;
        oldY = interY;
      }

      if (drawText) {
        noStroke();
        text(joinedText.charAt(i), posX, interY);
      }
    } else {
      oldX = 0;
      oldY = 0;
    }

    posX += textWidth(joinedText.charAt(i));
    if (posX >= width - 200 && upperCaseChar == " ") {
      posY += 30;
      posX = 20;
    }
  }
}

function getUniqCharacters() {
  var charsArray = joinedText.toUpperCase().split("");
  var uniqCharsArray = charsArray
    .filter(function (char, index) {
      return charsArray.indexOf(char) == index;
    })
    .sort();
  return uniqCharsArray.join("");
}

// numero cambi modifica il colore della bolla
function addPeople(x, y, size, cambi, destinazione) {
  let bubbleColor;
  if (cambi == "0") {
    bubbleColor = "SlateGray";
  } else {
    bubbleColor = "white";
  }
  const aNewBubble = new Bubble(x, y, size, bubbleColor, destinazione);
  treni.push(aNewBubble);
}

class Bubble {
  constructor(temp_x, temp_y, temp_r, temp_color, temp_destinazione) {
    this.x = temp_x;
    this.y = temp_y;
    this.r = temp_r;
    this.color = temp_color;
    this.destinazione = temp_destinazione;

    this.speed = 2;
    this.yDir = 1;
    this.xDir = 1;
  }

  // numero treno cambia dimensione bolla (lo moltiplico per 5 perchè troppo piccole)
  display() {
    push();
    noStroke();
    fill(color(this.color));
    ellipse(this.x, this.y, this.r * 5);
    textAlign(CENTER);
    fill("DimGray");
    // nella bolla scrivo la destinazione del treno
    text(this.destinazione, this.x, this.y);
    pop();
  }

  // imposto movimento e rimbalzo bolle
  updatePosition() {
    this.x += this.speed * this.xDir;
    this.y += this.speed * this.yDir;
    if (this.y >= height || this.y <= 0) {
      this.yDir *= -1;
    }
    if (this.x >= width || this.x <= 0) {
      this.xDir *= -1;
    }
  }

  run() {
    this.updatePosition();
    this.display();
  }
}

//Reference codice motion testo:
// Generative Gestaltung – Creative Coding im Web
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
