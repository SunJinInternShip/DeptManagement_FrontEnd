import * as React from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import { GetUserInfo, RemoveUserInfo } from '../components/JWTToken';
import TopBar from '../components/TopBar';
import { HomeEdit, HomeOrder } from '../components/HomeModal';
import qs from 'qs';

interface Order {
  account: string;
  bName: string;
  price: number | string;
  detail: string;
}

// 사원 페이지
export default function Home() {
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  const [orderData, setOrderData] = React.useState<Object>([]);
  const [orderModalShow, setOrderModalShow] = React.useState<boolean>(false);
  const [editModalShow, setEditModalShow] = React.useState<boolean>(false);
  const [checkedOrders, setCheckedOrders] = React.useState<Array<any>>([]);
  const [order, setOrder] = React.useState<Order>({
    account: '',
    bName: '',
    price: '',
    detail: ''
  });
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false)

  // 모달이 닫힐 때
  const handleClose = () => {
    setOrderModalShow(false);
    setEditModalShow(false);
  };

  // 체크 시
  const handleClick = (v: any) => {
    if(checkedOrders.find((item) => item === v.orderId) === undefined) {
      setCheckedOrders([...checkedOrders, v.orderId]);
    }
    else {
      setCheckedOrders(checkedOrders.filter(item => item !== v.orderId));
    }
  };

  // 다시 로드하는 거 필요
  const handleClickBtn = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/employee/submit`, {
        params: { order: checkedOrders },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      reloadOrders();
      alert(res.data);
    } catch (error: unknown) {
      console.log(error);
    }
  }

  const reloadOrders = async () => {
    if(role === "EMPLOYEE") {
      try {
        const response = axios.get(`${process.env.REACT_APP_SERVER_URL}/employee/orders`, {
          params: {
            status: "wait"
          },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        response.then((res) => {
          setOrderData(res.data);
        })
      } catch (error) {
        console.log(error);
      }
    }
    else if(role === "TEAMLEADER") {
      try {
        const response = axios.get(`${process.env.REACT_APP_SERVER_URL}/teamleader/orders`, {
          params: {
            status: "wait"
          },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        response.then((res) => {
          setOrderData(res.data);
        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  // 처음 페이지 로드 시, 조회 | 모달이 닫히면 부서 요청 물품 다시 조회
  React.useEffect(() => {
    setSpinnerShow(true);
    if((orderModalShow === false && editModalShow === false)) {
      reloadOrders();
    }
    setSpinnerShow(false);
  },[orderModalShow, editModalShow]);

  // checkedOrders가 삭제, 상신된 경우 체크 해제
  React.useEffect(() => {
    if(Object.values(orderData).find((item) => item.orderId === checkedOrders[0]) === undefined) {
      setCheckedOrders([]);
    }
  },[orderData])

  // 수정 관련 현재 체크 확인
  React.useEffect(() => {
    setSpinnerShow(true);
    const currentChecked: any = Object.values(orderData).find((item) => item.orderId === checkedOrders[0]);
    
    if(currentChecked !== undefined) {
      setOrder({
        account: currentChecked.productType,
        bName: currentChecked.storeName,
        price: currentChecked.totalPrice,
        detail: currentChecked.description
      })
    }
    else {
      setOrder({
        account: '',
        bName: '',
        price: '',
        detail: ''
      })
    }
    setSpinnerShow(false);
  },[checkedOrders])

  return (
    <div>
      <TopBar/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
        {checkedOrders.length > 0 ?
          <Button disabled={checkedOrders.length > 1 ? true : false} onClick={() => {setEditModalShow(!editModalShow)}}>수정</Button>
          :
          <Button onClick={() => {setOrderModalShow(!orderModalShow)}}>추가</Button>
        }
        <Button disabled={checkedOrders.length > 0 ? false : true} onClick={handleClickBtn}>상신</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table bordered hover style={{ width: '90%' }}>
          <thead>
            <tr>
              <th></th>
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
                <td><Form.Check onClick={() => {handleClick(v)}} readOnly checked={checkedOrders.find((item) => item === v.orderId) !== undefined}/></td>
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
      {HomeOrder(orderModalShow, handleClose)}
      {HomeEdit(editModalShow, handleClose, order, checkedOrders[0])}
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}
