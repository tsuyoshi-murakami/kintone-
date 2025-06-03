
const axios = require('axios');
const dayjs = require('dayjs');

// kintone 認証情報（GitHub Secrets から）
const DOMAIN = process.env.KINTONE_DOMAIN;
const APP_ID = process.env.KINTONE_APP_ID;
const API_TOKEN = process.env.KINTONE_API_TOKEN;
const BASIC_USER = process.env.KINTONE_BASIC_USER;
const BASIC_PASS = process.env.KINTONE_BASIC_PASS;

// 勤続年数計算関数
function calculateService(hireDateStr) {
  const hireDate = dayjs(hireDateStr);
  const today = dayjs();

  let years = today.year() - hireDate.year();
  let months = today.month() - hireDate.month();
  if (today.date() < hireDate.date()) months--;
  if (months < 0) { years--; months += 12; }

  return { years, months };
}

// 在職レコード取得
async function fetchRecords() {
  const records = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await axios.get(`https://${DOMAIN}.cybozu.com/k/v1/records.json`, {
      headers: {
        'X-Cybozu-API-Token': API_TOKEN
      },
      auth: {
        username: BASIC_USER,
        password: BASIC_PASS
      },
      params: {
        app: APP_ID,
        query: '退職日 = "" limit 100 offset ' + offset
      }
    });

    records.push(...res.data.records);
    if (res.data.records.length < limit) break;
    offset += limit;
  }

  return records;
}

// レコードをまとめて更新（100件ずつ）
async function bulkUpdate(records) {
  const limit = 100;
  for (let i = 0; i < records.length; i += limit) {
    const chunk = records.slice(i, i + limit);
    const updates = chunk.map(record => {
      const id = record.$id.value;
      const hireDate = record['採用日'].value;
      if (!hireDate) return null;

      const { years, months } = calculateService(hireDate);
      return {
        id,
        record: {
          '勤続年数_年': { value: years },
          '勤続月数': { value: months }
        }
      };
    }).filter(r => r !== null);

    if (updates.length > 0) {
      await axios.put(`https://${DOMAIN}.cybozu.com/k/v1/records.json`, {
        app: APP_ID,
        records: updates
      }, {
        headers: {
          'X-Cybozu-API-Token': API_TOKEN,
          'Content-Type': 'application/json'
        },
        auth: {
          username: BASIC_USER,
          password: BASIC_PASS
        }
      });

      console.log(`✅ ${updates.length} 件を更新しました (${i + 1}〜${i + updates.length})`);
    }
  }
}

// メイン処理
(async () => {
  console.log('🔁 在職者の勤続年数を更新中...');
  const records = await fetchRecords();
  await bulkUpdate(records);
  console.log('🎉 全レコード更新完了');
})();
