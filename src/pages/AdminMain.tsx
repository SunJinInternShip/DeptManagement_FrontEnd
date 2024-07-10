import * as React from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useNavigate } from "react-router-dom";
import { GetUserInfo, RemoveUserInfo } from '../components/JWTToken';

// 관리자 페이지
export default function AdminMain() {
  const userName = GetUserInfo().name;
  const accessToken = GetUserInfo().accessToken;

  const [productOrderData, setProductOrderData] = React.useState<Object>([]);
  const [dept, setDept] = React.useState<string>("전체");
  const [totalAmount, setTotalAmount] = React.useState<number>(0);
  const [status, setStatus] = React.useState<number>(0);
  const [orderStatus, setOrderStatus] = React.useState<string>("");
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  const navigate = useNavigate();

  // 조회할 부서 선택
  const handleSelectDept = (e: any) => {
    if(e === "0") {
      setStatus(0);
      setDept("전체");
    }
    else if(e === "1") {
      setStatus(1);
      setDept("Human Resources");
    }
    else if(e === "2") {
      setStatus(2);
      setDept("Finance");
    }
    else if(e === "3") {
      setStatus(3);
      setDept("IT");
    }
    else if(e === "4") {
      setStatus(4);
      setDept("Admin");
    }
  };

  // 물품 상태 처리
  const handleSelectStatus = async (e: any) => {
    setSpinnerShow(true);
    const param: Array<string> = e.split(" "); // [status, orderId]
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/admin/orders/${param[1]}`, {
        "orderStatus": param[0]
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setOrderStatus(param[0]);
      alert(res.data);
    } catch (error) {
      console.log(error);
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

  // 로그인한 유저가 관리자가 아니면, home으로
  React.useEffect(() => {
    if(userName !== "admin") navigate("/home", { replace: true });
  });

  // 선택한 부서의 물품 주문 조회
  React.useEffect(() => {
    setSpinnerShow(true);
    try {
      // 전체
      if(status === 0) {
        const response = axios.get(`${process.env.REACT_APP_SERVER_URL}/admin/orders`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        response.then((res) => {
          setProductOrderData(res.data);
          setTotalAmount(0);
        })
      }
      // Human Resources, Finance, IT, Admin
      else {
        const response = axios.get(`${process.env.REACT_APP_SERVER_URL}/admin/orders/${status}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        response.then((res) => {
          setProductOrderData(res.data.orders);
          setTotalAmount(res.data.totalAmount);
        })
      }
    } catch (error) {
      console.log(error);
    }
    setSpinnerShow(false);
  },[dept,orderStatus]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Card style={{ fontSize: 20, padding: 5 }}>로고</Card>
        <div style={{ display: 'flex', flexDirection: 'row'}}>
          <Card hidden={userName === null ? true : false} style={{ fontSize: 20, padding: 5 }}>{userName}</Card>
          <Button hidden={userName === null ? true : false} style={{ fontSize: 20 }} onClick={handleLogout}>로그아웃</Button>
        </div>
      </div>
      <div>
        <DropdownButton id="dropdown-basic-button" title={dept} onSelect={handleSelectDept} style={{width: "100%"}}>
          <Dropdown.Item eventKey="0" active={dept === "전체"}>전체</Dropdown.Item>
          <Dropdown.Item eventKey="1" active={dept === "Human Resources"}>Human Resources</Dropdown.Item>
          <Dropdown.Item eventKey="2" active={dept === "Finance"}>Finance</Dropdown.Item>
          <Dropdown.Item eventKey="3" active={dept === "IT"}>IT</Dropdown.Item>
          <Dropdown.Item eventKey="4" active={dept === "Admin"}>Admin</Dropdown.Item>
        </DropdownButton>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Card hidden={dept === "전체" ? true : false} style={{ fontSize: 40, padding: 10, paddingLeft: 100, paddingRight: 100 }}>{dept} 부서의 총 사용 금액: {totalAmount}원</Card>
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
              <tr key={k}>
                <td>{v.latestTime}</td>
                <td>{v.processDate}</td>
                <td>{v.applicantDeptName}</td>
                <td>{v.applicant}</td>
                <td>{v.productType}</td>
                <td>{v.productName}</td>
                <td>{v.price}</td>
                <td>{v.quantity}</td>
                <td>{v.totalPrice}</td>
                <td>
                  {v.status === "대기" ?
                    <DropdownButton id="dropdown-basic-button" title={v.status} onSelect={handleSelectStatus}>
                      <Dropdown.Item eventKey={`대기 ${v.orderId}`} active={v.status === "대기"}>대기</Dropdown.Item>
                      <Dropdown.Item eventKey={`반려 ${v.orderId}`} active={v.status === "반려"}>반려</Dropdown.Item>
                      <Dropdown.Item eventKey={`승인 ${v.orderId}`} active={v.status === "승인"}>승인</Dropdown.Item>
                    </DropdownButton>
                    :
                    v.status
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table style={{ width: '100%' }}>
        </table>
      </div>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}
