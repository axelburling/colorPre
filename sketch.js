let data;

let xs, ys;

let model;

let lossP;
let labelP
let rSlider, gSlider, bSlider;

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

function preload() {
  data = loadJSON("colorData.json");
}

function setup() {
  createCanvas(600, 400);

  lossP = createP("Loss");
  labelP = createP(""); 

  rSlider = createSlider(0, 255, 255);
  gSlider = createSlider(0, 255, 0);
  bSlider = createSlider(0, 255, 255);

  let colors = [];
  let labels = [];
  for (let record of data.entries) {
    let col = [record.r / 255, record.g / 255, record.b / 255];
    colors.push(col);
    labels.push(labelList.indexOf(record.label));
  }

  // console.log(colors)

  xs = tf.tensor2d(colors);

  let labelsTensor = tf.tensor1d(labels, "int32");

  ys = tf.oneHot(labelsTensor, 9);
  labelsTensor.dispose();

  // console.log(xs.shape)
  // console.log(ys.shape)
  // xs.print()
  // ys.print()

  model = tf.sequential();

  let hidden = tf.layers.dense({
    units: 16,
    activation: "sigmoid",
    inputShape: [3],
  });

  let output = tf.layers.dense({
    units: 9,
    activation: "softmax",
  });

  model.add(hidden);
  model.add(output);

  const lr = 0.2;
  const optimizer = tf.train.sgd(lr);

  model.compile({
    optimizer,
    loss: "categoricalCrossentropy",
  });

  train().then((results) => {
    console.log(results.history.loss);
  });
}

async function train() {
  const options = {
    epochs: 30,
    validationSplit: 0.1,
    shuffle: true,
    callbacks: {
      onTrainBegin: () => console.log("training start"),
      onTrainEnd: () => console.log("training complete"),
      onBatchEnd: tf.nextFrame,
      onEpochEnd: async (num, logs) => {
        await tf.nextFrame();
        lossP.html("Loss: " + logs.loss);
      },
    },
  };

  return await model.fit(xs, ys, options);
}

function draw() {
  let r = rSlider.value();
  let g = gSlider.value();
  let b = bSlider.value();

  background(r, g, b);

  tf.tidy(() => {
    const xs = tf.tensor2d([r / 255, g / 255, b / 255], [1, 3]);
  
    let results = model.predict(xs);
    let index = results.argMax(1).dataSync()
  
    // index.print();
    let label = labelList[index]
    labelP.html(label)
  })


  // stroke(255)
  // strokeWeight(4)
  // line(frameCount % width, 0, frameCount % width, height)
}
