
# Kintone 勤続年数自動更新スクリプト

## 概要

このリポジトリは、kintone REST API を使って、在職中の従業員レコードの勤続年数・月数を自動更新します。

- 毎日深夜1時に自動実行（GitHub Actions）
- GitHub 上から手動でも実行可能
- Basic認証およびAPIトークン対応

## 設定方法

### 1. GitHub Secrets に以下を登録

| Name               | 説明                   |
|--------------------|------------------------|
| `KINTONE_DOMAIN`   | 例: kurushimakai       |
| `KINTONE_API_TOKEN`| kintoneのAPIトークン   |
| `KINTONE_APP_ID`   | アプリID（例: 905）    |
| `KINTONE_BASIC_USER` | Basic認証ユーザー名  |
| `KINTONE_BASIC_PASS` | Basic認証パスワード  |

### 2. 実行内容

- `退職日 = ""` のレコードのみ対象
- `採用日` から勤続年数・月数を計算し、
  - `勤続年数_年` フィールドへ年数（数値）
  - `勤続月数` フィールドへ月数（数値）
  を更新

### 3. 手動実行

GitHub → Actions → Run workflow ボタンから実行できます。
