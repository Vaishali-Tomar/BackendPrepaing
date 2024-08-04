const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let orders = [];

app.post('/orders', (req, res) => {
  const order = req.body;

  if (!order || !order.items || !order.user) {
    return res.status(400).send('Invalid order data');
  }

  order.id = orders.length + 1;
  orders.push(order);

  res.status(201).send(order);
});

app.get('/orders', (req, res) => {
  res.status(200).send(orders);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
