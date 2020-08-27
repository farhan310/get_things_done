import React from 'react';
import ReactDOM from 'react-dom';
import Task from './components/Task';

const App = () => {
  const [tasks, setTasks] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [taskDescription, setTaskDescription] = React.useState('');

  const fetchTasks = async () => {
    const url = `/tasks`;
    const response = await fetch(url);
    const data = await response.json();
    setTasks(data);
  };

  const handleModalClick = event => {
    const wasTheClickOutsideTheForm = !event.target.closest('form');
    if (wasTheClickOutsideTheForm) {
      setIsModalOpen(false);
    }
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
    const url = `/tasks`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ description: taskDescription }),
    });
    const newTask = await response.json();
    setTasks([newTask, ...tasks]);
    setTaskDescription('');
    setIsModalOpen(false);
  };

  const handleDeleteClick = async taskId => {
    const didConfirm = window.confirm('Are you sure?');
    if (didConfirm) {
      const url = `/tasks/${taskId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    }
  };

  const handleCheckboxClick = async (taskId, isCompleted) => {
    const url = `/tasks/${taskId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ completed: !isCompleted }),
    });
    const updatedTask = await response.json();
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleDescriptionChange = async (taskId, isDescriptionChanged) => {
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ description: isDescriptionChanged }),
    });
    const updatedTask = await response.json();
    setTasks([updatedTask, ...tasks]);
    setTaskDescription('');
  };

  React.useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <main>
        <section id="controls">
          <div>
            <label htmlFor="status">Status</label>
            <select id="status">
              <option>All</option>
              <option>Completed</option>
              <option>Incomplete</option>
            </select>
          </div>
          <div>
            <label htmlFor="search">Search</label>
            <input id="search" type="text" autoComplete="off" />
          </div>
        </section>
        <ul id="tasks-list">
          {tasks.map(task => (
            <Task
              key={task.id}
              id={task.id}
              description={task.description}
              completed={task.completed}
              handleDeleteClick={() => handleDeleteClick(task.id)}
              handleDescriptionChange={() => handleDescriptionChange(task.id)}
              handleCheckboxClick={() =>
                handleCheckboxClick(task.id, task.completed)
              }
            />
          ))}
        </ul>
        <button id="show-form" onClick={() => setIsModalOpen(true)}>
          +
        </button>
      </main>
      <dialog open={isModalOpen} onClick={handleModalClick}>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              autoComplete="off"
              value={taskDescription}
              onChange={event => setTaskDescription(event.target.value)}
              required
            />
          </div>
          <button type="submit">New Task</button>
        </form>
      </dialog>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
