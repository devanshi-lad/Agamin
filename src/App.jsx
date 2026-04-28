import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Market from './pages/Market';
import Prediction from './pages/Prediction';
import About from './pages/About';
import Ecosystem from './pages/Ecosystem';
import Portfolio from './pages/Portfolio';
import Bitcoin from './pages/Bitcoin';
import Learn from './pages/Learn';
import NFTs from './pages/NFTs';
import Exchanges from './pages/Exchanges';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/market" element={<Market />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/about" element={<About />} />
            <Route path="/ecosystem" element={<Ecosystem />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/bitcoin" element={<Bitcoin />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/nfts" element={<NFTs />} />
            <Route path="/exchanges" element={<Exchanges />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
