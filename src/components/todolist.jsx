import React, { useState, useRef, useEffect } from 'react';

function TodoList({ onTaskSelect }) {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const popupRef = useRef(null);

  const handleOpenPopup = () => {
    setPopupVisibility(true);
  };

  const handleAddTask = (e) => {
    e.preventDefault(); // Prevent the default submit behavior
    if (newTask.trim() === '') return; // Prevent adding empty tasks
    setTasks([...tasks, newTask]);
    setNewTask('');
    handleClosePopup(); // Optionally, you can close the popup after adding a task
  };

  const handleClosePopup = () => {
    setPopupVisibility(false);
    setNewTask(''); // Reset the input field when closing the popup
  };

  const handleOutsideClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      handleClosePopup(); // Call the handleClosePopup function
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


  const [selectedTask, setSelectedTask] = useState(null);

  const toggleTaskSelection = (index) => {
    if (selectedTask === index) {
      setSelectedTask(null);
      onTaskSelect(null); // Notify the parent component
    } else {
      setSelectedTask(index);
      onTaskSelect(tasks[index]); // Notify the parent component
    }
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };
  

  return (
    <div className="todo-list">
      <button className="tasks-button" onClick={handleOpenPopup}>Add Task</button>
  
      {isPopupVisible && (
        <div className="popup-wrapper">
          <div ref={popupRef} className="popup">
            <h3>Add Task</h3>
            <form onSubmit={handleAddTask}> {/* Wrap in a form with onSubmit */}
              <input
                className="task-input"
                type="text"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
              />
              <div className="popup-buttons">
                <button className="add-button" type="submit">Add</button> {/* Add type="submit" */}
                <button className="cancel-button" onClick={handleClosePopup} type="button">Close</button> {/* Add type="button" */}
              </div>
            </form>
          </div>
        </div>
      )}
  
    <div className="tasks-border">
        <div className="border-title">
        <h3>Tasks</h3>
        </div>
        {tasks.map((task, index) => (
        <div key={index} className="task-row">
            <div className="task-content-wrapper">
            <div
                className={`task-circle ${selectedTask === index ? 'selected' : ''}`}
                onClick={() => toggleTaskSelection(index)}
            ></div>
            <div className="task-content">{task}</div>
            </div>
            <div className="task-delete" onClick={() => handleDeleteTask(index)}>
            &#x1F5D1; {/* Trash can icon using HTML entity */}
            </div>
        </div>
        ))}
    </div>
    </div>
  );
  
}


export default TodoList;