const db = require('../utils/firebaseAdmin');
const axios = require('axios');
const Groq = require('groq-sdk');

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


const summarizeTodos = async (req, res) => {
  const { todos, apiKey } = req.body;

  console.log('Received todos:', todos);
  console.log('Received API key:', apiKey);

  if (!todos || !apiKey) {
    return res.status(400).json({ error: 'Missing todos or API key' });
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
    console.log('Summary:', summary);
    res.json({ summary });
  } catch (err) {
    console.error('Groq API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to summarize todos' });
  }
};



const sendToSlack = async (req, res) => {
  const { summary, slackWebhook } = req.body;

  if (!summary || !slackWebhook) {
    return res.status(400).json({ error: 'Missing summary or Slack webhook' });
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
