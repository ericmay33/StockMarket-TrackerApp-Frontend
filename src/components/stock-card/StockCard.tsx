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
    const [amount, setAmount] = useState(1)
    const [errorMessage, setErrorMessage] = useState('');
    const stock = props.stock;

    function isPortfolioStock(stock: Stock | PortfolioStock): stock is PortfolioStock {
        return (stock as PortfolioStock).amount !== undefined && (stock as PortfolioStock).averagePrice !== undefined;
    }

    const handleAmountChange = (action: 'increase' | 'decrease') => {
        setAmount(prev => {
            if (action === 'increase') return Math.max(prev + 1, 1);
            if (action === 'decrease') return Math.max(prev - 1, 1);
            return prev;
        });
    };

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
                    window.dispatchEvent(new CustomEvent("buy-error"));
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
            window.dispatchEvent(new CustomEvent("sell-error"));
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
                    window.dispatchEvent(new CustomEvent("sell-error"));
                    setErrorMessage("You don't have enough stocks to sell.");
                    return;
                }
            }
            setErrorMessage("Unable to sell stock -- please try again later.");
        }
    }

    const isNegative = stock.percentChange < 0;

    function calculateValue(s: PortfolioStock): number {
        return (s.price * s.amount);
    }

    function calculateChangeTotal(s: PortfolioStock): number {
        return ((s.price * s.amount) - (s.averagePrice * s.amount));
    }

    function calculateChangePercent(s: PortfolioStock): number {
        return ((s.price - s.averagePrice) / s.averagePrice) * 100;
    }
 
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

            {isPortfolioStock(stock) && (
                <div>
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
                </div>
            )}

            <div className={styles['form-container']}>
                <div className={styles['button-container']}>
                    <div>
                        <button className={`${styles['stock-button']} ${styles['green-button']}`} onClick={() => handleBuy(props.userToken, amount)}>Buy</button>
                    </div>

                    {props.sellButton && 
                        <div>
                            <button className={`${styles['stock-button']} ${styles['red-button']}`} onClick={() => handleSell(props.userToken, amount)}>Sell</button>
                        </div>
                    }
                </div>

                <div className={styles['amount-picker-container']}>
                    <button className={styles['amount-arrow-button']} onClick={() => handleAmountChange('increase')}>▲</button>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Math.max(Number(e.target.value), 1))}
                        className={styles['amount-input']}
                        min={1}/>
                    <button className={styles['amount-arrow-button']} onClick={() => handleAmountChange('decrease')}>▼</button>
                </div>
            </div>

            {isPortfolioStock(stock) && (() => {
                const changeTotal = calculateChangeTotal(stock);
                const changePercent = calculateChangePercent(stock);
                const changeTotalClass = changeTotal > 0 ? styles['portfolio-text-green'] : (changeTotal < 0 ? styles['portfolio-text-red'] : ''); 
                const changePercentClass = changePercent > 0 ? styles['portfolio-text-green'] : (changePercent < 0 ? styles['portfolio-text-red'] : '');

                return (
                    <div className={styles['stock-portfolio-total-container']}>
                        <p className={`${styles['portfolio-total-label']}`}>Overview</p>
                        <div className={`${styles['portfolio-item']}`}>
                            <p className={`${styles['portfolio-label']} ${styles['inline']}`}>Total Value: </p>
                            <p className={`${styles['portfolio-value']} ${styles['inline']}`}> ${calculateValue(stock).toFixed(2)}</p>
                        </div>
                        <div className={styles['portfolio-item']}>
                            <p className={`${styles['portfolio-label']} ${styles['inline']}`}>Total Change: </p>
                            <p className={`${styles['portfolio-value']} ${styles['inline']} ${changeTotalClass}`}>
                                {changeTotal >= 0 ? `+$${changeTotal.toFixed(2)}` : `-$${Math.abs(changeTotal).toFixed(2)}`}
                            </p>
                        </div>
                        <div className={styles['portfolio-item']}>
                            <p className={`${styles['portfolio-label']} ${styles['inline']}`}>Total Return: </p>
                            <p className={`${styles['portfolio-value']} ${styles['inline']} ${changePercentClass}`}>
                                {changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`}
                            </p>
                        </div>
                    </div>
                );
            })()}
        </div>
    )
}