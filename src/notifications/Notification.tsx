import { Button } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import BlueCircle from '../assets/blueCircle_20.svg';
import WhiteCircle from '../assets/whiteCircle_20.svg';
import WhiteNoti from '../assets/whiteNoti_28.svg';
import { useDispatch, useSelector } from 'react-redux';
import { toggle } from './NotificationSlice';
import { useEffect, useRef, useState } from 'react';
import { GetUserInfo } from '../components/JWTToken';

export default function Notification() {
  const notificationState = useSelector((state: any) => state.notification) // 알림함 전역 상태
  const dispatch = useDispatch() // 알림함 전역 상태 변경
  const socketRef = useRef<WebSocket | null>(null);

  const [notifications, setNotifications] = useState<Array<any>>([])

  useEffect(() => {
    const accessToken = GetUserInfo().accessToken;
    if(accessToken) {
      const wsUrl = `${process.env.REACT_APP_SERVER_URL}/ws/notifications?token=Bearer ${encodeURIComponent(accessToken)}`;
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log('✅ WebSocket 연결됨');
      };

      socketRef.current.onmessage = (event) => {
        console.log('📩 받은 메시지:', event.data);
      };

      socketRef.current.onclose = () => {
        console.log('❌ WebSocket 연결 종료됨');
      };

      socketRef.current.onerror = (error) => {
        console.error('⚠️ WebSocket 에러:', error);
      };

      return () => {
        socketRef.current?.close();
      };
    }
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