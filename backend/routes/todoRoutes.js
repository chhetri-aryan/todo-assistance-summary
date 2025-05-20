const express = require('express');
const router = express.Router();
const {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  summarizeTodos,
  sendToSlack,
} = require('../controllers/todoController');

router.get('/todos', getTodos);
router.post('/todos', addTodo);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);
router.post('/todos/summarize', summarizeTodos);
router.post('/todos/send', sendToSlack);

module.exports = router;
