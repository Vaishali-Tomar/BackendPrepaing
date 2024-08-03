const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json()); // Middleware to parse JSON request bodies

const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users from file
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Return empty array if there is an error reading the file
  }
};

// Helper function to write users to file
const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};

// Initialize the users file with some sample data
const initializeUsersFile = () => {
  if (!fs.existsSync(usersFilePath)) {
    const initialUsers = [
      { id: 1, username: "john_doe", password: "password123" },
      { id: 2, username: "jane_smith", password: "mypassword" }
    ];
    writeUsersToFile(initialUsers);
  }
};

initializeUsersFile();

// Signup route
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const users = readUsersFromFile();
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    password
  };

  users.push(newUser); // Add new user to the array
  writeUsersToFile(users); // Save updated array to file

  res.status(201).json({ message: 'User registered successfully' });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const users = readUsersFromFile();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(400).json({ message: 'Invalid username or password' });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  // Since we are not maintaining any session, just send a success message
  res.json({ message: 'Logout successful' });
});

// Delete user route
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  let users = readUsersFromFile();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1); // Remove user from the array
    writeUsersToFile(users); // Save updated array to file
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
