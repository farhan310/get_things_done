import React from 'react';

const Task = props => (
  <li>
    <input
      type="checkbox"
      checked={props.completed}
      onChange={props.handleCheckboxClick}
      updatedTask={props.handleDescriptionChange}
    />
    <input type="text" value={props.description} />
    <button className="delete-task" onClick={props.handleDeleteClick}>
      &times;
    </button>
  </li>
);

export default Task;
