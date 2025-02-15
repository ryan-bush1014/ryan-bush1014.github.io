let tok2index = {};
let index2tok = {};


(async function () {
  const response = await fetch('data.json');
  const data = await response.json();
  tok2index = data.tok2index;
  index2tok = data.index2tok;
  console.log(data)
})()

// Softmax function to normalize logits
function softmax(logits) {
  const max = Math.max(...logits);
  const exps = logits.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sum);
}

// Sample function to choose from the distribution
function sampleFromDistribution(probabilities) {
  const r = Math.random();
  let cumSum = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumSum += probabilities[i];
    if (r < cumSum) return i;
  }
  return probabilities.length - 1;
}

const maxInference = 500;

async function runInference(inputText) {
  console.log("running inference")
  const session = await ort.InferenceSession.create('./shakespeare.onnx');

  let generatedTokens = tokenize(inputText).map(token => tok2index[token] || 0);

  let inputTokens = generatedTokens.slice(-128);

  let srcTensor = new ort.Tensor(
    'int64',
    BigInt64Array.from(inputTokens.map(BigInt)),
    [1, inputTokens.length]
  );
  let tgtTensor = new ort.Tensor(
    'int64',
    BigInt64Array.from(inputTokens.map(BigInt)),
    [1, inputTokens.length]
  );

  

  while (!genMode) { 
    const feeds = { src: srcTensor, tgt: tgtTensor };
    const results = await session.run(feeds);
    const logits = results.out.data;

    // Sample next token
    const newToken = sampleFromDistribution(softmax(logits.slice(-13332).map(l => l/temp.value)));
    generatedTokens.push(newToken);

    await new Promise(resolve => setTimeout(resolve, 0));
    promptBox.value = decode(generatedTokens);
    if (isScrolledToBottom) {
      promptBox.scrollTop = promptBox.scrollHeight;
    }

    const newSeq = generatedTokens.slice(-128);
    srcTensor = new ort.Tensor(
      'int64',
      BigInt64Array.from(newSeq.map(BigInt)),
      [1, newSeq.length]
    );
    tgtTensor = new ort.Tensor(
      'int64',
      BigInt64Array.from(newSeq.map(BigInt)),
      [1, newSeq.length]
    );
  }
}

function tokenize(text) {
  const pattern = /\w+|[^\w\s]|[\s]+/g;
  return text.match(pattern) || [];
}

function decode(tokenIndices) {
  return tokenIndices.map(i => index2tok[i] || "").join("");
}

let promptBox = document.querySelector('.interact');
let genBut = document.querySelector('.generateButton');
let genMode = true;
genBut.addEventListener('click', () => {
  if(genMode) {
    genMode = false;
    runInference(promptBox.value);
    genBut.innerHTML = "🔮 Stop"
    
  } else {
    genBut.innerHTML = "🔮 Generate"
    genMode = true;
  }
});

let isScrolledToBottom = true;

promptBox.addEventListener('scroll', () => {
  if (promptBox.scrollTop + promptBox.clientHeight < promptBox.scrollHeight) {
    isScrolledToBottom = false;
  } else {
    isScrolledToBottom = true;
  }
});

let temp = document.querySelector('.tempSlider');
let tempInd = document.querySelector('.tempInd');
temp.addEventListener('input', () => {
  tempInd.innerHTML = `Temperature: ${temp.value}`;
});
