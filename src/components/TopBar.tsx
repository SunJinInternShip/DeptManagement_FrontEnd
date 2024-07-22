// src/App.js
import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GetUserInfo, RemoveUserInfo } from './JWTToken';
import logo from '../assets/sunjin.png';
import { Button } from 'react-bootstrap';
import styles from '../styles/TopBar.module.css'

export default function TopBar(url: string) {
  const accessToken = GetUserInfo().accessToken;
  const userName = GetUserInfo().name;
  const role = GetUserInfo().role;

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
    <div className={styles.navbar}>
      <div className={styles.leftSection}>
        <img src={logo} alt="Logo" className={styles.image} />
        <Button variant={url === "home" ? "primary" : "outline-primary"}
         onClick={() => {navigate("/home")}}
         className={styles.button}
         hidden={role === "CENTERDIRECTOR"}>
          홈
        </Button>
        <Button variant={url === "search" ? "primary" : "outline-primary"}
         onClick={() => {navigate("/search")}}
         className={styles.button}>
          조회
        </Button>
        <Button variant={url === "management" ? "primary" : "outline-primary"}
         onClick={() => {navigate("/management")}}
         className={styles.button}
         hidden={role === "EMPLOYEE"}>
          승인 및 반려
        </Button>
      </div>
      <div className={styles.rightSection}>
        <span className={styles.text}>{role} | {userName}</span>
        <Button variant="outline-danger"
         onClick={handleLogout}
         className={styles.button}>
          로그아웃
        </Button>
      </div>
    </div>
  );
}
