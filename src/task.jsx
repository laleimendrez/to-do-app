import React from "react";
import "./index.css";

const formatDate = (date) => {
  if (!date) return "N/A";
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleString(undefined, options);
};

const Task = ({ taskName, dateCreated, dateDone, dueDate, completed, onComplete, onDelete, onEdit }) => {
  return (
    <div className={`task ${completed ? "completed" : ""}`}>
      <button className={`checkbox-btn ${completed ? "checked" : ""}`} onClick={onComplete}>
        {completed ? "✓" : ""}
      </button>
      <div className="task-details">
        <span className={`task-name ${completed ? "completed" : ""}`}>{taskName}</span>
        <div className="task-dates">
          <span className="date-created">Date Created: {formatDate(dateCreated)}</span>
          <span className="due-date">Due Date: {formatDate(dueDate)}</span>
          {completed && <span className="date-done">Date Done: {formatDate(dateDone)}</span>}
        </div>
      </div>
      {!completed && <button onClick={onEdit} className="edit-btn">Edit</button>}
      <button onClick={onDelete} className={`delete-btn ${completed ? "completed" : ""}`}>Delete</button>
    </div>
  );
};

export default Task;
