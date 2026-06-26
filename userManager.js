import { saveToGitHub, loadFromGitHub } from "./github.js";

export async function getUserInfo(userNum) {
    const folder = `users/${userNum}`;

    return {
        display: await loadFromGitHub(`${folder}/display.txt`) || "",
        username: await loadFromGitHub(`${folder}/username.txt`) || "",
        data: await loadFromGitHub(`${folder}/data.txt`) || ""
    };
}

export async function setUserInfo(userNum, info) {
    const folder = `users/${userNum}`;

    if (info.display !== undefined)
        await saveToGitHub(`${folder}/display.txt`, info.display);

    if (info.username !== undefined)
        await saveToGitHub(`${folder}/username.txt`, info.username);

    if (info.data !== undefined)
        await saveToGitHub(`${folder}/data.txt`, info.data);
}

export async function getUserSlots(userNum) {
    const folder = `users/${userNum}/slots.json`;
    const json = await loadFromGitHub(folder);
    return json ? JSON.parse(json) : { slots: [] };
}

export async function saveUserSlots(userNum, slots) {
    const folder = `users/${userNum}/slots.json`;
    await saveToGitHub(folder, JSON.stringify({ slots }));
}
