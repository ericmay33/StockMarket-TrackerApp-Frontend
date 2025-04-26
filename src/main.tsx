import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './components/MainLayout.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop.tsx';
import Login from './pages/Login.tsx';
import Browse from './pages/Browse.tsx';
import Portfolio from './pages/Portfolio.tsx';
import StockPage from './pages/StockPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainLayout />}>
          <Route path="/browse" element={<Browse />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/stock/:ticker" element={<StockPage/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);