import * as React from 'react';
import axios from 'axios';
import { ProductOrder, ProductEdit } from '../components/ProductModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useNavigate } from "react-router-dom";
import { GetUserInfo, RemoveUserInfo } from '../components/JWTToken';
import ReceiptModal from '../components/ReceiptModal';

interface Product {
  pType: string;
  pName: string;
  price: number | string;
  quantity: number | string;
}

// 사원 페이지
export default function DepartmentMain() {
  const userName = GetUserInfo().name;
  const accessToken = GetUserInfo().accessToken;

  const [orderModalShow, setOrderModalShow] = React.useState<boolean>(false);
  const [productOrderData, setProductOrderData] = React.useState<Object>([]);
  const [editModalShow, setEditModalShow] = React.useState<boolean>(false);
  const [product, setProduct] = React.useState<Product>({
    pType: '비품',
    pName: '',
    price: '',
    quantity: ''
  });
  const [totalAmount, setTotalAmount] = React.useState<number>(0);
  const [orderId, setOrderId] = React.useState<number>(0);
  const [deptName, setDeptName] = React.useState<string>('');
  const [receiptModalShow, setReceiptModalShow] = React.useState<boolean>(false);
  const [receiptData, setReceiptData] = React.useState<Object>([]);
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  const navigate = useNavigate();

  // 모달이 닫힐 때
  const handleClose = () => {
    setOrderModalShow(false);
    setEditModalShow(false);
    setReceiptModalShow(false);
  };

  // 물품 주문 수정
  const handleClick = (v: any) => {
    setSpinnerShow(true);
    if(v.status === "대기") {
      setProduct({pType: v.productType, pName: v.productName, price: v.price, quantity: v.quantity});
      setOrderId(v.orderId);
      setEditModalShow(!editModalShow);
    }
    setSpinnerShow(false);
  };

  // 로그아웃
  const handleLogout = async () => {
    setSpinnerShow(true);
    try {
      const res = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/logout`, {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      await RemoveUserInfo();
      alert(res.data);
      setSpinnerShow(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error); 
    }
  };

  // 로그인한 유저가 관리자면 home/admin으로, 로그인한 유저가 없다면 기본 페이지(로그인 페이지)로
  React.useEffect(() => {
    if(userName === "admin") navigate("/home/admin", { replace: true });
    if(userName === null) navigate("/", { replace: true });
  });

  // 모달이 닫히면 부서 요청 물품 다시 조회
  React.useEffect(() => {
    setSpinnerShow(true);
    if((orderModalShow === false && editModalShow === false)) {
      try {
        const response = axios.get(`${process.env.REACT_APP_SERVER_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        response.then((res) => {
          setProductOrderData(res.data.orders);
          setTotalAmount(res.data.totalAmount);
          setDeptName(res.data.orders[0] === undefined ? '' : res.data.orders[0].applicantDeptName);
        })
      } catch (error) {
        console.log(error);
      }
      //try catch ---> receipt
    }
    setSpinnerShow(false);
  },[orderModalShow, editModalShow, receiptModalShow]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Card style={{ fontSize: 20, padding: 5 }}>로고</Card>
        <div style={{ display: 'flex', flexDirection: 'row'}}>
        <Card hidden={userName === null ? true : false} style={{ fontSize: 20, padding: 5 }}>{userName}</Card>
        <Button hidden={userName === null ? true : false} style={{ fontSize: 20 }} onClick={handleLogout}>로그아웃</Button>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Card hidden={deptName === '' ? true : false} style={{ fontSize: 40, padding: 10, paddingLeft: 100, paddingRight: 100 }}>{deptName} 부서의 총 사용 금액: {totalAmount}원</Card>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button onClick={() => {setOrderModalShow(!orderModalShow)}}>추가하기</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table bordered hover style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>신청/수정 날짜</th>
              <th>처리 날짜</th>
              <th>부서</th>
              <th>신청자</th>
              <th>종류</th>
              <th>제품명</th>
              <th>금액</th>
              <th>수량</th>
              <th>총 금액</th>
              <th>처리 현황</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(productOrderData).reverse().map(([k,v]) => (
              <tr key={k} onClick={() => {handleClick(v)}}>
                <td>{v.latestTime}</td>
                <td>{v.processDate}</td>
                <td>{v.applicantDeptName}</td>
                <td>{v.applicant}</td>
                <td>{v.productType}</td>
                <td>{v.productName}</td>
                <td>{v.price}</td>
                <td>{v.quantity}</td>
                <td>{v.totalPrice}</td>
                <td>{v.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button onClick={() => {setReceiptModalShow(!receiptModalShow)}}>추가하기</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table bordered hover style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>날짜</th>
              <th>부서</th>
              <th>가게명</th>
              <th>금액</th>
              <th>이미지</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>날짜</td>
                <td>부서</td>
                <td>가게명</td>
                <td>금액</td>
                <td>이미지</td>
              </tr>
          </tbody>
        </Table>
      </div>
      {ProductOrder(orderModalShow, handleClose)}
      {ProductEdit(editModalShow, handleClose, product, orderId)}
      {ReceiptModal(receiptModalShow, handleClose)}
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}
