import axios from 'axios'
import { User, PortfolioStock, Stock } from './types';

const BACKEND_URL = "http://localhost:5000";

export async function getUser(token: string): Promise<User> {
    const response = await axios.get(`${BACKEND_URL}/user`, { headers: { token } });
    return response.data;
}

export async function getStocks(): Promise<Stock[]> {
    const response = await axios.get(`${BACKEND_URL}/stocks`);
    return response.data;
}

export async function getPortfolio(token: string): Promise<PortfolioStock[]> {
    const response = await axios.get(`${BACKEND_URL}/portfolio`, { headers: { token } });
    return response.data;
}

export async function buyStock(token: string, ticker: string, amount: number): Promise<User> {
    const response = await axios.post(`${BACKEND_URL}/buy`, { ticker, amount }, { headers: { token } });
    return response.data;
}

export async function sellStock(token: string, ticker: string, amount: number): Promise<User> {
    const response = await axios.post(`${BACKEND_URL}/sell`, { ticker, amount }, { headers: { token } });
    return response.data;
}

export async function login(username: string, password: string): Promise<string> {
    const response = await axios.post(`${BACKEND_URL}/login`, { username, password });
    return response.data.token;
}

export async function register(firstName: string, lastName: string, username: string, password: string): Promise<string> {
    const response = await axios.post(`${BACKEND_URL}/register`, { firstName, lastName, username, password });
    return response.data.token;
}

export async function deleteUser(token: string): Promise<void> {
    await axios.delete(`${BACKEND_URL}/user`, { headers: { token } });
}