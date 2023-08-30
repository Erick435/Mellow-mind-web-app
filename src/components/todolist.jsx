import React, { useState, useRef, useEffect } from 'react';
import { db } from './googleSignin/config';
import { collection, addDoc, doc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { auth } from './googleSignin/config'; // Assuming you export auth from config



function TodoList({ onTaskSelect }) {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const popupRef = useRef(null);
  const inputRef = useRef(null); // Create ref for the input element
  const userId = auth.currentUser?.uid;


  const handleOpenPopup = () => {
    setPopupVisibility(true);
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

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    addTaskToFirestore(newTask, userId); // Pass userId
    setNewTask('');
    handleClosePopup();
  };

  const handleDeleteTask = (id) => {
    if (selectedTask === tasks.findIndex(task => task.id === id)) {
      setSelectedTask(null);
      onTaskSelect(null);
    }
    deleteTaskFromFirestore(id, userId); // Pass userId
  };


  useEffect(() => {
    if (isPopupVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPopupVisible]);


  const addTaskToFirestore = async (task, userId) => {
    try {
      const todosCollection = collection(db, 'users', userId, 'todos');
      await addDoc(todosCollection, { text: task, createdAt: new Date() });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const deleteTaskFromFirestore = async (id, userId) => {
    try {
      const taskDoc = doc(db, 'users', userId, 'todos', id);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };



  // Fetch to-dos from Firestore
  useEffect(() => {
    if (userId) { // Make sure userId is available
      const todosCollection = collection(db, 'users', userId, 'todos');
      const q = query(todosCollection, orderBy("createdAt"));
      const unsubscribe = onSnapshot(q, snapshot => {
        setTasks(snapshot.docs.map(doc => ({ id: doc.id, text: doc.data().text })));
      });
      return () => unsubscribe();
    }
  }, [userId]); // Add userId as a dependency  



  return (
    <div className="todo-list">
      <button className="tasks-button" onClick={handleOpenPopup}>Add Task</button>

      {isPopupVisible && (
        <div className="popup-wrapper">
          <div ref={popupRef} className="popup">
            <h3>Add Task</h3>
            <form onSubmit={handleAddTask}> {/* Wrap in a form with onSubmit */}
              <input
                ref={inputRef} // Assign ref to the input element
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
          <div key={task.id} className="task-row">
            <div
              className={`task-circle ${selectedTask === index ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // Stop the event from propagating up to parent elements
                toggleTaskSelection(index);
              }}>
            </div>

            <div className="task-content" onClick={() => toggleTaskSelection(index)}>
              {task.text}
            </div>
            <div className="task-delete" onClick={() => handleDeleteTask(task.id)}>
              &#x1F5D1; {/* Trash can icon using HTML entity */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;