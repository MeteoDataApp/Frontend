/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'

function Layout() {
    return (
        <div>
            <LanguageProvider>
                <Navbar />
                <Outlet />
            </LanguageProvider>
        </div>
    )
}

export default Layout