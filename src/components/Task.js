import React from "react";

const Task = (props) => {
  return (
    <li data-task={props.id}>
      <input type="checkbox" checked={props.completed} />
      <input type="text" value={props.description} />
      <button className="delete-task">&times;</button>
    </li>
  );
};

export default Task;
