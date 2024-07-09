import * as React from 'react';
import axios from 'axios';
import { ProductOrder, ProductEdit } from '../components/ProductModal';
import Spinner from '../components/Spinner';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { productData } from '../utils/SampleData';

interface Product {
  pType: string;
  pName: string;
  price: number | string;
  quantity: number | string;
}

export default function DepartmentMain() {
  const accessToken: string | null = localStorage.getItem("accessToken");
  const [orderModalShow, setOrderModalShow] = React.useState<boolean>(false);
  const [productOrderData, setProductOrderData] = React.useState<Object>([]);
  const [editModalShow, setEditModalShow] = React.useState<boolean>(false);
  const [product, setProduct] = React.useState<Product>({
    pType: '비품',
    pName: '',
    price: '',
    quantity: ''
  });

  const handleClose = () => {
    setOrderModalShow(false);
    setEditModalShow(false);
  };

  const handleClick = (v: any) => {
    setProduct({pType: v.productType, pName: v.productName, price: v.price, quantity: v.quantity});
    setEditModalShow(!editModalShow);
  }

  React.useEffect(() => {
    if(orderModalShow === false) {
      try {
        const response = axios.get(`${process.env.REACT_APP_SERVER_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        response.then((res) => {
          setProductOrderData(res.data.orders);
        })
      } catch (error) {
        console.log(error);
      }
    }
  },[orderModalShow])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Card style={{ fontSize: 20, padding: 5 }}>로고</Card>
        <Card style={{ fontSize: 20, padding: 5 }}>test님 반갑습니다!</Card>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Card style={{ fontSize: 40, padding: 10, paddingLeft: 100, paddingRight: 100 }}>YYY 부서의 총 사용 금액: 123,456,789 원</Card>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button onClick={() => {setOrderModalShow(!orderModalShow)}}>버튼1</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table bordered hover style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>*</th>
              <th>신청날짜</th>
              <th>처리날짜</th>
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
            {Object.entries(productOrderData).map(([k,v]) => (
              <tr key={k} onClick={() => {handleClick(v)}}>
                <td>{k}</td>
                <td>{v.createTime}</td>
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
        <Button>버튼2</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table style={{ width: '100%' }}>
        </table>
        {ProductOrder(orderModalShow, handleClose)}
        {ProductEdit(editModalShow, handleClose, product)}
      </div>
    </div>
  );
}
