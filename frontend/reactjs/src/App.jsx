// import Banner from "./components/Banner";
import LenisScroll from "./components/lenis-scroll.jsx";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import Preview from './pages/Preview'
import Profile from './pages/Profile';
import {Login} from "./pages/Login";
import { useDispatch } from "react-redux";
import api from "./config/api.js";
import { login, setLoading } from "./app/features/authSlice.js";
import { useEffect } from "react";
import {Toaster} from 'react-hot-toast'
import Footer from "./components/home/Footer.jsx";

export default function App() {

    const dispatch = useDispatch()
    
    const getUserData = async()=>{

        const token = localStorage.getItem('token')

        try {
            if(token){
                const {data} = await api.get('/api/users/data' , {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                })    
                
                dispatch(login({
                    token,
                    user: data
                }));
                dispatch(setLoading(false))
            }else{
                dispatch(setLoading(false))
            }

        } catch (error) {
            dispatch(setLoading(false))
            console.log(error.message)
        }
    }


    useEffect(()=>{
        getUserData()
    } , [])

    return (
        <>

            <LenisScroll />
            <Toaster/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<Footer />} />
                <Route path="app" element={<Layout/>}>
                    <Route index element={<Dashboard/>} />
                    <Route path="builder/:resumeId" element={ <ResumeBuilder/>}/>
                    <Route path="profile" element={<Profile />} />
                </Route>

                <Route path="view/:resumeId" element={ <Preview/> }/>
             
            </Routes>
        </>
    );
}