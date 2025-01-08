const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();
const merge = require('merge-descriptors');

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://Amber:amber123456@amber.uggvd.mongodb.net/?retryWrites=true&w=majority&appName=AMBER')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

const transactionSchema = new mongoose.Schema({
  date: Date,
  amount: Number,
  category: String,
  type: { type: String, enum: ['income', 'expense'] }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.post('/transactions', async (req, res) => {
  const transaction = new Transaction(req.body);
  await transaction.save();
  res.status(201).send(transaction);
});

app.get('/transactions', async (req, res) => {
  const transactions = await Transaction.find();
  res.status(200).send(transactions);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});


