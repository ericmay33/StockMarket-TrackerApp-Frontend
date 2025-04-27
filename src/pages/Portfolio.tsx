import { useEffect, useState } from 'react'
import styles from './Portfolio.module.css'
import { PortfolioStock, User} from '../utils/types'
import { getPortfolio} from '../utils/api'
import { useNavigate } from 'react-router-dom';
import StockCard from '../components/stock-card/StockCard';

export default function Portfolio() {
    const [portfolio, setPortfolio] = useState([] as PortfolioStock[]);
    const [user, setUser] = useState<User | null>(null);

    const token = localStorage.getItem('token') as string;
    const navigate = useNavigate();

    async function loadPortfolio() {
        const portfolioData = await getPortfolio(token);
        setPortfolio(portfolioData);
    };

    useEffect(() => {
        document.title = "Your Portfolio";
        if (!token) {
            navigate('/');
        } else {
            loadPortfolio();
        }
    }, [token, navigate]);

    useEffect(() => {
        if (user) {
            setPortfolio(user.portfolio);
        }
    }, [user]);

    function createStockCards() {
        return portfolio.map(stock => {
            return (
                <StockCard
                    key={stock.ticker}
                    stock={stock}
                    userToken={token}
                    sellButton={true}
                    onUserUpdate={setUser}
                />
            )
        })
    };

    return (
        <div className={styles['main-container']}>
            {portfolio.length === 0 ? (
                <p className={styles['port-empty']}>Portfolio Empty.</p>) : 
                (<h1 className={styles['port-title']}>Portfolio Stocks</h1>
            )}
            <div className={styles['portfolio-list']}>
                { createStockCards() }
            </div>
        </div>
    )
}