import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashBoard } from "./pages/DashBoard";

export default function App() {
    return (
        <>

            <Routes>

                <Route path="/" element={<Homepage />} />

                <Route path="/login" element={<Login />} />

                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<DashBoard />} />

            </Routes>

        
        </>
    );
}