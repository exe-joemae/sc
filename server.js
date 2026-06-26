import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { handleScratchRequest } from "./scratch.js";
import { getUserInfo, setUserInfo } from "./userManager.js";
import { getScratchProjectInfo } from "./scratchProject.js";

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
