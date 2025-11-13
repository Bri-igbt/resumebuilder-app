import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.jsx";
import { useSelector } from 'react-redux'
import Login from "./Login.jsx";
import Loader from "../components/Loader.jsx";

const Layout = () => {
    const { user, loading } = useSelector(state => state.auth)
    if (loading) {
        return <Loader />
    }

    return (
        <div className=' '>
            {user ? (
                <div className='min-h-screen bg-gray-50'>
                    <Navbar />
                    <Outlet />
                </div>
            ) : (
                <Login />
            )}

        </div>
    )
}
export default Layout
