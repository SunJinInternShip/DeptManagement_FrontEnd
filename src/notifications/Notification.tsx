import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import BlueCircle from '../assets/blueCircle_20.svg';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from './NotificationSlice';
import { useEffect, useRef, useState } from 'react';
import { GetUserInfo } from '../components/JWTToken';

interface Notification {
  message: string;
  createdAt: string;
}

export default function Notification() {
  const notificationState = useSelector((state: any) => state.notification) // 알림함 전역 상태
  const dispatch = useDispatch() // 알림함 전역 상태 변경
  const socketRef = useRef<WebSocket | null>(null)

  const [notifications, setNotifications] = useState<Array<Notification>>([])

  useEffect(() => {
    setNotifications(notificationState)
  }, [notificationState])

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
        dispatch(addNotification(event.data))
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
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1 }}>
        {Object.entries(notifications).reverse().map(([k,v]) => (
          <Toast key={k}>
            <Toast.Header closeButton={false}>
              <img src={BlueCircle}></img>
              <small className="text-muted">{v.createdAt}</small>
            </Toast.Header>
            <Toast.Body>{v.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
}