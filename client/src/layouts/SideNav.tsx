import React, { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Context/AuthContext/AuthContext';

interface NavStyles {
  sidenav: CSSProperties;
  navButton: CSSProperties;
  closeButton: CSSProperties;
  navContent: CSSProperties;
  navHeader: CSSProperties;
  navSection: CSSProperties;
  navLink: CSSProperties;
  overlay: CSSProperties;
  authButton: CSSProperties;
}

interface NavLink {
  href: string;
  label: string;
}

interface NavSection {
  title: string;
  links: NavLink[];
}

const lengthSection: NavSection = {
  title: 'Shop by Length',
  links: [
    { href: '/length/short', label: 'Short' },
    { href: '/length/medium', label: 'Medium' },
    { href: '/length/long', label: 'Long' },
    { href: '/length/xl', label: 'XL' },
    { href: '/length/xxl', label: 'XXL' }
  ]
};

const styleSection: NavSection = {
  title: 'Shop by Style',
  links: [
    { href: '/style/square', label: 'Square' },
    { href: '/style/round', label: 'Round' },
    { href: '/style/almond', label: 'Almond' },
    { href: '/style/stiletto', label: 'Stiletto' }
  ]
};

const SideNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleNav = (): void => {
    setIsOpen(!isOpen);
  };

  const handleAuthAction = async (): Promise<void> => {
    if (currentUser) {
      try {
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    } else {
      navigate('/login');
    }
    setIsOpen(false);
  };

  const renderNavSection = ({ title, links }: NavSection): JSX.Element => (
    <>
      <div style={navStyles.navSection}>{title}</div>
      {links.map((link) => (
        <a 
          key={link.href} 
          href={link.href} 
          style={navStyles.navLink}
        >
          {link.label}
        </a>
      ))}
    </>
  );

  const navStyles: NavStyles = {
    sidenav: {
      height: '100%',
      width: isOpen ? '250px' : '0',
      position: 'fixed',
      zIndex: 1,
      top: 0,
      left: 0,
      backgroundColor: '#FF69B4',
      overflowX: 'hidden',
      transition: '0.5s',
      boxShadow: isOpen ? '2px 0 5px rgba(0,0,0,0.2)' : 'none',
      display: 'flex',
      flexDirection: 'column'
    },
    navButton: {
      position: 'fixed',
      top: '20px',
      left: isOpen ? '250px' : '20px',
      zIndex: 2,
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
    navContent: {
      flex: 1,
      paddingTop: '60px',
      display: 'flex',
      flexDirection: 'column'
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
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 0,
      cursor: 'pointer'
    },
    authButton: {
      margin: '15px',
      padding: '10px',
      backgroundColor: 'white',
      color: '#FF69B4',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: '0.3s',
      textAlign: 'center',
      flexShrink: 0
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
        
        <div style={navStyles.navContent}>
          <div style={navStyles.navHeader}>Pink Friday Nails</div>
          
          {renderNavSection(lengthSection)}
          {renderNavSection(styleSection)}
        </div>

        <button 
          onClick={handleAuthAction} 
          style={navStyles.authButton}
        >
          {currentUser ? 'Logout' : 'Sign In'}
        </button>
      </div>
    </>
  );
};

export default SideNav;