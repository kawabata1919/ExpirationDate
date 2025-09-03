import React, { useEffect, useState } from 'react';

// API_URLを動的に決定
let API_URL;
if (window.location.hostname === 'localhost') {
  API_URL = 'https://localhost:8000';
} else if (window.location.hostname === '192.168.0.170') {
  API_URL = 'https://192.168.0.170:8000';
} else {
  API_URL = 'https://192.168.1.100:8000'; // デフォルト値
}

function getExpiryWarnings(items) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const warnings = [];
  for (const item of items) {
    if (!item.name || !item.expiry_date) continue;
    const expiryDate = new Date(item.expiry_date);
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
    } else if (diffDays <= 7) {
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
  const [loading, setLoading] = useState(true);

  // マウスイベントの管理
  const [isHovered, setIsHovered] = useState(false);

  // マウスが要素に入った時のハンドラ
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // マウスが要素から離れた時のハンドラ
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/foods`);
        if (!res.ok) throw new Error('API取得エラー');
        const items = await res.json();
        setWarnings(getExpiryWarnings(items));
      } catch (e) {
        setWarnings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', background: '#f8f9fa', fontSize: '24px' }}>
      <h1>消費期限管理アプリ</h1>
      <div style={{ width: '350px', marginBottom: '20px', background: '#fff3e0', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>期限迫る</h3>
        {loading ? (
          <div>読み込み中...</div>
        ) : warnings.length === 0 ? (
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
        style={{ margin: '20px', padding: '20px 40px', fontSize: '1.2rem', borderRadius: '8px', border: 'none', background: '#4caf50', color: '#fff', cursor: 'pointer', opacity: isHovered ? 0.7 : 1}} // ホバー時は0.7、通常時は1 (不透明) }}
        onClick={onCameraClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        カメラで登録
      </button>
      <button
        style={{ margin: '20px', padding: '20px 40px', fontSize: '1.2rem', borderRadius: '8px', border: 'none', background: '#2196f3', color: '#fff', cursor: 'pointer', opacity: isHovered ? 0.7 : 1 }}
        onClick={onListClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        消費期限リストを見る
      </button>
    </div>
  );
};

export default MainScreen;
