
# Kintone 勤続年数・年齢 自動更新スクリプト

## 概要

このリポジトリは、kintone REST API を使って、在職中の従業員レコードの以下フィールドを自動更新します：

- 勤続年数（`勤続年数_年`、`勤続月数`）
- 年齢（`年齢`）

## 特徴

- 毎日深夜1時（JST）に自動実行（GitHub Actions）
- GitHub 上から手動でも実行可能
- Basic認証 + APIトークン対応

## GitHub Secrets に登録するもの

| Name                | 例                |
|---------------------|------------------|
| `KINTONE_DOMAIN`     | kurushimakai      |
| `KINTONE_API_TOKEN`  | （APIトークン）   |
| `KINTONE_APP_ID`     | 905               |
| `KINTONE_BASIC_USER` | kurushimakai      |
| `KINTONE_BASIC_PASS` | （Basicパスワード）|

