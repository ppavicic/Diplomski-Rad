import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginTeacher from "./components/LoginTeacher";
import LoginStudent from "./components/LoginStudent";
import ProfileTeacher from "./components/ProfileTeacher";
import AddTask from "./components/AddTask";
import AddExercise from "./components/AddExercise";
import AddStudent from "./components/AddStudent";
import Exercise from "./components/Exercise";
import TextToSpeechComponent from "./components/TextToSpeechComponent";
import PrivateRoutes from "./components/Private";


function App() {
  return (
    <div className="App" style={{ height: '100vh' }}>
      <Router>
        <Routes>
          <Route path="/" exact element={<LoginStudent />} />
          <Route path="/loginTeacher" element={<LoginTeacher />} />
          <Route path="/profileTeacher" element={<PrivateRoutes> <ProfileTeacher /> </PrivateRoutes>} exact />
          <Route path="/exercise" element={<PrivateRoutes> <Exercise /> </PrivateRoutes>} exact />
          <Route path="/addTask" element={<PrivateRoutes> <AddTask /> </PrivateRoutes>} exact />
          <Route path="/addExercise" element={<PrivateRoutes> <AddExercise /> </PrivateRoutes>} exact />
          <Route path="/addStudent" element={<PrivateRoutes> <AddStudent /> </PrivateRoutes>} exact />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
