import { PortfolioStock, Stock } from "../../utils/types";
import styles from "./StockCard.module.css"
import { Link } from "react-router-dom";

export interface StockCardProps {
    stock: Stock | PortfolioStock
    sellButton: boolean
}

export default function StockCard(props: StockCardProps) {
    const stock = props.stock;

    function isPortfolioStock(stock: Stock | PortfolioStock): stock is PortfolioStock {
        return (stock as PortfolioStock).amount !== undefined && (stock as PortfolioStock).averagePrice !== undefined;
    }

    return (
        <div className={styles['stock-container']}>
            <div className={styles['stock-image-container']}>
                <Link to={`/stock/${stock.ticker}`}>
                    <img className={styles['stock-image']} src={stock.image} alt={stock.name} />
                </Link>
            </div>
            <Link className={styles['stock-link']} to={`/stock/${stock.ticker}`}>
                <h2 className={styles['stock-title']}>{stock.name}</h2>
                <h2 className={styles['stock-title']}>{stock.ticker}</h2>
            </Link>
            <p>{`$${stock.price.toFixed(2)}`}</p>
            <p>{`${stock.percentChange.toFixed(2)}%`}</p>

            {isPortfolioStock(stock) && (
                <div>
                    <p>{`Amount: ${stock.amount}`}</p>
                    <p>{`Average Price: $${stock.averagePrice.toFixed(2)}`}</p>
                </div>
            )}

            <button className={`${styles['stock-button']} ${styles['green-button']}`}>Buy</button>
            {props.sellButton && <button className={`${styles['stock-button']} ${styles['red-button']}`}>Sell</button>}
        </div>
    )
}