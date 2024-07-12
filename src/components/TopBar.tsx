// src/App.js
import * as React from 'react';
import { GetUserInfo } from './JWTToken';

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
  },
  centerSection: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    width: '40px',
    height: '40px',
  },
  button: {
    margin: '0 10px',
    padding: '10px 20px',
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#777',
  },
  text: {
    marginRight: '20px',
  },
};

export default function TopBar() {
  const [userName, setUserName] = React.useState<string | null>('');
  React.useEffect(() => {
    const handleStorageChange = () => {
      console.log("fff");
      
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  
  return (
    <div style={styles.navbar}>
      <div style={styles.leftSection}>
        <img src="https://via.placeholder.com/40" alt="Logo" style={styles.image} />
      </div>
      <div style={styles.centerSection}>
        <button
          style={styles.button}
        >
          Button 1
        </button>
        <button
          style={styles.button}
        >
          Button 2
        </button>
        <button
          style={styles.button}
        >
          Button 3
        </button>
      </div>
      <div style={styles.rightSection}>
        <span style={styles.text}>{userName}</span>
        <button
          style={styles.button}
        >
          Button 4
        </button>
      </div>
    </div>
  );
}
