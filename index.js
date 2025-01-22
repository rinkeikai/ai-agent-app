const express = require('express');
const axios = require('axios');
const fs = require("fs"); // ファイル操作を行うためのモジュール

const app = express();
const port = 3000;

app.use(express.json());

const knowledgeFile = "knowledge.json"; // 知識を保存するファイル

// 知識を読み込む
function loadKnowledge() {
  if(!fs.existsSync(knowledgeFile)) { // ファイルが存在しない場合に初期化する
    fs.writeFileSync(knowledgeFile, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(knowledgeFile)); // ファイルを読み込んで返す
}

// 知識を保存する
function saveKnowledge(data) {
  fs.writeFileSync(knowledgeFile, JSON.stringify(data, null, 2))
}


// サーバー確認用
app.get('/', (req, res) => {
  res.send('Welcome to the AI Agent App');
});

// 学習用エンドポイント
app.post('/learn', (req, res) => {
  const { word, meaning} = req.body;

  if (!word || !meaning) {
    return res.status(400).json({ error: "word and meaning are required."});
  }

  const knowledge = loadKnowledge(); // 現在の知識を読み込む
  knowledge[word] = meaning; // 新しい単語と意味を追加
  saveKnowledge(knowledge); // 知識を保存する

  res.json({ message: `Learned: ${word} -> ${meaning}` });
})

// 質問に答えるエンドポイント
app.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  const knowledge =loadKnowledge();
  const answer = knowledge[question];

  if(answer) {
    res.json({ answer });
  } else {
    res.json({ answer: "I don't know. Can you teach me?" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});