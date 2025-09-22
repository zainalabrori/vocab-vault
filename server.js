const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = './db.json';

function readData() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/words', (req, res) => {
  const words = readData();
  res.json(words);
});

app.get('/api/words/:id', (req, res) => {
  const words = readData();
  const word = words.find((w) => w.id == req.params.id);
  if (word) {
    res.json(word);
  } else {
    res.status(404).send('Word not found');
  }
});

app.post('/api/words', (req, res) => {
  const words = readData();
  const newWord = {
    id: Date.now(),
    ...req.body,
    date: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  };
  words.push(newWord);
  writeData(words);
  res.status(201).json(newWord);
});

app.put('/api/words/:id', (req, res) => {
  const words = readData();
  const index = words.findIndex((w) => w.id == req.params.id);
  if (index !== -1) {
    words[index] = { ...words[index], ...req.body };
    writeData(words);
    res.json(words[index]);
  } else {
    res.status(404).send('Word not found');
  }
});

app.delete('/api/words/:id', (req, res) => {
  const words = readData();
  const updatedWords = words.filter((w) => w.id != req.params.id);
  if (words.length !== updatedWords.length) {
    writeData(updatedWords);
    res.status(204).send();
  } else {
    res.status(404).send('Word not found');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});