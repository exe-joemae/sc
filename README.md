# Scratch Cloud Service (GitHub Storage)

Scratch → Render → GitHub のデータ保存サービス。

## API

### POST /scratch

Scratch から送られるデータ形式：
> [ユーザー名4桁コード列].[識別番号][データ本体]

### 識別番号

| 番号 | 内容 |
|------|------|
| 1 | 表示名取得 |
| 2 | ユーザー名取得 |
| 3 | データ保存 |
| 4 | データロード |

### GitHub 保存先
> users/[ユーザーコード]/  
> ├ display.txt  
> ├ username.txt  
> └ data.txt
