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
    } catch (error: any) {
      alert(error.response.data.message);
    }
  };
  
  return (
    <div className={styles.navbar}>
      <div className={styles.leftSection}>
        <img src={logo} alt="Logo" className={styles.image} />
        <button onClick={() => {navigate("/home")}}
         className={url === "home" ? styles.selectedtab : styles.unselectedtab}
         hidden={role === "CENTERDIRECTOR"}>
          홈
        </button>
        <button onClick={() => {navigate("/search")}}
         className={url === "search" ? styles.selectedtab : styles.unselectedtab}>
          조회
        </button>
        <button onClick={() => {navigate("/management")}}
         className={url === "management" ? styles.selectedtab : styles.unselectedtab}
         hidden={role === "EMPLOYEE"}>
          승인 및 반려
        </button>
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
