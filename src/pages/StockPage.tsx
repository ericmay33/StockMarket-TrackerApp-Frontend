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
        <div className={`${styles.flex} ${styles['flex-justify-center']}`}>
            <div className={styles['main-container']}>
                <img src={stock.image} alt={stock.name} />
                <div className={styles['product-info-container']}>
                    <p>{stock.name}</p>
                    <p>{stock.ticker}</p>
                    <p>{stock.marketCap}</p>
                    <p>{stock.percentChange}</p>
                    <p>{stock.price}</p>
                    <p>{stock.sector}</p>
                    <p>{stock.industry}</p>
                    <p>{stock.description}</p>
                </div>
            </div>
        </div>
    )
}