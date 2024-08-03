const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); // Middleware to parse JSON request bodies

const filePath = path.join(__dirname, 'products.json');

// Helper function to read products from file
const readProductsFromFile = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Return empty array if there is an error reading the file
  }
};

// Helper function to write products to file
const writeProductsToFile = (products) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
};

// Fetch all products
app.get('/products', (req, res) => {
  const products = readProductsFromFile();
  res.json(products); // Send the array of products as JSON response
});

// Find a product by ID
app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const products = readProductsFromFile();
  const product = products.find(p => p.id === productId);

  if (product) {
    res.json(product); // Send the found product as JSON response
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Add a new product
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  const products = readProductsFromFile();
  const newProduct = {
    id: products.length + 1, // Simple ID generation
    name,
    price
  };

  products.push(newProduct); // Add new product to the array
  writeProductsToFile(products); // Save updated array to file

  res.status(201).json(newProduct); // Send the newly created product as JSON response
});

// Search products by name
app.get('/products/search', (req, res) => {
  const { name } = req.query; // Get the name query parameter
  const products = readProductsFromFile();

  if (!name) {
    return res.status(400).json({ message: 'Name query parameter is required' });
  }

  const matchedProducts = products.filter(product => product.name.toLowerCase().includes(name.toLowerCase()));

  if (matchedProducts.length > 0) {
    res.json(matchedProducts); // Send matched products as JSON response
  } else {
    res.status(404).json({ message: 'No products found with the given name' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
