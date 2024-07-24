import * as React from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import Table from 'react-bootstrap/Table';
import { GetUserInfo } from '../components/JWTToken';
import TopBar from '../components/TopBar';
import ManagementModal from '../components/ManagementModal';
import PriceComma from '../components/PriceComma';
import styles from '../styles/Management.module.css'

interface Order {
  applicant: string | null;
  applicantDeptName: string | null;
  createdAt: string | null;
  description: string | null;
  orderId: number | null;
  orderStatus: string | null;
  productType: string | null;
  storeName: string | null;
  totalPrice: number | null;
}

export default function Management() {
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  const [orderData, setOrderData] = React.useState<Object>([]);
  const [order, setOrder] = React.useState<Order>({
    applicant: '',
    applicantDeptName: '',
    createdAt: '',
    description: '',
    orderId: 0,
    orderStatus: '',
    productType: '',
    storeName: '',
    totalPrice: 0
  });
  const [modalShow, setModalShow] = React.useState<boolean>(false);

  // 승인 반려 모달 열기
  const handleClick = (o: Order) => {
    setOrder(o);
    setModalShow(true);
  }

  // 모달이 닫힐 때
  const handleClose = () => {
    setModalShow(false);
  };

  // 나에게 상신된 목록 조회
  const loadOrders = async () => {
    if(role === "TEAMLEADER") {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/teamleader/department/progress`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setOrderData(res.data);
      } catch (error: any) {
        alert(error.response.data.message);
      }
    }
    else if(role === "CENTERDIRECTOR") {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/centerdirector/department/progress`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setOrderData(res.data);
      } catch (error: any) {
        alert(error.response.data.message);
      }
    }
  }

  // 처음 페이지 로드 시, 조회 | 모달이 닫히면 조회
  React.useEffect(() => {
    //setSpinnerShow(true);
    if(modalShow === false) {
      loadOrders();
    }
    //setSpinnerShow(false);
  },[modalShow]);

  // 나에게 상신된 목록 조회
  React.useEffect(() => {
    loadOrders();
  },[])

  return (
    <div>
      {TopBar('management')}
      <div className="d-flex container-fluid justify-content-center p-0 py-3">
        <Table bordered hover className="container-sm">
          <thead className={styles.tablehead}>
            <tr>
              <th className={styles.th}>부서</th>
              <th className={styles.th}>사원</th>
              <th className={styles.th}>계정</th>
              <th className={styles.th}>상호명</th>
              <th className={styles.th}>비용</th>
              <th className={styles.th}>적요</th>
              <th className={styles.th}>처리 현황</th>
              <th className={styles.th}>신청 날짜</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(orderData).reverse().map(([k,v]) => (
              <tr key={k} onClick={() => {handleClick(v)}}>
                <td className={styles.td}>{v.applicantDeptName}</td>
                <td className={styles.td}>{v.applicant}</td>
                <td className={styles.td}>{v.productType}</td>
                <td className={styles.td}>{v.storeName}</td>
                <td className={styles.td}>{PriceComma(v.totalPrice)}</td>
                <td className={styles.td}>{v.description}</td>
                <td className={styles.td}>{v.orderStatus}</td>
                <td className={styles.td}>{v.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {ManagementModal(modalShow, handleClose, order)}
    </div>
  );
}
