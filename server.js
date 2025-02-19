const express = require('express');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const Todo = require('./src/models/todo');

mongoose.connect("mongodb+srv://dbUser:dbUser1234@clustere50.6x3jq.mongodb.net/?retryWrites=true&w=majority&appName=ClusterE50") 
.then(()=>{
  console.log("connected to database")
})
.catch((err)=>{
  console.log("DB Connection error")
})

app.use(express.json());

app.post('/todos', async (req, res) => {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
  
    try {
      const newTodo = new Todo({
        text: text,
        completed: false,
      });
  
      await newTodo.save();
      res.status(201).json(newTodo);
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: 'Error saving to-do', error: err });
    }
  });
  
  app.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.status(200).json(todos);
    } catch (err) {
        console.log(err)

      res.status(500).json({ message: 'Error fetching to-dos', error: err });
    }
  });
  
  app.get('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: 'To-do not found' });
      }
      res.status(200).json(todo);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching to-do', error: err });
    }
  });
  
  app.put('/todos/:id', async (req, res) => {
    const { text, completed } = req.body;
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: 'To-do not found' });
      }
  
      todo.text = text !== undefined ? text : todo.text;
      todo.completed = completed !== undefined ? completed : todo.completed;
  
      await todo.save();
      res.status(200).json(todo);
    } catch (err) {
      res.status(500).json({ message: 'Error updating to-do', error: err });
    }
  });
  
  app.delete('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: 'To-do not found' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: 'Error deleting to-do', error: err });
    }
  });
  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
