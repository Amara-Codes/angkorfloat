

async function test() {
  const url = 'https://sync.angkorfloat.com';
  const secret = process.env.D1_PROXY_SECRET || 'inserisci_qui_una_password_sicura';

  const body = {
    action: 'raw',
    sql: 'SELECT * FROM Therapist LIMIT 1',
    options: { columnNames: true }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secret}`
    },
    body: JSON.stringify(body)
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}

test().catch(console.error);
