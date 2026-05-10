const db = require('../utils/firebaseAdmin');
const axios = require('axios');
const Groq = require('groq-sdk');

const getTodos = async (req, res) => {
  try {
    const snapshot = await db.ref('todos').once('value');
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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


const summarizeTodos = async (req, res) => {
  const { todos } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!todos || !todos.length) {
    return res.status(400).json({ error: 'Missing todos' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured on server' });
  }

  try {
    const groq = new Groq({ apiKey });

    const content = todos.map((t, i) => `${i + 1}. title: ${t.title} . description: ${t.description}`).join('\n');

    const completion = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes todo items.',
        },
        {
          role: 'user',
          content: `Summarize the following todos:\n${content}`,
        },
      ],
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content;
    res.json({ summary });
  } catch (err) {
    console.error('Groq API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to summarize todos' });
  }
};


const sendToSlack = async (req, res) => {
  const { summary } = req.body;
  const slackWebhook = process.env.SLACK_WEBHOOK_URL;

  if (!summary) {
    return res.status(400).json({ error: 'Missing summary' });
  }

  if (!slackWebhook) {
    return res.status(500).json({ error: 'Slack webhook not configured on server' });
  }

  try {
    await axios.post(slackWebhook, {
      text: summary,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Slack Error:', err.message);
    res.status(500).json({ error: 'Failed to send to Slack' });
  }
};

module.exports = { getTodos, addTodo, updateTodo, deleteTodo, summarizeTodos, sendToSlack };
