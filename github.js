import fetch from "node-fetch";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "exe-joemae";
const REPO_NAME = "scratch-cloud-service";

export async function saveToGitHub(path, content) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

    const getRes = await fetch(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    let sha = null;
    if (getRes.status === 200) {
        const json = await getRes.json();
        sha = json.sha;
    }

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "update data",
            content: Buffer.from(content).toString("base64"),
            sha
        })
    });

    return res.json();
}

export async function loadFromGitHub(path) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

    const res = await fetch(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    if (res.status !== 200) return null;

    const json = await res.json();
    return Buffer.from(json.content, "base64").toString();
}
