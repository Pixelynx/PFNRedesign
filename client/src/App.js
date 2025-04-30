import React from 'react';
import SideNav from './layouts/SideNav';

function App() {
  return (
    <div className="App">
      <SideNav />
      <main style={{ padding: '20px', transition: '0.5s', marginLeft: '20px' }}>
        <h1 style={{ color: '#FF69B4' }}>PFN</h1>
      </main>
    </div>
  );
}

export default App;