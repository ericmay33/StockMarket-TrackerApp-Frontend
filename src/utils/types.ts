export interface User {
    id: number;
    username: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    balance: number;
    portfolio: PortfolioStock[];
}

export interface PortfolioStock {
    ticker: string;
    name: string;
    marketCap: number;
    percentChange: number;
    price: number;
    sector: string;
    industry: string;
    description: string;
    image: string;
    amount: number,
    averagePrice: number
}

export interface Stock {
    ticker: string;
    name: string;
    marketCap: number;
    percentChange: number;
    price: number;
    sector: string;
    industry: string;
    description: string;
    image: string;
}