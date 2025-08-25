import React, { useState } from 'react';
import MainScreen from './MainScreen';
import CameraScreen from './CameraScreen';
import ExpiryListScreen from './ExpiryListScreen';

const App = () => {
  const [screen, setScreen] = useState('main');

  return (
    <>
      {screen === 'main' && (
        <MainScreen
          onCameraClick={() => setScreen('camera')}
          onListClick={() => setScreen('list')}
        />
      )}
      {screen === 'camera' && (
        <CameraScreen onBack={() => setScreen('main')} />
      )}
      {screen === 'list' && (
        <ExpiryListScreen onBack={() => setScreen('main')} />
      )}
    </>
  );
};

export default App;
