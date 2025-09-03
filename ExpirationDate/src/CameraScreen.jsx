import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

// API_URLを動的に決定
let API_URL;
if (window.location.hostname === 'localhost') {
  API_URL = 'https://localhost:8000';
} else if (window.location.hostname === '192.168.0.170') {
  API_URL = 'https://192.168.0.170:8000';  
} else {
  API_URL = 'https://192.168.1.100:8000'; // デフォルト値
}

const CameraScreen = ({ onBack }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // プレビューと同じサイズで撮影
  const width = 300;
  const height = 200;

  const capture = () => {
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    setImage(canvas.toDataURL('image/jpeg'));
  };

  // 画像＋情報をAPIに送信
  const handleUpload = async () => {
    if (!name || !expiry || !image) {
      setMessage('全ての項目を入力してください');
      return;
    }
    setUploading(true);
    setMessage('');
    try {
      // base64→Blob
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append('name', name);
      formData.append('expiry_date', expiry);
      formData.append('file', blob, 'capture.jpg');
      const res = await fetch(`${API_URL}/foods`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('アップロード失敗');
      setMessage('登録が完了しました');
      setImage(null);
      setName('');
      setExpiry('');
    } catch (e) {
      setMessage('登録に失敗しました');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', background: '#fffde7' }}>
      <h2>カメラで消費期限を登録</h2>
      {message && <div style={{ color: message.includes('失敗') ? 'red' : 'green', marginBottom: 10 }}>{message}</div>}
      {!image ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={300}
            height={200}
            videoConstraints={{
              width: width,
              height: height,
              facingMode: 'environment'
            }}
            style={{ borderRadius: '12px', marginBottom: '20px' }}
          />
          <button
            style={{ margin: '10px', padding: '10px 30px', fontSize: '1rem', borderRadius: '8px', border: 'none', background: '#4caf50', color: '#fff', cursor: 'pointer' }}
            onClick={capture}
          >
            撮影
          </button>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
      ) : (
        <>
          <img src={image} alt="撮影画像" style={{ width: 300, height: 200, borderRadius: '12px', marginBottom: '20px' }} />
          <input
            type="text"
            placeholder="食材名"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ marginBottom: 10, padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 200 }}
          />
          <input
            type="date"
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
            style={{ marginBottom: 10, padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 200 }}
          />
          <button
            style={{ margin: '10px', padding: '10px 30px', fontSize: '1rem', borderRadius: '8px', border: 'none', background: '#4caf50', color: '#fff', cursor: 'pointer' }}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? '登録中...' : '登録'}
          </button>
          <button
            style={{ margin: '10px', padding: '10px 30px', fontSize: '1rem', borderRadius: '8px', border: 'none', background: '#2196f3', color: '#fff', cursor: 'pointer' }}
            onClick={() => setImage(null)}
            disabled={uploading}
          >
            もう一度撮影
          </button>
        </>
      )}
      <button
        style={{ margin: '10px', padding: '10px 30px', fontSize: '1rem', borderRadius: '8px', border: 'none', background: '#aaa', color: '#fff', cursor: 'pointer' }}
        onClick={onBack}
        disabled={uploading}
      >
        戻る
      </button>
    </div>
  );
};

export default CameraScreen;
