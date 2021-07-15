let labelList = [
  "red-ish",
  "green-ish",
  "blue-ish",
  "orange-ish",
  "yellow-ish",
  "pink-ish",
  "purple-ish",
  "brown-ish",
  "grey-ish",
];

let r, g, b;

let database;
let colorDatabase;

function pickColor() {
  r = floor(random(255));
  g = floor(random(255));
  b = floor(random(255));
  background(r, g, b);
}

function setup() {
  var firebaseConfig = {
    apiKey: "AIzaSyA-LQWJ-iYzrc4Ni57nH8_0z9oshDSUYyk",
    authDomain: "color-predictior.firebaseapp.com",
    databaseURL:
      "https://color-predictior-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "color-predictior",
    storageBucket: "color-predictior.appspot.com",
    messagingSenderId: "308939934981",
    appId: "1:308939934981:web:34868e234f70280c90bb6c",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  colorDatabase = database.ref("color");

  createCanvas(400, 400);
  pickColor();

  let buttons = [];
  labelList.map((label) => {
    buttons.push(createButton(label));
  });

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].size(100, 50);
    buttons[i].style("font-size", "18px");
    buttons[i].style('margin', '20px')
    buttons[i].mousePressed(sendData);
  }

  let btn = createButton("get data");
  btn.mousePressed(getData);
  btn.size(100, 50);
  btn.style("font-size", "18px");
  btn.style('margin', '20px')

  function sendData() {
    let data = {
      r,
      g,
      b,
      label: this.html(),
    };

    console.log("saving Data: " + data);

    let color = colorDatabase.push(data, (err) => {
      if (err) {
        console.log("something went wrong");
        console.error(err);
      } else {
        pickColor();
        console.log("Success!!! and new color");
      }
    });
    console.log("Firebase generated key: " + color.key);

    console.log(this.html());
  }

  function getData() {
    colorDatabase.once("value", (result) => {
      let data = result.val();

      console.log(Object.keys(data).length);
      createP(Object.keys(data).length);
    });
  }
}
