import { useEffect, useState } from "react";
import { User } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/api";
import styles from './NavBar.module.css';
import { Link } from "react-router-dom";

export default function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

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

    function createNavItems() {
        return (
            <div className={styles['nav-items-container']}>
                <p className={styles.name}>{`${user!.firstName} ${user!.lastName}`}</p>
                <p className={styles.name}>{`Balance: $${user!.balance.toFixed(2)}`}</p>
                <button className={styles.logout} onClick={stocks}>Stocks</button>
                <button className={styles.logout} onClick={portfolio}>Portfolio</button>
                <button className={styles.logout} onClick={logout}>Logout</button>
            </div>
        );
    }

    return (
        <div className={styles.navbar}>
            <Link to="/browse" className={styles.logo}>
                Stock Market
            </Link>
            { createNavItems() }
        </div>
    );
}