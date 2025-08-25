import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CameraScreen = ({ onBack }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  // プレビューと同じサイズで撮影
  const width = 300;
  const height = 200;

  const capture = () => {
    //if (!webcamRef.current || !canvasRef.current) return;

    const video = webcamRef.current.video; // webcamRef から動画要素取得
    const canvas = canvasRef.current;

    // 動画の解像度に合わせてキャンバスを設定
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    setImage(canvas.toDataURL('image/jpeg'));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', background: '#fffde7' }}>
      <h2>カメラで消費期限を登録</h2>
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
          <button
            style={{ margin: '10px', padding: '10px 30px', fontSize: '1rem', borderRadius: '8px', border: 'none', background: '#2196f3', color: '#fff', cursor: 'pointer' }}
            onClick={() => setImage(null)}
          >
            もう一度撮影
          </button>
        </>
      )}
      <button
        style={{ margin: '10px', padding: '10px 30px', fontSize: '1rem', borderRadius: '8px', border: 'none', background: '#aaa', color: '#fff', cursor: 'pointer' }}
        onClick={onBack}
      >
        戻る
      </button>
    </div>
  );
};

export default CameraScreen;
