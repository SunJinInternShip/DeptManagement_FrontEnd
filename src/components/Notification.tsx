import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

export default function Notification(notifications: Array<any>) {
  return (
    <div>
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1 }}>
        {Object.entries(notifications).reverse().map(([k,v]) => (
          <Toast key={k}>
            <Toast.Header closeButton={false}>
              <small className="text-muted">{v.createdAt}</small>
            </Toast.Header>
            <Toast.Body>{v.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
}