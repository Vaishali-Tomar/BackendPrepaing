const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

const ordersFilePath = path.join(__dirname, 'orders.json');

// Helper function to read orders from file
const readOrdersFromFile = () => {
  try {
    const data = fs.readFileSync(ordersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Return empty array if there is an error reading the file
  }
};

// Helper function to write orders to file
const writeOrdersToFile = (orders) => {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
};

// Fetch all orders
app.get('/orders', (req, res) => {
  const orders = readOrdersFromFile();
  res.json(orders); // Send the array of orders as JSON response
});

// Find an order by ID
app.get('/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  const orders = readOrdersFromFile();
  const order = orders.find(o => o.id === orderId);

  if (order) {
    res.json(order); // Send the found order as JSON response
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// Add a new order
app.post('/orders', (req, res) => {
  const { customerName, items } = req.body;

  if (!customerName || !items) {
    return res.status(400).json({ message: 'Customer name and items are required' });
  }

  const orders = readOrdersFromFile();
  const newOrder = {
    id: orders.length + 1, // Simple ID generation
    customerName,
    items
  };

  orders.push(newOrder); // Add new order to the array
  writeOrdersToFile(orders); // Save updated array to file

  res.status(201).json(newOrder); // Send the newly created order as JSON response
});

// Search orders by customer name
app.get('/orders/search', (req, res) => {
  const { customerName } = req.query; // Get the customerName query parameter
  const orders = readOrdersFromFile();

  if (!customerName) {
    return res.status(400).json({ message: 'Customer name query parameter is required' });
  }

  const matchedOrders = orders.filter(order => order.customerName.toLowerCase().includes(customerName.toLowerCase()));

  if (matchedOrders.length > 0) {
    res.json(matchedOrders); // Send matched orders as JSON response
  } else {
    res.status(404).json({ message: 'No orders found for the given customer name' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
