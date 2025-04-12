const express = require('express');
const cors = require('cors');
const { adminDb } = require('./firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/skills', require('./routes/skills'));

// Example Firestore Query
app.get('/todos', async (req, res) => {
  try {
    const todosCol = adminDb.collection('todos');
    const snapshot = await todosCol.get();
    const todos = snapshot.docs.map(doc => doc.data());
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).send('Error fetching todos');
  }
});

// Auth State Listener (Client-Side)
// Note: This should be in your frontend code, not backend!
// onAuthStateChanged is a client-side Firebase Auth method.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});