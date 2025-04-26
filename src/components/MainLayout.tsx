import { Outlet } from 'react-router-dom'
import NavBar from './navbar/NavBar'

export default function MainLayout() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}