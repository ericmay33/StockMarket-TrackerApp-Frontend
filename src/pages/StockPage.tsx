import { useEffect, useState } from 'react'
import styles from './StockPage.module.css'
import { Stock } from '../utils/types'
import { getStockByTicker } from '../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import { wait } from '../utils/utils'
import LoadingSpinner from '../components/loading-spinner/LoadingSpinner'

export default function StockPage() {
    const tickerParam = useParams().ticker!
    const [stock, setStock] = useState<Stock | null>(null);

    const token = localStorage.getItem('token') as string;
    const navigate = useNavigate();

    async function loadStock() {
        if (!tickerParam) {
            navigate('/browse');
            return;
        }

        try {
            const stockApiData = await getStockByTicker(tickerParam) as Stock;
            await wait(500);
            document.title = "View Stock"
            setStock(stockApiData);
        } catch (err) {
            navigate('/browse');
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
        } else {
            loadStock();
        }
    }, []);

    if (!stock) {
        return(
            <LoadingSpinner />
        )
    }

    return (
        <div className={styles['main-container']}>
            <h1 className={styles['stock-name']}>{stock.name}</h1>
            <img className={styles['stock-image']} src={stock.image} alt={`${stock.name} Image`} />
            
            <h2 id="about" className={styles['about-label']}>About</h2>
            <div className={styles['stock-info-container']}>
                <p className={styles['about-stock']}><strong>Ticker:</strong> ${stock.ticker}</p>
                <p className={styles['about-stock']}><strong>Market Cap:</strong> ${stock.marketCap.toLocaleString()}</p>
                <p className={styles['about-stock']}><strong>Sector:</strong> {stock.sector}</p>
                <p className={styles['about-stock']}><strong>Industry:</strong> {stock.industry}</p>
            </div>

            <h2 id="about" className={styles['about-label']}>Description</h2>
            <div className={styles['stock-info-container']}>
                <p className={styles['about-stock']}>{stock.description}</p>
            </div>
        </div>
    )
}