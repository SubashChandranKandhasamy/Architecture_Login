import React, { useState, useRef, useEffect } from "react"; // Import useRef and useEffect
import { Canvas } from "@react-three/fiber"; // For rendering 3D models
import { OrbitControls } from "@react-three/drei"; // For interaction with 3D objects
import { validateLogin } from "./login"; // Importing the validateLogin function
import Signup from "./Signup"; // Importing the Signup component
import "./App.css";

// Simple 3D House Model (Walls and Roof)
const House = () => {
  return (
    <group>
      {/* House Base (walls) */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 2, 4]} /> {/* Width, Height, Depth */}
        <meshStandardMaterial color="lightblue" />
      </mesh>

      {/* House Roof */}
      <mesh position={[0, 2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3, 1.5, 4]} /> {/* Radius, Height, Segments */}
        <meshStandardMaterial color="brown" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0, 2.01]}>
        <boxGeometry args={[0.8, 1.2, 0.1]} />
        <meshStandardMaterial color="darkbrown" />
      </mesh>
    </group>
  );
};

// Light shining from the bottom
const BottomLight = () => {
  return (
    <pointLight
      position={[0, -2, 0]} // Position the light below the house
      intensity={1.5}
      distance={10}
      color={"white"}
      castShadow
    />
  );
};

// Component for User Dashboard with Building Tool
const UserDashboard = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth / 2; // Adjust width as needed
    canvas.height = window.innerHeight / 2; // Adjust height as needed
    contextRef.current = canvas.getContext("2d");
    contextRef.current.lineWidth = 2;
    contextRef.current.strokeStyle = "black";
    contextRef.current.lineCap = "round";
  };

  const startDrawing = (e) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    canvasRef.current.addEventListener("mousemove", draw);
  };

  const draw = (e) => {
    contextRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    canvasRef.current.removeEventListener("mousemove", draw);
  };

  const clearCanvas = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveDrawing = () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  useEffect(() => {
    setupCanvas();
  }, []);

  return (
    <div className="dashboard">
      <h2>User Dashboard</h2>
      <div className="section">
        <h3>Upload Map</h3>
        <input type="file" className="file-input" />
      </div>
      <div className="section">
        <h3>Building Tool</h3>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ border: "1px solid black" }}
        />
        <div>
          <button className="primary-btn" onClick={clearCanvas}>Clear</button>
          <button className="primary-btn" onClick={saveDrawing}>Save</button>
        </div>
      </div>
      <div className="section">
        <h3>Contact Architect</h3>
        <button className="primary-btn">Contact an Architect</button>
      </div>
    </div>
  );
};

// Component for Architect Dashboard
const ArchitectDashboard = () => {
  return (
    <div className="dashboard">
      <h2>Architect Dashboard</h2>
      <div className="section">
        <h3>User Requests</h3>
        <p className="placeholder">No new requests at the moment.</p>
      </div>
      <div className="section">
        <h3>Contact User</h3>
        <button className="primary-btn">Contact a User</button>
      </div>
    </div>
  );
};

// Main Login Component
const LoginSignup = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // user or architect
  const [userDetails, setUserDetails] = useState({
    role: "user",
    email: "",
    password: "",
  });
  const [showSignup, setShowSignup] = useState(false); // New state for signup toggle

  // Handle form submission (mock login)
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationResult = validateLogin(userDetails.email, userDetails.password, userDetails.role);

    if (validationResult.success) {
      setIsLoggedIn(true);
      setUserRole(userDetails.role);
    } else {
      alert(validationResult.message); // Show validation error
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  if (isLoggedIn) {
    return userRole === "user" ? <UserDashboard /> : <ArchitectDashboard />;
  }

  return (
    <div className="login-box">
      {showSignup ? (
        <Signup /> // Show the Signup component
      ) : (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Role:</label>
              <select
                name="role"
                value={userDetails.role}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="user">User</option>
                <option value="architect">Architect</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleInputChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={userDetails.password}
                onChange={handleInputChange}
                required
                className="form-control"
              />
            </div>

            <button type="submit" className="primary-btn">Login</button>
          </form>
          <button className="secondary-btn" onClick={toggleSignup}>
            Signup
          </button>
        </>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="App">
      <div className="container">
        {/* Left Side - 3D House Interaction */}
        <div className="left-side">
          <Canvas shadows>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <OrbitControls enableZoom={true} />
            <House />
            <BottomLight /> {/* Add the bottom light here */}
          </Canvas>
        </div>

        {/* Right Side - Login/Signup Box */}
        <div className="right-side">
          <LoginSignup />
        </div>
      </div>
    </div>
  );
};

export default App;
