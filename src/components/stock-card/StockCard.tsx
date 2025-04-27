import { PortfolioStock, Stock } from "../../utils/types";
import styles from "./StockCard.module.css"
import { Link } from "react-router-dom";
import { User } from "../../utils/types";
import { buyStock, sellStock } from "../../utils/api";
import { useState } from "react";
import axios from 'axios';

export interface StockCardProps {
    stock: Stock | PortfolioStock
    userToken: string
    sellButton: boolean
    onUserUpdate?: (user: User) => void;
}

export default function StockCard(props: StockCardProps) {
    const [buyAmount, setBuyAmount] = useState(1);
    const [sellAmount, setSellAmount] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const stock = props.stock;

    function isPortfolioStock(stock: Stock | PortfolioStock): stock is PortfolioStock {
        return (stock as PortfolioStock).amount !== undefined && (stock as PortfolioStock).averagePrice !== undefined;
    }

    async function handleBuy(token: string, amount: number): Promise<void> {
        setErrorMessage("");
        if (!amount || amount < 1) {
            setErrorMessage("Please enter a valid quantity to buy.");
            return;
        }
        try {
            const user = (await buyStock(token, stock.ticker, amount)) as User;
            props.onUserUpdate?.(user);
            window.dispatchEvent(new CustomEvent("user-updated", { detail: { user } }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setErrorMessage("Insufficient balance to buy this stock.");
                    return;
                }
            }
            setErrorMessage("Unable to buy stock -- please try again later.");
        }
    }

    async function handleSell(token: string, amount: number): Promise<void> {
        setErrorMessage("");
        if (!amount || amount < 1) {
            setErrorMessage("Please enter a valid quantity to sell.");
            return;
        }
        if (isPortfolioStock(stock) && amount > stock.amount) {
            setErrorMessage("You don't have enough stocks to sell.");
            return;
        }
        try {
            const user = (await sellStock(token, stock.ticker, amount)) as User;
            props.onUserUpdate?.(user);
            window.dispatchEvent(new CustomEvent("user-updated", { detail: { user } }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setErrorMessage("You don't have enough stocks to sell.");
                    return;
                }
            }
            setErrorMessage("Unable to sell stock -- please try again later.");
        }
    }

    const isNegative = stock.percentChange < 0 as boolean;

    return (
        <div className={styles['stock-container']}>
            <div className={styles['stock-image-container']}>
                <Link to={`/stock/${stock.ticker}`}>
                    <img className={styles['stock-image']} src={stock.image} alt={stock.name} />
                </Link>
            </div>
            <div className={styles['stock-names-container']}>
                <Link className={styles['stock-link']} to={`/stock/${stock.ticker}`}>
                    <h2 className={styles['stock-ticker']}>{`$${stock.ticker}`}</h2>
                    <h2 className={styles['stock-name']}>{stock.name}</h2>
                </Link>
            </div>
            <div className={styles['stock-price-container']}>
                <div>
                    <p className={`${styles['stock-price']} ${styles['inline']}`}>Price: </p>
                    <p className={`${styles['stock-price']} ${styles['inline']} ${styles['bold']}`}>{`$${stock.price.toFixed(2)}`}</p>
                </div>
                <div>
                    <p className={`${styles['stock-price']} ${styles['inline']}`}>1D: </p>
                    <p className={`${styles['stock-price']} ${isNegative ? styles['stock-change-red'] : styles['stock-change-green']} ${styles['inline']}`}>
                        { isNegative ? `-${Math.abs(stock.percentChange).toFixed(2)}%` : `+${stock.percentChange.toFixed(2)}%`}</p>
                </div>
            </div>

            <div className={styles['form-container']}>
                <div className={styles['button-container']}>
                    <div>
                        <button className={`${styles['stock-button']} ${styles['green-button']}`} onClick={() => handleBuy(props.userToken, buyAmount)}>Buy</button>
                    </div>

                    {props.sellButton && 
                        <div>
                            <button className={`${styles['stock-button']} ${styles['red-button']}`} onClick={() => handleSell(props.userToken, sellAmount)}>Sell</button>
                        </div>
                    }
                </div>

                <input type="number" min={1} value={buyAmount} onChange={(e) => setBuyAmount(parseInt(e.target.value) || 1)} style={{ width: "60px" }}/>
            </div>

            {isPortfolioStock(stock) && (
                <div className={styles['stock-portfolio-container']}>
                    <div className={`${styles['portfolio-item']}`}>
                        <p className={`${styles['portfolio-label']} ${styles['inline']}`}>Shares: </p>
                        <p className={`${styles['portfolio-value']} ${styles['inline']}`}> {stock.amount}</p>
                    </div>
                    <div className={styles['portfolio-item']}>
                        <p className={`${styles['portfolio-label']} ${styles['inline']}`}>Avg. Price: </p>
                        <p className={`${styles['portfolio-value']} ${styles['inline']}`}> ${stock.averagePrice.toFixed(2)}</p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <p className={styles["error-message"]} style={{ color: "red", marginTop: "8px" }}>
                    {errorMessage}
                </p>
            )} 
        </div>
    )
}