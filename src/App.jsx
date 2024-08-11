import React, { useState } from 'react';
import Weather from './components/Weather'
const App = () => {
  const [backgroundImg, setBackgroundImg] = useState('assets/sunny.jpg');
  return (
    <div className='app' style={{
      backgroundImage: `url(${backgroundImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}>
      <Weather setBackgroundImg={setBackgroundImg} />
    </div>
  )
}

export default App
