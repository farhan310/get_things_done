import React from "react";
import ReactDOM from "react-dom";
import Task from "./components/Task";

const App = () => {
  const [tasks, setTasks] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [taskDescription, setTaskDescription] = React.useState("");

  const fetchTasks = async () => {
    const url = `/tasks`;
    const response = await fetch(url);
    const data = await response.json();
    setTasks(data);
  };

  const handleModalClick = (event) => {
    const wasTheClickOutsideTheForm = !event.target.closest("form");
    if (wasTheClickOutsideTheForm) {
      setIsModalOpen(false);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const url = `/tasks`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ description: taskDescription }),
    });
    const newTask = await response.json();
    setTasks([newTask, ...tasks]);
    setTaskDescription("");
    setIsModalOpen(false);
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
          {tasks.map((task) => (
            <Task
              key={task.id}
              id={task.id}
              description={task.description}
              completed={task.completed}
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
              onChange={(event) => setTaskDescription(event.target.value)}
              required
            />
          </div>
          <button type="submit">New Task</button>
        </form>
      </dialog>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
