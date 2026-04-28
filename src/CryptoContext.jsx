import React, { createContext, useContext, useEffect, useState } from "react";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [watchlist, setWatchlist] = useState([]); // Bookmarks
  const [alerts, setAlerts] = useState([]); // Thresholds

  const fetchCoins = async () => {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false');
      const data = await res.json();
      setCoins(data);

      // Alert Logic: Check if any coin hit the threshold
      alerts.forEach(alertItem => {
        const coin = data.find(c => c.id === alertItem.id);
        if (coin && coin.current_price >= alertItem.value) {
          alert(`🔔 ALERT: ${coin.name} has hit your target of $${alertItem.value}!`);
        }
      });
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [alerts]);

  return (
    <Crypto.Provider value={{ coins, watchlist, setWatchlist, alerts, setAlerts }}>
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;
export const CryptoState = () => useContext(Crypto);