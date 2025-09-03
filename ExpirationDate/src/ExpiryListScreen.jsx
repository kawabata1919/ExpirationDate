import React, { useState, useEffect } from 'react';

// API_URLを動的に決定
let API_URL;
if (window.location.hostname === 'localhost') {
  API_URL = 'https://localhost:8000';
} else if (window.location.hostname === '192.168.0.170') {
  API_URL = 'https://192.168.0.170:8000';
} else {
  API_URL = 'https://192.168.1.100:8000'; // デフォルト値
}

const ExpiryListScreen = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 食材リスト取得
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/foods`);
      if (!res.ok) throw new Error('API取得エラー');
      const data = await res.json();
      setItems(data);
      setError(null);
    } catch (e) {
      setError('データ取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 編集
  const handleChange = (id, field, value) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // 保存（編集内容をAPIでPUT/PATCHする場合は別途実装。今回は簡易的にPOST/DELETEのみ）
  const handleSave = async () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
    // 本格的な編集保存はAPIにPATCH/PUTを追加してください
  };

  // 追加
  const handleAdd = () => {
    //一意性のあるIDを指定
    const tempId = Date.now() + Math.random();
    setItems(prev => ([
      ...prev,
      { id: tempId, name: '', expiry_date: '', image_path: null, isNew: true, tempId }
    ]));
  };

  // 新規追加分をAPIに送信
  const handleRegister = async (item) => {
    try {
      const formData = new FormData();
      formData.append('name', item.name);
      formData.append('expiry_date', item.expiry_date);
      // 画像があれば formData.append('file', fileObj);

      const res = await fetch(`${API_URL}/foods`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('登録失敗');
      await fetchItems();
    } catch (e) {
      alert('登録に失敗しました');
    }
  };

  // 削除
  const handleDelete = async (id) => {
    if (!window.confirm('本当に削除しますか？')) return;
    try {
      const res = await fetch(`${API_URL}/foods/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('削除失敗');
      await fetchItems();
    } catch (e) {
      alert('削除に失敗しました');
    }
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
      {loading ? (
        <div>読み込み中...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, width: '350px' }}>
          {items.map(item => (
            <li key={item.id} style={{ background: '#fff', margin: '10px 0', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={item.name}
                onChange={e => handleChange(item.id, 'name', e.target.value)}
                style={{ fontWeight: 'bold', width: '100px', marginRight: '10px' }}
                disabled={!item.isNew}
              />
              -
              <input
                type="date"
                value={item.expiry_date || ''}
                onChange={e => handleChange(item.id, 'expiry_date', e.target.value)}
                style={{ marginLeft: '10px' }}
                disabled={!item.isNew}
              />
              {item.image_path && (
                <img src={`${API_URL}/${item.image_path}`} alt="food" style={{ width: 40, height: 40, objectFit: 'cover', marginLeft: 10, borderRadius: 4 }} />
              )}
              {item.isNew ? (
                <button style={{ marginLeft: 10 }} onClick={() => handleRegister(item)}>登録</button>
              ) : (
                <button style={{ marginLeft: 10, background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }} onClick={() => handleDelete(item.id)}>削除</button>
              )}
            </li>
          ))}
        </ul>
      )}
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
