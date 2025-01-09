const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://Amber:amber123456@amber.uggvd.mongodb.net/?retryWrites=true&w=majority&appName=AMBER')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const orderSchema = new mongoose.Schema({
  customerName: String,
  items: [{ name: String, quantity: Number, price: Number }],
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
});

const Order = mongoose.model('Order', orderSchema);

// 新增訂單
app.post('/orders', async (req, res) => {
  const { customerName, items, totalAmount } = req.body;
  const order = new Order({ customerName, items, totalAmount });
  await order.save();
  res.status(201).send(order);
});

app.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const updatedOrder = await Order.findByIdAndUpdate(id, { status: 'completed' }, { new: true });
  res.status(200).send(updatedOrder);
});

app.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).send({ error: 'Order not found' });
    }
    res.status(200).send({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

// 取得所有訂單
app.get('/orders', async (req, res) => {
  const orders = await Order.find();
  res.status(200).send(orders);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
