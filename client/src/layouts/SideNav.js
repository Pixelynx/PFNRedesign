import React, { useState } from 'react';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const navStyles = {
    sidenav: {
      height: '100%',
      width: isOpen ? '250px' : '0',
      position: 'fixed',
      zIndex: '1',
      top: '0',
      left: '0',
      backgroundColor: '#FF69B4', // Hot Pink
      overflowX: 'hidden',
      transition: '0.5s',
      paddingTop: '60px',
      boxShadow: isOpen ? '2px 0 5px rgba(0,0,0,0.2)' : 'none'
    },
    navButton: {
      position: 'fixed',
      top: '20px',
      left: isOpen ? '250px' : '20px',
      zIndex: '2',
      transition: '0.5s',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer'
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      fontSize: '24px',
      background: 'transparent',
      border: 'none',
      color: 'white',
      cursor: 'pointer'
    },
    navHeader: {
      color: 'white',
      fontSize: '20px',
      padding: '10px 15px',
      borderBottom: '1px solid rgba(255,255,255,0.3)',
      marginBottom: '5px'
    },
    navSection: {
      padding: '10px 15px',
      color: 'white',
      fontSize: '18px',
      fontWeight: 'bold'
    },
    navLink: {
      padding: '8px 8px 8px 25px',
      textDecoration: 'none',
      fontSize: '16px',
      color: 'white',
      display: 'block',
      transition: '0.3s'
    },
    overlay: {
      position: 'fixed',
      display: isOpen ? 'block' : 'none',
      width: '100%',
      height: '100%',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: '0',
      cursor: 'pointer'
    }
  };

  return (
    <>
      <button onClick={toggleNav} style={navStyles.navButton}>
        {isOpen ? '' : '☰ Menu'}
      </button>
      
      <div style={navStyles.overlay} onClick={toggleNav}></div>
      
      <div style={navStyles.sidenav}>
        <button onClick={toggleNav} style={navStyles.closeButton}>✕</button>
        <div style={navStyles.navHeader}>Pink Friday Nails</div>
        
        <div style={navStyles.navSection}>Shop by Length</div>
        <a href="/length/short" style={navStyles.navLink}>Short</a>
        <a href="/length/medium" style={navStyles.navLink}>Medium</a>
        <a href="/length/long" style={navStyles.navLink}>Long</a>
        <a href="/length/xl" style={navStyles.navLink}>XL</a>
        <a href="/length/xxl" style={navStyles.navLink}>XXL</a>
        
        <div style={navStyles.navSection}>Shop by Style</div>
        <a href="/style/square" style={navStyles.navLink}>Square</a>
        <a href="/style/round" style={navStyles.navLink}>Round</a>
        <a href="/style/almond" style={navStyles.navLink}>Almond</a>
        <a href="/style/stiletto" style={navStyles.navLink}>Stiletto</a>
      </div>
    </>
  );
};

export default SideNav;