const db = require('../utils/firebaseAdmin');

const getTodos = (req, res) => {
  db.ref('todos').once('value', snapshot => {
    const data = snapshot.val() || {};
    res.json(data);
  });
};

const addTodo = (req, res) => {
  const newTodo = req.body;
  const todoRef = db.ref('todos').push();
  todoRef.set(newTodo)
    .then(() => res.status(201).json({ id: todoRef.key, ...newTodo }))
    .catch(err => res.status(500).json({ error: err.message }));
};

const updateTodo = (req, res) => {
  const { id } = req.params;
  const updatedTodo = req.body;

  db.ref(`todos/${id}`).update(updatedTodo)
    .then(() => res.json({ id, ...updatedTodo }))
    .catch(err => res.status(500).json({ error: err.message }));
};

const deleteTodo = (req, res) => {
  const { id } = req.params;

  db.ref(`todos/${id}`).remove()
    .then(() => res.json({ message: 'Todo deleted' }))
    .catch(err => res.status(500).json({ error: err.message }));
};

module.exports = { getTodos, addTodo, updateTodo, deleteTodo };
