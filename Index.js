// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require("dotenv").config()

const app = express();
app.use(express.json());
app.use(cors());

mongoose.set('strictQuery',false);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)

// Create a task schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

// Create a task model
const Task = mongoose.model('Task', taskSchema);

// Route to get all tasks
app.get('/user', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving tasks' });
  }
});

// Route to create a new task
app.post('/user', async (req, res) => {
  try {
    const task = new Task(req.body);
    
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
});

// Route to delete a task
app.delete('/user:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// Route to update a task
app.put('/user:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

// Start the server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log('Server listening on port 5000');
});
