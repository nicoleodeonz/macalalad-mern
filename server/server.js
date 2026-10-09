const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/Student");


require("dotenv").config();

app.use(cors());

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI) 
    .then(() =>  {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

app.get("/", (req, res) =>{
    res.send("Server is running!");
});

// read students from the database
app.get("/students", async (req, res) => {
    const students = await Student.find();
    
    res.json(students);
});

//   create student to the database
app.post("/students", async (req, res) => {
    try {
        const {name, course, age} = req.body;
        
        const student = new Student({
            name,
            course,
            age
        });
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//edit student from the database
app.put("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    });

//delete student from the database
app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        res.json(student);
    } catch(error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

