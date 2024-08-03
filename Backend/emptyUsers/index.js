const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

const filePath = path.join(__dirname, 'users.json');

// Helper function to read users from file
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Return empty array if there is an error reading the file
  }
};

// Helper function to write users to file
const writeUsersToFile = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
};

// Fetch all users
app.get('/users', (req, res) => {
  const users = readUsersFromFile();
  res.json(users); // Send the array of users as JSON response
});

// Find a user by ID
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const users = readUsersFromFile();
  const user = users.find(u => u.id === userId);

  if (user) {
    res.json(user); // Send the found user as JSON response
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Add a new user
app.post('/users', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const users = readUsersFromFile();
  const newUser = {
    id: users.length + 1, // Simple ID generation
    username,
    password
  };

  users.push(newUser); // Add new user to the array
  writeUsersToFile(users); // Save updated array to file

  res.status(201).json(newUser); // Send the newly created user as JSON response
});

// Process users (example endpoint to demonstrate processing)
app.get('/process-users', (req, res) => {
  const users = readUsersFromFile();
  const processedUsers = users.map(user => ({
    ...user,
    usernameUppercase: user.username.toUpperCase() // Example processing: add uppercase username
  }));

  res.json(processedUsers); // Send processed array as JSON response
});

// Fetch users by username
app.get('/users/search', (req, res) => {
  const { username } = req.query; // Get the username query parameter
  const users = readUsersFromFile();

  if (!username) {
    return res.status(400).json({ message: 'Username query parameter is required' });
  }

  const matchedUsers = users.filter(user => user.username.toLowerCase() === username.toLowerCase());

  if (matchedUsers.length > 0) {
    res.json(matchedUsers); // Send matched users as JSON response
  } else {
    res.status(404).json({ message: 'No users found with the given username' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
