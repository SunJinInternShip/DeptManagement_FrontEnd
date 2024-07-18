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

interface Order {
  account: string;
  bName: string;
  price: number | string;
  detail: string;
}

export default function Management() {
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  const [orderData, setOrderData] = React.useState<Object>([]);

  const handleClick = (v: any) => {
    // 승인 반려 모달 열기
    console.log(v);
  }

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
    </div>
  );
}
