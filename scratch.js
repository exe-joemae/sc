import { saveToGitHub, loadFromGitHub } from "./github.js";

export async function handleScratchRequest(raw) {
    // 例: "000100020003.3HelloWorld"
    const [userNum, rest] = raw.split(".");
    const type = rest[0];
    const body = rest.substring(1);

    const userFolder = `users/${userNum}`;

    switch (type) {
        case "1": // 表示名取得
            return await loadFromGitHub(`${userFolder}/display.txt`) || "";

        case "2": // ユーザー名取得
            return await loadFromGitHub(`${userFolder}/username.txt`) || "";

        case "3": // データ保存
            await saveToGitHub(`${userFolder}/data.txt`, body);
            return "saved";

        case "4": // データロード
            return await loadFromGitHub(`${userFolder}/data.txt`) || "";

        default:
            return "error_unknown_type";
    }
}
