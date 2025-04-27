import { useEffect, useState } from 'react'
import styles from './Browse.module.css'
import { Stock } from '../utils/types'
import { getStocks } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import StockCard from '../components/stock-card/StockCard'

export default function Browse() {
    const [stocks, setStocks] = useState([] as Stock[])

    const token = localStorage.getItem('token') as string;
    const navigate = useNavigate();

    async function loadStocks() {
        const productApiData = await getStocks();
        setStocks(productApiData);
    };

    useEffect(() => {
        document.title = "Browse Stocks"
        if (!token) {
            navigate('/');
        } else {
            loadStocks();
        }
    }, []);

    function createStockCards() {
        return stocks.map(stock => {
            return (
                <StockCard
                    key={stock.ticker}
                    stock={stock}
                    userToken={token}
                    sellButton={false}
                />
            )
        })
    }

    return (
        <div className={styles['main-container']}>
            <h1>Browse Stocks</h1>
            <p className={styles['number-of-stocks']}>Number of stocks: <span>{stocks.length}</span></p>
            <p></p>
            <div className={styles['stock-list']}>
                { createStockCards() }
            </div>
        </div>
    )
}