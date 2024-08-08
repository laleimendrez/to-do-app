import React, { useState, useEffect } from "react";
import "./App.css";
import Task from "./task";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";

function App() {
  const [taskName, setTaskName] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskType, setTaskType] = useState(null);
  const [deleteAllType, setDeleteAllType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTaskName, setEditingTaskName] = useState("");
  const [editingTaskDueDate, setEditingTaskDueDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [showDueDateModal, setShowDueDateModal] = useState(false);

  useState(() => {
    const storedTaskList = localStorage.getItem("tasks");
    const storedCompletedTasks = localStorage.getItem("completedTasks");
    if (storedTaskList) {
      setTaskList(JSON.parse(storedTaskList));
    }
    if (storedCompletedTasks) {
      setCompletedTasks(JSON.parse(storedCompletedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [taskList, completedTasks]);

  const addTask = () => {
    if (!taskName.trim()) {
      alert("Task name cannot be empty!");
      return;
    }
    const currentDate = new Date().toLocaleString();
    if (editingTaskIndex !== null) {
      const updatedTasks = [...taskList];
      updatedTasks[editingTaskIndex].task = taskName;
      updatedTasks[editingTaskIndex].dueDate = editingTaskDueDate;
      setTaskList(updatedTasks);
      setEditingTaskIndex(null);
    } else {
      setTaskList([...taskList, { task: taskName, completed: false, dateCreated: currentDate, dueDate: null }]);
    }
    setTaskName("");
    setShowDueDateModal(true);
  };

  const completeTask = (index) => {
    const newTaskList = [...taskList];
    const completedTask = newTaskList.splice(index, 1)[0];
    completedTask.completed = true;
    completedTask.dateDone = new Date().toLocaleString();
    setTaskList(newTaskList);
    setCompletedTasks([...completedTasks, completedTask]);
  };

  const completeAllTasks = () => {
    const newCompletedTasks = taskList.map(task => ({ ...task, completed: true, dateDone: new Date().toLocaleString() }));
    setCompletedTasks([...completedTasks, ...newCompletedTasks]);
    setTaskList([]);
  };

  const undoneTask = (index) => {
    const newCompletedTasks = [...completedTasks];
    const taskToUndone = newCompletedTasks.splice(index, 1)[0];
    taskToUndone.completed = false;
    taskToUndone.dateDone = null;
    setCompletedTasks(newCompletedTasks);
    setTaskList([...taskList, taskToUndone]);
  };

  const undoneAllTasks = () => {
    const newTaskList = completedTasks.map(task => ({ ...task, completed: false, dateDone: null }));
    setTaskList([...taskList, ...newTaskList]);
    setCompletedTasks([]);
  };

  const deleteTask = (index, type) => {
    setTaskType(type);
    setTaskToDelete(index);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (taskType === "active") {
      const newTaskList = [...taskList];
      newTaskList.splice(taskToDelete, 1);
      setTaskList(newTaskList);
    } else {
      const newCompletedTasks = [...completedTasks];
      newCompletedTasks.splice(taskToDelete, 1);
      setCompletedTasks(newCompletedTasks);
    }
    setModalOpen(false);
    setTaskToDelete(null);
    setTaskType(null);
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setTaskToDelete(null);
    setTaskType(null);
  };

  const deleteAllTasks = () => {
    if (deleteAllType === "active") {
      setTaskList([]);
    } else {
      setCompletedTasks([]);
    }
    setModalOpen(false);
    setDeleteAllType(null);
  };

  const openDeleteAllModal = (type) => {
    setDeleteAllType(type);
    setModalOpen(true);
  };

  const editTask = (index) => {
    setEditingTaskName(taskList[index].task);
    setEditingTaskDueDate(taskList[index].dueDate);
    setEditingTaskIndex(index);
    setModalOpen(true);
  };

  const filteredTasks = taskList.filter(task =>
    task.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompletedTasks = completedTasks.filter(task =>
    task.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEdit = () => {
    if (!editingTaskName.trim()) {
      alert("Task name cannot be empty!");
      return;
    }
    const updatedTasks = [...taskList];
    updatedTasks[editingTaskIndex].task = editingTaskName;
    updatedTasks[editingTaskIndex].dueDate = editingTaskDueDate;
    setTaskList(updatedTasks);
    setEditingTaskIndex(null);
    setModalOpen(false);
  };

  const handleSaveDueDate = () => {
    const updatedTasks = [...taskList];
    updatedTasks[updatedTasks.length - 1].dueDate = dueDate;
    setTaskList(updatedTasks);
    setShowDueDateModal(false);
  };

  const handleDateTimeBlur = (e) => {
    if (e.target.value) {
      alert("Please use the date picker to select a date.");
      e.target.value = ""; 
    }
  };

  return (
    <div className="App">
      <div>
        <img src="/images/add.png" alt="Add" />
        <img className="search" src="/images/search.png" alt="Search" />
        <img className="logo" src="/images/logo.png" alt="Logo" />
        <img className="lexmeet" src="/images/lexmeet.png" alt="Lexmeet" />
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="header-columns">
        <h1>MY TASKS</h1>
        <h2>COMPLETED TASKS</h2>
      </div>
      <input
        type="text"
        id="task"
        placeholder="Add Task Here"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button
        className="add-button"
        onClick={addTask}>Save</button>
      <div className="task-container">
        <div className="task-list">
          <div className="task-list-header">
            <button 
              onClick={completeAllTasks}>Done All</button>
            <button 
              onClick={() => openDeleteAllModal("active")}>Delete All</button>
          </div>
          {filteredTasks.map((task, index) => (
            <Task
              key={index}
              taskName={task.task}
              dateCreated={task.dateCreated}
              dueDate={task.dueDate}
              onComplete={() => completeTask(index)}
              onDelete={() => deleteTask(index, "active")}
              onEdit={() => editTask(index)}
            />
          ))}
        </div>
        <div className="completed-task-list">
          <div className="task-list-header">
            <button className="undone-all" onClick={undoneAllTasks}>Undone All</button>
            <button className="delete-all" onClick={() => openDeleteAllModal("completed")}>Delete All</button>
          </div>
          {filteredCompletedTasks.map((task, index) => (
            <Task
              key={index}
              taskName={task.task}
              dateCreated={task.dateCreated}
              dateDone={task.dateDone}
              dueDate={task.dueDate}
              completed
              onComplete={() => undoneTask(index)}
              onDelete={() => deleteTask(index, "completed")}
            />
          ))}
        </div>
      </div>

      {/* Modal for Confirmation */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {taskToDelete !== null ? (
              <div className="modal-content-delete">
                <h4>Confirm Delete</h4>
                <p>Are you sure you want to delete this task?</p>
                <button onClick={confirmDelete}>Yes</button>
                <button onClick={cancelDelete}>No</button>
              </div>
            ) : (
              editingTaskIndex !== null ? (
                <>
                  <h3>Edit Task</h3>
                  <div className="modal-edit-content">
                    <input
                      type="text"
                      value={editingTaskName}
                      onChange={(e) => setEditingTaskName(e.target.value)}
                    />
                    <label>Due Date</label>
                    <DateTime
                      value={editingTaskDueDate}
                      onChange={(date) => setEditingTaskDueDate(date)}
                      inputProps={{ readOnly: true }} 
                      onBlur={handleDateTimeBlur}    
                    />
                  </div>
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={() => {
                    setModalOpen(false);
                    setEditingTaskIndex(null);
                  }}>Cancel</button>
                </>
              ) : (
                <div className="modal-content-delete-all">
                  <h4>Confirm Delete All</h4>
                  <p>Are you sure you want to delete all {deleteAllType} tasks?</p>
                  <button onClick={deleteAllTasks}>Yes</button>
                  <button onClick={cancelDelete}>No</button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Modal for Due Date Selection */}
      {showDueDateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Due Date</h3>
            <DateTime
              value={dueDate}
              onChange={(date) => setDueDate(date)}
              inputProps={{ readOnly: true }}  
              onBlur={handleDateTimeBlur}   
            />
            <button onClick={handleSaveDueDate}>Save</button>
            <button onClick={() => setShowDueDateModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
