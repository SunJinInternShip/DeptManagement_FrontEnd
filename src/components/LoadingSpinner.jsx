import Spinner from 'react-bootstrap/Spinner';

export default function LoadingSpinner(spinnerShow) {
  return (
    <div className="spinner-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }} hidden={!spinnerShow}>
      <Spinner animation="border" role="status" />
    </div>
  );
}
