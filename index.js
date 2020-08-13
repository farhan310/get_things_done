const PORT = process.env.PORT || 3000;

const express = require('express');
const pg = require('pg');

const app = express();
const db = new pg.Pool();

db.query(`
  CREATE TABLE IF NOT EXISTS tasks(
    id SERIAL PRIMARY KEY,
    description VARCHAR(128) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE
  );    
`);

app.use(express.json());
app.use(express.static('public'));

// Get the user a list of all the tasks
app.get('/tasks', async (_request, response) => {
  const result = await db.query(`SELECT * FROM tasks ORDER BY id DESC;`);
  response.json(result.rows);
});

// Create a new task
app.post('/tasks', async (request, response) => {
  // same as const description = request.body.description
  const { description } = request.body; // "Buy milk", for example
  if (!description) {
    response.status(406).json({ error: 'description required' });
  } else {
    const result = await db.query(
      `INSERT INTO tasks (description) VALUES ($1) RETURNING *;`,
      [description]
    );
    response.json(result.rows[0]);
  }
});

// Update something about a specific task
app.patch('/tasks/:id', async (request, response) => {
  const taskId = Number(request.params.id);
  const [column, value] = Object.entries(request.body)[0];
  const approvedColumns = ['description', 'completed'];
  if (!approvedColumns.includes(column)) {
    return response.status(406).json({ error: 'DO NOT HACK US' });
  }
  const result = await db.query(
    `UPDATE tasks SET ${column} = $1 WHERE id = $2 RETURNING *;`,
    [value, taskId]
  );
  if (result.rows.length > 0) {
    response.json(result.rows[0]);
  } else {
    response.status(404).json({ error: 'no such task' });
  }
});

// Delete a specific task
app.delete('/tasks/:id', async (request, response) => {
  const taskId = Number(request.params.id);
  const result = await db.query(
    `DELETE FROM tasks WHERE id = $1 RETURNING *;`,
    [taskId]
  );
  if (result.rows.length > 0) {
    response.json(result.rows[0]);
  } else {
    response.status(404).json({ error: 'no such task' });
  }
});

app.listen(PORT, () =>
  console.log(`Server is up and running at port ${PORT} 🚀`)
);
