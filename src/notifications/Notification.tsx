import { Button } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import BlueCircle from '../assets/blueCircle_20.svg';
import WhiteCircle from '../assets/whiteCircle_20.svg';
import WhiteNoti from '../assets/whiteNoti_28.svg';
import { useDispatch, useSelector } from 'react-redux';
import { toggle } from './NotificationSlice';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetUserInfo } from '../components/JWTToken';

export default function Notification() {
  const notificationState = useSelector((state: any) => state.notification)
  const dispatch = useDispatch()

  const [notifications, setNotifications] = useState<Array<any>>([])

  useEffect(() => {
    const getNotifications = async () => {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${GetUserInfo().accessToken}`
        }
      });
      setNotifications(res.data)
    }
    getNotifications();
    const interval = setInterval(getNotifications, 5000) // 5초마다 GET 요청
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  return (
    <div>
      <ToastContainer hidden={notificationState} position="bottom-end" className="p-3 mb-5" style={{ zIndex: 1 }}>
        {Object.entries(notifications).reverse().map(([k,v]) => (
          <Toast key={k}>
            <Toast.Header closeButton={false}>
              <img src={v.read ? WhiteCircle : BlueCircle}></img>
              <small className="text-muted">{v.createdAt}</small>
            </Toast.Header>
            <Toast.Body>{v.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
      <Button
       variant={notificationState ? "primary" : "outline-primary"}
       style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 1 }}
       onClick={() => {dispatch(toggle())}}>
        <img src={WhiteNoti} alt='notification'/>
      </Button>
    </div>
  );
}