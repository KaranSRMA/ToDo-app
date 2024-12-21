import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Header = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showFinished, setShowFinished] = useState(false);
  const [editingId, setEditingId] = useState(null);  // Track the task being edited

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const localTasks = localStorage.getItem('tasks');
    if (localTasks) {
      setTasks(JSON.parse(localTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Save task when "Save" button is clicked
  const saveTask = () => {
    if (editingId) {
      // If we're editing a task, update it
      const updatedTasks = tasks.map((item) =>
        item.id === editingId ? { ...item, task } : item
      );
      setTasks(updatedTasks);
      setEditingId(null); // Clear editing state
    } else {
      // If we're adding a new task
      const newTask = { id: uuidv4(), task, isCompleted: false };
      setTasks([...tasks, newTask]);
    }
    setTask(''); // Clear input field
  };

  // Handle task input change
  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };

  // Toggle task completion state
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTasks(updatedTasks);
  };

  // Edit task
  const editTask = (id) => {
    const taskToEdit = tasks.find((item) => item.id === id);
    setTask(taskToEdit.task); // Prepopulate the input with the task text
    setEditingId(id); // Set the id of the task being edited
  };

  // Delete task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((item) => item.id !== id);
    setTasks(updatedTasks);
  };

  // Toggle "Show finished tasks"
  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  // Filter tasks based on completion state
  const filteredTasks = tasks.filter((task) =>
    showFinished ? task.isCompleted : !task.isCompleted
  );

  return (
    <header>
      <h1 className="bg-slate-300 p-4 text-center text-xl font-bold">ToDo App</h1>
      <div className="taskarea bg-violet-400 min-h-96 h-full m-2 p-3 border rounded-md">
        {/* Input field */}
        <input
          onChange={handleTaskChange}
          value={task}
          type="text"
          className="m-8 rounded-sm text-center w-4/6"
          placeholder="Enter your task"
        />
        {/* Save Button - Disabled when input is empty */}
        <button
          onClick={saveTask}
          disabled={task.trim().length === 0} // Disable button when input is empty or has only spaces
          className="px-3 py-1 rounded-3xl bg-blue-500 text-white disabled:cursor-not-allowed hover:bg-slate-400"
        >
          {editingId ? 'Update' : 'Save'} {/* Show 'Update' if editing */}
        </button>
        <div className="flex gap-4 items-center">
          {/* Checkbox for showing finished tasks */}
          <input
            id="showFinished"
            onChange={toggleFinished}
            type="checkbox"
            checked={showFinished}
            className="mx-1 my-2 size-5"
          />
          <label htmlFor="showFinished" className="text-white">Show finished tasks</label>
        </div>
        <hr />
        {/* Render tasks based on whether showFinished is checked */}
        {filteredTasks.map((item) => (


          <div
            key={item.id}
            className="tasks w-full h-auto px-5 mx-auto my-5 flex gap-5 items-center justify-between"
          >
            <div className="task-left flex gap-2 items-center">
              <input
                name={item.id}
                onChange={() => toggleTaskCompletion(item.id)}
                type="checkbox"
                checked={item.isCompleted}
                className="mx-1 size-5"
              />
              <div className={item.isCompleted ? 'line-through' : ''}>{item.task}</div>
            </div>
            <div className="task-right flex gap-4 items-center">
              <button
                onClick={() => editTask(item.id)} // Edit button
                className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-slate-400"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(item.id)} // Delete button
                className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-slate-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;
