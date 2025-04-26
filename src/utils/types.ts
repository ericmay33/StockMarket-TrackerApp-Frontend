export interface User {
    id: number;
    username: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    balance: number;
    portfolio: PortfolioStock[];
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

export interface PortfolioStock extends Stock {
    amount: number;
    averagePrice: number;
}