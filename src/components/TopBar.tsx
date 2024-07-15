// src/App.js
import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GetUserInfo, RemoveUserInfo } from './JWTToken';

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
  const userName = GetUserInfo().name;
  const accessToken = GetUserInfo().accessToken;

  const navigate = useNavigate();

  // 로그아웃
  const handleLogout = async () => {
    //setSpinnerShow(true);
    try {
      const res = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/logout`, {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      await RemoveUserInfo();
      alert(res.data);
      //setSpinnerShow(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div style={styles.navbar}>
      <div style={styles.leftSection}>
        <img src="https://via.placeholder.com/40" alt="Logo" style={styles.image} />
        <button onClick={() => {navigate("/temp/home", { replace: true })}}
          style={styles.button}
        >
          홈
        </button>
        <button onClick={() => {navigate("/temp/search", { replace: true })}}
          style={styles.button}
        >
          조회
        </button>
        <button onClick={() => {navigate("/temp/manage", { replace: true })}}
          style={styles.button}
        >
          승인 및 반려
        </button>
      </div>
      <div style={styles.rightSection}>
        <span style={styles.text}>{userName}</span>
        <button onClick={handleLogout}
          style={styles.button}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
