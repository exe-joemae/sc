import { saveToGitHub, loadFromGitHub } from "./github.js";
import crypto from "crypto";

function hash(pw) {
    return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function createAccount(username, display, password) {
    const folder = `users/${username}`;

    const exists = await loadFromGitHub(`${folder}/password.txt`);
    if (exists) return { error: "already_exists" };

    await saveToGitHub(`${folder}/display.txt`, display);
    await saveToGitHub(`${folder}/username.txt`, username);
    await saveToGitHub(`${folder}/password.txt`, hash(password));

    return { ok: true };
}

export async function login(username, password) {
    const folder = `users/${username}`;
    const stored = await loadFromGitHub(`${folder}/password.txt`);

    if (!stored) return { error: "not_found" };
    if (stored !== hash(password)) return { error: "wrong_password" };

    return { ok: true };
}
