import { useEffect, useState } from "react";
import { User } from "../../utils/types";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser } from "../../utils/api";
import styles from './NavBar.module.css';
import { Link } from "react-router-dom";
import stockLogo from '../../assets/stockapp-logo.jpg';
import LoadingSpinner from "../loading-spinner/LoadingSpinner";

export default function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [activePage, setActivePage] = useState<string>("");
    const location = useLocation();
    const navigate = useNavigate();

    async function loadUser() {
        const token = localStorage.getItem('token');
        if (token) {
            const user = await getUser(token);
            setUser(user);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    }

    useEffect(() => {
        loadUser();
    },[isLoggedIn]);

    useEffect(() => {
        setActivePage(location.pathname);
    }, [location]);

    window.addEventListener('storage', () => {
        if (localStorage.getItem('token')) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    });

    window.addEventListener('user-updated', (event) => {
        const customEvent = event as CustomEvent<{ user: User }>;
        setUser(customEvent.detail.user);
    });

    function logout() {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        setIsLoggedIn(false);
        navigate('/');
    }

    function portfolio() {
        navigate('/portfolio');
    }

    function stocks() {
        navigate('/browse');
    }

    if (!user) {
        return(
            <LoadingSpinner />
        )
    }

    function createNavItems() {
        return (
            <div className={styles['nav-items-container']}>
                <div className={styles['nav-fields-container']}>
                    <p className={styles.name}>{`${user!.firstName} ${user!.lastName}`}</p>
                    <p className={styles.name}>{`Balance: $${user!.balance.toFixed(2)}`}</p>
                </div>
                <div className={styles['nav-buttons-container']}>
                    <button className={`${styles.button} ${activePage === '/browse' ? styles.active : ''}`} onClick={stocks}>Stocks</button>
                    <button className={`${styles.button} ${activePage === '/portfolio' ? styles.active : ''}`} onClick={portfolio}>Portfolio</button>
                    <button className={styles.button} onClick={logout}>Logout</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.navbar}>
            <Link to="/browse" className={styles.logo}><img className={styles.logo} src={stockLogo} /></Link>
            { createNavItems() }
        </div>
    );
}