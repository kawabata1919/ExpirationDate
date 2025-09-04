import React, { useState } from 'react';
// styles.cssをインポート
import './style.css'; 

function Button({ text, className, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // ホバー状態に応じてクラス名を結合
  const hoverClass = isHovered ? 'hovered' : '';
  
  return (
    <button
      className={`${className} ${hoverClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;