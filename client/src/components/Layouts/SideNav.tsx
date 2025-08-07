import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext/AuthContext';
import './SideNav.css';

const SideNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navElement = document.getElementById('sidenav');
      const hamburgerButton = document.getElementById('hamburger-button');
      
      if (
        isOpen && 
        navElement && 
        hamburgerButton && 
        !navElement.contains(event.target as Node) && 
        !hamburgerButton.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const sideNavStyle: React.CSSProperties = {
    width: '250px',
    position: 'fixed',
    height: '100vh',
    left: isOpen ? '0' : '-250px',
    top: 0,
    backgroundColor: '#FF69B4',
    color: 'white',
    padding: '20px 0',
    boxShadow: isOpen ? '2px 0 5px rgba(0,0,0,0.1)' : 'none',
    zIndex: 10,
    transition: 'left 0.3s ease-in-out',
    overflowY: 'auto'
  };

  const hamburgerStyle: React.CSSProperties = {
    position: 'fixed',
    left: '20px',
    top: '20px',
    width: '40px',
    height: '40px',
    backgroundColor: '#FF69B4',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 11,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  };

  const hamburgerLineStyle: React.CSSProperties = {
    width: '24px',
    height: '3px',
    backgroundColor: 'white',
    margin: '2px 0',
    transition: 'all 0.3s ease'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9,
    display: isOpen ? 'block' : 'none'
  };

  const navHeaderStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '15px 0',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    marginBottom: '20px',
    marginTop: '30px'
  };

  const navLinkStyle: React.CSSProperties = {
    display: 'block',
    padding: '10px 20px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'background-color 0.2s ease'
  };

  const navSectionStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '14px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginTop: '15px'
  };

  const userSectionStyle: React.CSSProperties = {
    width: '100%',
    borderTop: '1px solid rgba(255,255,255,0.2)',
    padding: '15px 20px',
    fontSize: '14px',
    marginTop: '30px'
  };

  const buttonStyle: React.CSSProperties = {
    width: 'calc(100% - 40px)',
    margin: '10px 20px',
    padding: '8px',
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const loginButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'white',
    color: '#FF69B4',
    fontWeight: 'bold'
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <div 
        id="hamburger-button"
        style={hamburgerStyle} 
        onClick={toggleNav}
        className="hamburger-button"
      >
        <div style={{
          ...hamburgerLineStyle,
          transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
        }}></div>
        <div style={{
          ...hamburgerLineStyle,
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'translateX(-20px)' : 'none'
        }}></div>
        <div style={{
          ...hamburgerLineStyle,
          transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
        }}></div>
      </div>

      {/* Overlay for clicking outside to close */}
      <div style={overlayStyle} onClick={() => setIsOpen(false)}></div>
      
      {/* SideNav */}
      <div id="sidenav" style={sideNavStyle}>
        <div style={navHeaderStyle}>PFN</div>
        
        <Link to="/products" style={navLinkStyle} onClick={() => setIsOpen(false)}>All Products</Link>
        
        <div style={navSectionStyle}>Shop by Length</div>
        <Link to="/length/short" style={navLinkStyle} onClick={() => setIsOpen(false)}>Short</Link>
        <Link to="/length/medium" style={navLinkStyle} onClick={() => setIsOpen(false)}>Medium</Link>
        <Link to="/length/long" style={navLinkStyle} onClick={() => setIsOpen(false)}>Long</Link>
        
        <div style={navSectionStyle}>Shop by Style</div>
        <Link to="/style/square" style={navLinkStyle} onClick={() => setIsOpen(false)}>Square</Link>
        <Link to="/style/round" style={navLinkStyle} onClick={() => setIsOpen(false)}>Round</Link>
        <Link to="/style/almond" style={navLinkStyle} onClick={() => setIsOpen(false)}>Almond</Link>
        
        {/* Show account link and user info only when authenticated */}
        {currentUser ? (
          <div>
            <Link to="/account" style={navLinkStyle} onClick={() => setIsOpen(false)}>My Account</Link>
            <div style={userSectionStyle}>
              Logged in as: {currentUser.firstName}
            </div>
            <button 
              style={buttonStyle} 
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <div style={userSectionStyle}>
              Not logged in
            </div>
            <Link 
              to="/login" 
              style={{...navLinkStyle, ...loginButtonStyle}}
              onClick={() => setIsOpen(false)}
            >
              Login / Register
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SideNav;