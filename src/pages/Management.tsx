import * as React from 'react';
import axios from 'axios';
import { ProductOrder, ProductEdit } from '../components/ProductModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import { GetUserInfo, RemoveUserInfo } from '../components/JWTToken';
import ReceiptModal from '../components/ReceiptModal';
import TopBar from '../components/TopBar';
import ManagementModal from '../components/ManagementModal';

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
      } catch (error) {
        console.log(error);
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
      } catch (error) {
        console.log(error);
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
    if(role === "TEAMLEADER") {
      const loadOrders = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/teamleader/department/progress`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setOrderData(res.data);
        } catch (error) {
          console.log(error);
        }
      }
      loadOrders();
    }
    else if(role === "CENTERDIRECTOR") {
      const loadOrders = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/centerdirector/department/progress`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setOrderData(res.data);
        } catch (error) {
          console.log(error);
        }
      }
      loadOrders();
    }
  },[])

  return (
    <div>
      <TopBar />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table bordered hover style={{ width: '90%' }}>
          <thead>
            <tr>
              <th>부서</th>
              <th>사원</th>
              <th>계정</th>
              <th>상호명</th>
              <th>비용</th>
              <th>적요</th>
              <th>처리 현황</th>
              <th>신청 날짜</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(orderData).reverse().map(([k,v]) => (
              <tr key={k} onClick={() => {handleClick(v)}}>
                <td>{v.applicantDeptName}</td>
                <td>{v.applicant}</td>
                <td>{v.productType}</td>
                <td>{v.storeName}</td>
                <td>{v.totalPrice}</td>
                <td>{v.description}</td>
                <td>{v.orderStatus}</td>
                <td>{v.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {ManagementModal(modalShow, handleClose, order)}
    </div>
  );
}
