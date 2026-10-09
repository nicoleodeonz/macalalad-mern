import { useEffect, useState} from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [age, setAge] = useState('');
  const [editId, setEditId] = useState(null);

  //read students from the database
  const getStudents = () => {
    axios
      .get('http://localhost:5000/students')
      .then(response => {
        setStudents(response.data);
      });
  };
  useEffect(() => {
    getStudents();
  }, []);

  //add student to the database
  const addStudent = () => {
    axios 
      .post('http://localhost:5000/students', {
        name: name,
        course: course,
        age: Number(age)
    })
    .then(() => {
      setName("");
      setCourse("");
      setAge("");

      getStudents();
    })
    .catch((error) => {
      console.error("Error adding student:", error);
    });
  };

  //delete student from the database
  const deleteStudent = (id) => {
    axios
      .delete(`http://localhost:5000/students/${id}`)    
      .then(() => {
        getStudents();
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
      });
  };

  //edit student on the database
  const editStudent = (student) => {
    setEditId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  };

  //update student on the database
  const updateStudent = () => {
    axios
      .put(`http://localhost:5000/students/${editId}`, {
        name: name,   
        course: course,
        age: Number(age)
      })
      .then(() => {
        setEditId(null);
        setName("");
        setCourse("");
        setAge("");
        
        getStudents();
      })
      .catch((error) => {
        console.error("Error updating student:", error);
      });
  } 

  return (
    <>
      <div>
        <h1>Student Management System</h1>
        <h2>Add Student</h2>

        <input 
          placeholder='Name' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        
        <br/><br/>

        <input 
          placeholder='Course' 
          value={course} 
          onChange={(e) => setCourse(e.target.value)} 
        />
        
        <br/><br/>

        <input 
          placeholder='Age' 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
        />
        
        <br/><br/>

        {editId !== null ? (
          <button onClick={updateStudent}>Update Student</button>
        ) : (
          <button onClick={addStudent}>Add Student</button>
        )}

        <h2>Students</h2>
        {students.map((student) => (
          <div key={student._id}>
            <p>Name: {student.name}</p>
            <p>Course: {student.course}</p>
            <p>Age: {student.age}</p>
            <button onClick={() => editStudent(student)}>Edit</button>  
            <button onClick={() => deleteStudent(student._id)}>Delete</button>
          </div>
        ))}
        
      </div>
    </>
  )
}

export default App
