const express = require('express');
const router = express.Router();
const {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');

router.get('/todos', getTodos);
router.post('/todos', addTodo);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);

module.exports = router;
