import React, { useState, useEffect } from 'react';

//空の配列を作成
const initialData = [];


// const initialData = [
//   { id: 1, name: '牛乳', expiry: '2024-07-01' },
//   { id: 2, name: '卵', expiry: '2024-07-05' },
//   { id: 3, name: 'ヨーグルト', expiry: '2024-07-03' },
// ];

const STORAGE_KEY = 'expiry-list-items';

const ExpiryListScreen = ({ onBack }) => {
  const [items, setItems] = useState(initialData);
  const [showPopup, setShowPopup] = useState(false);

  // localStorageから復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleChange = (id, field, value) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // 保存ボタン押下時
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  // 新規追加用ID生成
  const getNextId = () => {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  };

  // 追加ボタン押下時
  const handleAdd = () => {
    setItems(prev => ([
      ...prev,
      { id: getNextId(), name: '', expiry: '' }
    ]));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', background: '#e3f2fd', position: 'relative' }}>
      {/* ポップアップ */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          background: '#4caf50',
          color: '#fff',
          textAlign: 'center',
          padding: '16px 0',
          fontSize: '1.1rem',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          保存が完了しました
        </div>
      )}
      <h2>消費期限リスト</h2>
      <ul style={{ listStyle: 'none', padding: 0, width: '300px' }}>
        {items.map(item => (
          <li key={item.id} style={{ background: '#fff', margin: '10px 0', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <input
              type="text"
              value={item.name}
              onChange={e => handleChange(item.id, 'name', e.target.value)}
              style={{ fontWeight: 'bold', width: '100px', marginRight: '10px' }}
            />
            -
            <input
              type="date"
              value={item.expiry}
              onChange={e => handleChange(item.id, 'expiry', e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </li>
        ))}
      </ul>
      <button
        style={{ margin: '10px', padding: '10px 30px', fontSize: '1rem', borderRadius: '8px', border: 'none', background: '#4caf50', color: '#fff', cursor: 'pointer' }}
        onClick={handleAdd}
      >
        追加
      </button>
      <button
        style={{ margin: '10px', padding: '10px 30px', fontSize: '1rem', borderRadius: '8px', border: 'none', background: '#2196f3', color: '#fff', cursor: 'pointer' }}
        onClick={handleSave}
      >
        保存
      </button>
      <button
        style={{ margin: '10px', padding: '10px 30px', fontSize: '1rem', borderRadius: '8px', border: 'none', background: '#aaa', color: '#fff', cursor: 'pointer' }}
        onClick={onBack}
      >
        戻る
      </button>
    </div>
  );
};

export default ExpiryListScreen;
