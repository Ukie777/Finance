document.getElementById('orderForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const customerName = document.getElementById('customerName').value;
    const items = [];
    const itemElements = document.querySelectorAll('.item');
    itemElements.forEach(item => {
      const name = item.querySelector('.itemName').value;
      const quantity = item.querySelector('.itemQuantity').value;
      const price = item.querySelector('.itemPrice').value;
      items.push({ name, quantity, price });
    });
  
    const response = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName, items, totalAmount: calculateTotalAmount(items) })
    });
    const result = await response.json();
    console.log('Order placed:', result);
    displayOrders();
  });
  
  // 讓使用者能夠加更多項目
  document.getElementById('addItem').addEventListener('click', () => {
    const newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.innerHTML = `
      <input type="text" class="itemName" placeholder="Item Name" required>
      <input type="number" class="itemQuantity" placeholder="Quantity" required>
      <input type="number" class="itemPrice" placeholder="Price" required>
    `;
    document.getElementById('itemsContainer').appendChild(newItem);
  });
  
  function calculateTotalAmount(items) {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  }
  const completeOrder = async (orderId) => {
    const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
      method: 'PUT',
    });
    const result = await response.json();
    console.log('Order completed:', result);
  };
  
  const deleteOrder = async (orderId) => {
    const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    alert('Order deleted: ' + (result.message || result.error));
    loadOrders(); // 刷新顯示訂單列表
  };

  const searchOrder = async () => {
    const customerName = document.getElementById('searchInput').value;
    const response = await fetch(`http://localhost:3000/orders?customerName=${customerName}`);
    const orders = await response.json();
  
    const orderDisplay = document.getElementById('orderDisplay');
    orderDisplay.innerHTML = ''; // 清空之前的訂單內容
  
    orders.forEach(order => {
      const orderElement = document.createElement('div');
      orderElement.innerHTML = `
        <p>客戶名稱: ${order.customerName}</p>
        <p>訂單金額: $${order.totalAmount}</p>
      `;
      orderDisplay.appendChild(orderElement);
    });
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.innerHTML = `
          <p>${order.customerName}</p>
          <button onclick="deleteOrder('${order._id}')">Delete</button>
        `;
        document.getElementById('orderDisplay').appendChild(orderElement);
      });
  };

  async function displayOrders() {
    const response = await fetch('http://localhost:3000/orders');
    const orders = await response.json();
    const orderDisplay = document.getElementById('orderDisplay');
    orderDisplay.innerHTML = orders.map(order => `
      <div>
        <p>Customer: ${order.customerName}</p>
        <ul>
          ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - $${item.price}</li>`).join('')}
        </ul>
        <p>Total: $${order.totalAmount}</p>
      </div>
    `).join('');
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.innerHTML = `
          <p>${order.customerName}</p>
          <button onclick="deleteOrder('${order._id}')">Delete</button>
        `;
        document.getElementById('orderDisplay').appendChild(orderElement);
      });
  }
  