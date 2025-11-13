import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../app/features/authSlice.js";

const Navbar = () => {
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const LogoutUser = () => {
        navigate('/')
        dispatch(logout(navigate))
    }

    return (
        <div className='shadow bg-white'>
            <nav className='flex items-center justify-between ax-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all sticky top-0 z-50'>
                <Link to="/">
                    <img src='/logo.svg' alt="logo" className="w-auto h-11" />
                </Link>

                <div className='flex items-center gap-4 text-sm'>
                    <p className='max-sm:hidden'>Hi, {user?.name}</p>
                    <button
                        onClick={LogoutUser}
                        className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    )
}
export default Navbar
