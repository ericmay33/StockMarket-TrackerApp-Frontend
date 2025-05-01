import { useEffect, useState } from 'react'
import styles from './Browse.module.css'
import { Stock } from '../utils/types'
import { getStocks } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import StockCard from '../components/stock-card/StockCard'

export default function Browse() {
    const [stocks, setStocks] = useState([] as Stock[])
    const [searchTerm, setSearchTerm] = useState('');
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

    // filter based on searchTerm
    const filteredStocks = stocks.filter(stock =>
        stock.ticker.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    function createStockCards() {
        return filteredStocks.map(stock => {
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
            <h1 className={styles['dash-title']}>Stocks Dashboard</h1>
            <input className={styles['search-bar']} type="text" placeholder="Search by ticker (e.g., AAPL)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            <div className={styles['stock-list']}>
            {filteredStocks.length === 0 ? (
                <p className={styles['missing-text']}>No matching stocks found.</p>
                ) : (
                    createStockCards()
                )}
            </div>
        </div>
    )
}