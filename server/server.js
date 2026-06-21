const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 静的ファイル（views 配下）
app.use(express.static(path.join(__dirname, "views")));

// データファイルパス
const DATA_DIR = path.join(__dirname, "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// 初期化
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(PROJECTS_FILE)) fs.writeFileSync(PROJECTS_FILE, JSON.stringify({}), "utf-8");
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify({}), "utf-8");

// ユーティリティ
function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function generateAccountNumber(username) {
  // username から短い番号を作る（例：ハッシュの先頭4桁）
  const hash = crypto.createHash("sha256").update(username).digest("hex");
  const num = parseInt(hash.slice(0, 6), 16) % 100000; // 0〜99999
  return num.toString().padStart(5, "0"); // 5桁固定
}

// ルート：加入フォームページ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// API: プロジェクト紐づけ登録（自作IDを自動採番）
app.post("/api/project", (req, res) => {
  const { scratchProjectId } = req.body;

  if (!scratchProjectId) {
    return res.status(400).json({ error: "scratchProjectId は必須です。" });
  }

  const projects = loadJson(PROJECTS_FILE);

  // すでに登録済みの Scratch プロジェクトID ならそのまま返す
  for (const customId in projects) {
    if (projects[customId].scratchProjectId === scratchProjectId) {
      return res.json({
        message: "既に登録済みのプロジェクトです。",
        customProjectId: customId,
        scratchProjectId
      });
    }
  }

  // 自作プロジェクトIDを自動採番（0001〜9999）
  const existingIds = Object.keys(projects).map(id => parseInt(id, 10));
  const nextId = (existingIds.length === 0 ? 1 : Math.max(...existingIds) + 1);

  if (nextId > 9999) {
    return res.status(400).json({ error: "プロジェクトIDが上限に達しました。" });
  }

  const customProjectId = nextId.toString().padStart(4, "0");

  // 保存
  projects[customProjectId] = {
    scratchProjectId,
    createdAt: new Date().toISOString()
  };

  saveJson(PROJECTS_FILE, projects);

  res.json({
    message: "プロジェクトを登録しました。",
    customProjectId,
    scratchProjectId
  });
});

// API: ユーザー登録（アカウント番号発行）
app.post("/api/user", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username は必須です。" });
  }

  const users = loadJson(USERS_FILE);

  // 既に登録済みならそのまま返す
  if (users[username]) {
    return res.json({
      message: "既に登録済みのユーザーです。",
      username,
      accountNumber: users[username].accountNumber
    });
  }

  const accountNumber = generateAccountNumber(username);

  users[username] = {
    accountNumber,
    createdAt: new Date().toISOString()
  };

  saveJson(USERS_FILE, users);

  res.json({
    message: "ユーザーを登録しました。",
    username,
    accountNumber
  });
});

// API: 情報取得（確認用）
app.get("/api/projects", (req, res) => {
  const projects = loadJson(PROJECTS_FILE);
  res.json(projects);
});

app.get("/api/users", (req, res) => {
  const users = loadJson(USERS_FILE);
  res.json(users);
});

// サーバ起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
