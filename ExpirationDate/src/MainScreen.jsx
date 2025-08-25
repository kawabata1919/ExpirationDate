import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'expiry-list-items';

function getExpiryWarnings(items) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const warnings = [];
  for (const item of items) {
    if (!item.name || !item.expiry) continue;
    const expiryDate = new Date(item.expiry);
    expiryDate.setHours(0,0,0,0);
    const diffDays = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      warnings.push({
        name: item.name,
        message: '今日まで',
        color: 'orange',
      });
    } else if (diffDays < 0) {
      warnings.push({
        name: item.name,
        message: `期限切れ${-diffDays}日`,
        color: 'red',
      });
    } else if (diffDays <= 2) {
      warnings.push({
        name: item.name,
        message: `残り${diffDays}日`,
        color: 'orange',
      });
    }
  }
  return warnings;
}

const MainScreen = ({ onCameraClick, onListClick }) => {
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const items = JSON.parse(saved);
        setWarnings(getExpiryWarnings(items));
      } catch (e) {}
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', background: '#f8f9fa' }}>
      <h1>消費期限管理アプリ</h1>
      <div style={{ width: '350px', marginBottom: '20px', background: '#fff3e0', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>期限迫る</h3>
        {warnings.length === 0 ? (
          <div style={{ color: '#888' }}>期限が迫っている品目はありません</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {warnings.map((w, idx) => (
              <li key={idx} style={{ marginBottom: '6px', color: w.color === 'red' ? 'red' : '#ff9800', fontWeight: w.color === 'red' ? 'bold' : 'normal' }}>
                {w.name}：{w.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        style={{ margin: '20px', padding: '20px 40px', fontSize: '1.2rem', borderRadius: '8px', border: 'none', background: '#4caf50', color: '#fff', cursor: 'pointer' }}
        onClick={onCameraClick}
      >
        カメラで登録
      </button>
      <button
        style={{ margin: '20px', padding: '20px 40px', fontSize: '1.2rem', borderRadius: '8px', border: 'none', background: '#2196f3', color: '#fff', cursor: 'pointer' }}
        onClick={onListClick}
      >
        消費期限リストを見る
      </button>
    </div>
  );
};

export default MainScreen;
