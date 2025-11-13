import React, {useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/Home.jsx";
import Layout from "./pages/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import Preview from "./pages/Preview.jsx";
import { useDispatch } from 'react-redux'
import api from "./configs/api.js";
import {login, setLoading} from "./app/features/authSlice.js";
import { Toaster } from 'react-hot-toast';

const App = () => {
    const dispatch = useDispatch()

    const getUserData = async () => {
        const token = localStorage.getItem('token')
        try {
            if (token) {
                const { data } = await api.get('/api/users/data', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if(data.user) {
                    dispatch(login({
                        user: data.user
                    }))
                }
                dispatch(setLoading(false))
            } else {
                dispatch(setLoading(false))
            }
        } catch (error) {
            dispatch(setLoading(false))
            console.log(error.message)
        }
    }

    useEffect(() => {
        getUserData().then(r => r.json())
    },[])
    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path='app' element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path='builder/:resumeId' element={<ResumeBuilder />} />
                </Route>

                <Route path="view/:resumeId" element={<Preview />} />

            </Routes>
        </>
    )
}
export default App
