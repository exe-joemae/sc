import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { handleScratchRequest } from "./scratch.js";
import { getUserInfo, setUserInfo } from "./userManager.js";
import { getScratchProjectInfo } from "./scratchProject.js";
import { createAccount, login } from "./auth.js";
import { generateMappingText } from "./converter.js";

const app = express();
app.use(express.json());

// 静的ファイル（GUI）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Scratch → Render API
app.post("/scratch", async (req, res) => {
    const result = await handleScratchRequest(req.body.data);
    res.json({ response: result });
});

// GUI API: ユーザー情報取得
app.get("/api/user/:id", async (req, res) => {
    const data = await getUserInfo(req.params.id);
    res.json(data);
});

// GUI API: ユーザー情報更新
app.post("/api/user/:id", async (req, res) => {
    await setUserInfo(req.params.id, req.body);
    res.json({ status: "ok" });
});

// Render 用ポート
app.listen(10000, () => {
    console.log("Render server running");
});

app.get("/api/project/:id", async (req, res) => {
    const info = await getScratchProjectInfo(req.params.id);
    res.json(info || { error: "not_found" });
});

app.post("/api/signup", async (req, res) => {
    const { username, display, password } = req.body;

    console.log("SIGNUP:", username);

    const result = await createAccount(username, display, password);
    res.json(result);
});


app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const result = await login(username, password);

    if (result.ok) req.session.user = username;

    res.json(result);
});

app.get("/download/mapping.txt", (req, res) => {
    const text = generateMappingText();
    res.setHeader("Content-Type", "text/plain");
    res.send(text);
});
