import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import LoginTeacher from "./components/LoginTeacher";
import LoginStudent from "./components/LoginStudent";
import ProfileTeacher from "./components/ProfileTeacher";
import Exercise from "./components/Exercise";
import TextToSpeechComponent from "./components/TextToSpeechComponent";
import PrivateRoutes from "./components/Private";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<LoginStudent />} />
          <Route path="/loginTeacher" element={<LoginTeacher />} />
          <Route path="/profileTeacher" element={<PrivateRoutes> <ProfileTeacher /> </PrivateRoutes>} exact/>
          <Route path="/exercise" element={<PrivateRoutes> <Exercise /> </PrivateRoutes>} exact/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
