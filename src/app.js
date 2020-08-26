import React from "react";
import ReactDOM from "react-dom";
import Task from "./components/Task";

const App = () => {
  const [tasks, setTasks] = React.useState([]);

  const fetchTasks = async () => {
    const url = `/tasks`;
    const response = await fetch(url);
    const data = await response.json();
    setTasks(data);
  };

  React.useEffect(() => {
    fetchTasks();
  }, []);

  return (
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
      <button id="show-form">+</button>
    </main>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
