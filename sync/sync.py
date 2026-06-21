import requests
import json
import os

# Scratch API からクラウド変数を取得
PROJECT_ID = "あなたのScratchプロジェクトID"
CLOUD_API = f"https://clouddata.scratch.mit.edu/logs?projectid={PROJECT_ID}&limit=1"

def fetch_cloud():
    r = requests.get(CLOUD_API)
    logs = r.json()
    if not logs:
        return None
    return logs[0]["value"]  # 最新のクラウド変数の値

def parse_protocol(value):
    """
    形式: [アカウント番号].[命令コード][プロジェクトID][データ本体]
    例: 12.104001234567890
    """
    if "." not in value:
        return None

    account, payload = value.split(".", 1)

    command = payload[0]          # 命令コード
    project_id = payload[1:3]     # プロジェクトID（2桁）
    data = payload[3:]            # データ本体

    return {
        "account": account,
        "command": command,
        "project_id": project_id,
        "data": data
    }

def save_data(parsed):
    project_folder = f"database/project_{parsed['project_id']}"
    os.makedirs(project_folder, exist_ok=True)

    file_path = f"{project_folder}/user_{parsed['account']}.json"

    # 既存データ読み込み
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            user_data = json.load(f)
    else:
        user_data = {}

    # 命令コードに応じて処理
    if parsed["command"] == "1":  # セーブ
        user_data["save"] = parsed["data"]

    elif parsed["command"] == "3":  # 表示名変更
        user_data["displayName"] = parsed["data"]

    # 保存
    with open(file_path, "w") as f:
        json.dump(user_data, f, indent=2)

def main():
    value = fetch_cloud()
    if not value:
        print("No cloud data.")
        return

    parsed = parse_protocol(value)
    if not parsed:
        print("Invalid format.")
        return

    save_data(parsed)
    print("Saved:", parsed)

if __name__ == "__main__":
    main()
