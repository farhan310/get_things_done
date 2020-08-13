const express = require('express');

const app = express();
app.use(express.json());

let id = 0;

const tasks = [];

// Get the user a list of all the tasks
app.get('/tasks', (_request, response) => {
  response.json(tasks);
});

// Create a new task
app.post('/tasks', (request, response) => {
  const { description } = request.body;
  if (!description) {
    response.status(406).json({ error: 'description required' });
  } else {
    id += 1;
    const newTask = {
      id, // same as id: id
      description, // same as description: description
      completed: false,
    };
    tasks.unshift(newTask);
    response.json(newTask);
  }
});

// Update something about a specific task
app.patch('/tasks/:id', (request, response) => {
  const taskId = Number(request.params.id);
  const taskToUpdate = tasks.find(task => task.id === taskId);
  if (!taskToUpdate) {
    response.status(404).json({ error: 'task ID not found' });
  } else {
    Object.assign(taskToUpdate, request.body);
    response.json(taskToUpdate);
  }
});

// Delete a specific task
app.delete('/tasks/:id', (request, response) => {
  const taskId = Number(request.params.id);
  const indexOfTaskToRemove = tasks.findIndex(task => task.id === taskId);
  const taskToRemove = tasks[indexOfTaskToRemove];
  if (!taskToRemove) {
    response.status(404).json({ error: 'no such task' });
  } else {
    tasks.splice(indexOfTaskToRemove, 1);
    response.json(taskToRemove);
  }
});

app.listen(3000, () => console.log('Server is up and running at port 3000 🚀'));
