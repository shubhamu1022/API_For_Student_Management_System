const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to the database
const database = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  try {
    mongoose.connect('mongodb+srv://Shubham:aLm8sk8C6g2l8hsB@cluster0.ejryuj8.mongodb.net/cluster0', connectionParams);
    console.log("Connection Successful");
  } catch (error) {
    console.log(error);
    console.log("Connection Failed");
  }
}

database();

// Create a schema for the student model
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String, 
  rollNo: {
    type: String,
    unique: true // make roll no unique
  }
});

// Create a model for the student collection
const Student = mongoose.model('Student', studentSchema);

// Add middleware for parsing JSON body
app.use(express.json());

// Define routes for the API
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error('Error getting students', err);
    res.status(500).json({ error: 'Error getting students' });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    if(req.query.rollno){
      const student = await Student.findOne({ rollno: req.query.rollno });
      if (student) {
        res.json(student);
      } else {
        res.status(404).json({ error: 'Student not found' });
      }
    }else{
      const students = await Student.find();
      res.json(students);
    }
  } catch (err) {
    console.error('Error getting students', err);
    res.status(500).json({ error: 'Error getting students' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    const result = await student.save();
    res.json(result);
  } catch (err) {
    console.error('Error creating student', err);
    res.status(500).json({ error: 'Error creating student' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    console.error('Error updating student', err);
    res.status(500).json({ error: 'Error updating student' });
  }
});

app.delete('/api/students/:rollNo', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ rollNo: req.params.rollNo });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    console.error('Error deleting student', err);
    res.status(500).json({ error: 'Error deleting student' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
