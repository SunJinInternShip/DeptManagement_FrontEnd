import * as React from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import { GetUserInfo } from '../components/JWTToken';
import TopBar from '../components/TopBar';
import { HomeEdit, HomeOrder } from '../components/HomeModal';
import qs from 'qs';
import PriceComma from '../components/PriceComma';
import styles from '../styles/Home.module.css'

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

  const navigate = useNavigate();

  // 모달이 닫힐 때
  const handleClose = () => {
    setOrderModalShow(false);
    setEditModalShow(false);
    setCheckedOrders([]);
  };

  // 체크 시
  const handleClick = (v: any) => {
    setSpinnerShow(true);
    if(checkedOrders.find((item) => item === v.orderId) === undefined) {
      setCheckedOrders([...checkedOrders, v.orderId]);
    }
    else {
      setCheckedOrders(checkedOrders.filter(item => item !== v.orderId));
    }
    setSpinnerShow(false);
  };

  // 상신
  const handleClickBtn = async () => {
    setSpinnerShow(true);
    let apiURL: string = "";
    
    if(role === "EMPLOYEE") apiURL = `${process.env.REACT_APP_SERVER_URL}/employee/submit`;
    else if(role === "TEAMLEADER") apiURL = `${process.env.REACT_APP_SERVER_URL}/teamleader/submit`;

    try {
      const res = await axios.get(apiURL, {
        params: { order: checkedOrders },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      loadOrders();
      alert(res.data);
    } catch (error: any) {
      alert(error.response.data.message);
    }
    setSpinnerShow(false);
  }

  // 물품 조회
  const loadOrders = async () => {
    setSpinnerShow(true);
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
      } catch (error: any) {
        alert(error.response.data.message);
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
      } catch (error: any) {
        alert(error.response.data.message);
      }
    }
    setSpinnerShow(false);
  }

  // 관리자 홈 페이지 제한
  React.useEffect(() => {
    setSpinnerShow(true);
    if(role === "CENTERDIRECTOR") navigate("/search", { replace: true });
    setSpinnerShow(false);
  },[])

  // 처음 페이지 로드 시, 조회 | 모달이 닫히면 부서 요청 물품 조회
  React.useEffect(() => {
    setSpinnerShow(true);
    if((orderModalShow === false && editModalShow === false)) {
      loadOrders();
    }
    setSpinnerShow(false);
  },[orderModalShow, editModalShow]);

  // checkedOrders가 삭제, 상신된 경우 체크 해제
  React.useEffect(() => {
    setSpinnerShow(true);
    if(Object.values(orderData).find((item) => item.orderId === checkedOrders[0]) === undefined) {
      setCheckedOrders([]);
    }
    setSpinnerShow(false);
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
      {TopBar('home')}
      <div className='container-sm'>
        {checkedOrders.length > 0 ?
          <button className={checkedOrders.length > 1 ? styles.disablededitbtn : styles.enablededitbtn}
           disabled={checkedOrders.length > 1 ? true : false} onClick={() => {setEditModalShow(!editModalShow)}}>수정</button>
          :
          <button className={styles.addbtn}
           onClick={() => {setOrderModalShow(!orderModalShow)}}>추가</button>
        }
        <button className={checkedOrders.length > 0 ? styles.enabledsubmitbtn : styles.disabledsubmitbtn}
         disabled={checkedOrders.length > 0 ? false : true} onClick={handleClickBtn}>상신</button>
      </div>
      <div className={styles.tablediv}>
        <Table bordered hover className="container-sm">
          <thead>
            <tr className={styles.tablehead}>
              <th className={styles.th}></th>
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
              <tr key={k} onClick={() => {handleClick(v)}}
               className={checkedOrders.find((item) => item === v.orderId) !== undefined ? styles.tablechecked : ''}>
                <td className={styles.td}>
                  <Form.Check onClick={() => {handleClick(v)}} readOnly
                   checked={checkedOrders.find((item) => item === v.orderId) !== undefined}/>
                </td>
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
      {HomeOrder(orderModalShow, handleClose)}
      {HomeEdit(editModalShow, handleClose, order, checkedOrders[0])}
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}
