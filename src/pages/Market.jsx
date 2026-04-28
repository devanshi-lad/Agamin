import React, { useState } from 'react';
import { CryptoState } from "../CryptoContext";

const Market = () => {
  const { coins, watchlist, setWatchlist, alerts, setAlerts } = CryptoState();
  const [username, setUsername] = useState("");
  const [thresholdInput, setThresholdInput] = useState({});

  const handleBookmark = (coinId) => {
    if (!watchlist.includes(coinId)) {
      setWatchlist([...watchlist, coinId]);
      alert(`${coinId} bookmarked locally!`);
    }
  };

  const handleSetAlert = (coinId) => {
    const value = thresholdInput[coinId];
    if (!value) return alert("Please enter a target price");
    setAlerts([...alerts, { id: coinId, value: parseFloat(value) }]);
    alert(`Alert set for ${coinId} at $${value}`);
  };

  const saveToCloud = async () => {
    if (!username) return alert("Please enter a username first!");
    
    // REPLACE THE URL BELOW WITH THE ONE YOU COPIED FROM THE PORTS TAB
    const BACKEND_URL = "https://zany-space-guide-pjq6xjpj5x963997g-5000.app.github.dev";

    try {
      const response = await fetch(`${BACKEND_URL}/api/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bookmarks: watchlist, alerts })
      });

      if (response.ok) alert("✅ Success! Data synced to Cloud MongoDB.");
      else alert("❌ Sync failed. Check if the terminal is running 'node server.js'");
    } catch (error) {
      console.error(error);
      alert("Error: Could not connect to backend server. Make sure port 5000 is set to PUBLIC in the Ports tab.");
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f4f7f6', 
      minHeight: '100vh', 
      color: '#333', 
      fontFamily: 'Arial',
      marginTop: '80px' // THIS PUSHES IT DOWN FROM THE NAVBAR
    }}>
      
      {/* CLOUD SYNC SECTION (Now Blue so we can see it) */}
      <div style={{ 
        backgroundColor: '#e3f2fd', // Light Blue Background
        padding: '25px', 
        borderRadius: '12px', 
        marginBottom: '30px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
        border: '2px solid #2196f3',
        display: 'flex', 
        gap: '15px', 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <h3 style={{ margin: 0, color: '#0d47a1' }}>Database Sync:</h3>
        <input 
          type="text" 
          placeholder="Type Username Here..." 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '12px', border: '1px solid #90caf9', borderRadius: '5px', width: '250px', fontSize: '16px' }}
        />
        <button 
          onClick={saveToCloud}
          style={{ 
            padding: '12px 25px', 
            backgroundColor: '#1976d2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
          ☁️ Sync to Cloud MongoDB
        </button>
      </div>

      <h1 style={{ color: '#000', marginBottom: '20px' }}>Live Crypto Market</h1>

      {/* TABLE SECTION */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
              <th style={{ padding: '15px' }}>Coin</th>
              <th style={{ padding: '15px' }}>Price (USD)</th>
              <th style={{ padding: '15px' }}>24h Change</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px', display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#000' }}>
                  <img src={coin.image} alt={coin.name} width="30" style={{ marginRight: '10px' }} />
                  {coin.name}
                </td>
                <td style={{ padding: '15px', fontWeight: 'bold', color: '#000' }}>
                  ${coin.current_price.toLocaleString()}
                </td>
                <td style={{ padding: '15px', fontWeight: 'bold', color: coin.price_change_percentage_24h > 0 ? '#2ecc71' : '#e74c3c' }}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td style={{ padding: '15px' }}>
                  <button 
                    onClick={() => handleBookmark(coin.id)}
                    style={{ padding: '8px 12px', backgroundColor: watchlist.includes(coin.id) ? '#95a5a6' : '#f1c40f', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold', color: '#000' }}>
                    {watchlist.includes(coin.id) ? "⭐ Bookmarked" : "⭐ Bookmark"}
                  </button>
                  
                  <input 
                    type="number" 
                    placeholder="Price"
                    style={{ padding: '8px', width: '80px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '5px' }}
                    onChange={(e) => setThresholdInput({...thresholdInput, [coin.id]: e.target.value})}
                  />
                  <button 
                    onClick={() => handleSetAlert(coin.id)}
                    style={{ padding: '8px 12px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Set Alert
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Market;