document.getElementById('transactionForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const date = document.getElementById('date').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;
  
    const response = await fetch('http://localhost:3000/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, amount, category, type })
    });
    const result = await response.json();
    console.log('Transaction added:', result);
  });
  