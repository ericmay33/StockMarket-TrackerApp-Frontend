import { useEffect, useState } from 'react'
import styles from './Browse.module.css'
import { PortfolioStock} from '../utils/types'
import { getPortfolio } from '../utils/api'
import { useNavigate } from 'react-router-dom';

export default function Browse() {
    const [portfolio, setPortfolio] = useState([] as PortfolioStock[]);

    const token = localStorage.getItem('token') as string;
    const navigate = useNavigate();

    async function loadPorfolio() {
        const portfolioApiData = await getPortfolio(token);
        setPortfolio(portfolioApiData);
    };

    useEffect(() => {
        document.title = "Your Portfolio"
        if (!token) {
            navigate('/');
        } else {
            loadPorfolio();
        }
    }, []);

    function createStockCards() {
        return portfolio.map(stock => {
            return (
                <p>{stock.name}, {stock.ticker}, {stock.price}, {stock.percentChange}</p>
            )
        })
    }

    return (
        <div className={styles['main-container']}>
            <h1>Portfolio Stocks</h1>
            <p className={styles['number-of-shop-items']}>Number of stocks in Portfolio: <span>{portfolio.length}</span></p>
            <p></p>
            <div className={styles['product-list']}>
                { createStockCards() }
            </div>
        </div>
    )
}