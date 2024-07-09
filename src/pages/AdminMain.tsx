import * as React from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useNavigate } from "react-router-dom";
import { GetToken } from '../components/JWTToken';

interface Product {
  pType: string;
  pName: string;
  price: number | string;
  quantity: number | string;
}

export default function AdminMain() {
  const accessToken: string | null = localStorage.getItem("accessToken");
  const name: string | null = localStorage.getItem("name");
  const [productOrderData, setProductOrderData] = React.useState<Object>([]);
  const [dept, setDept] = React.useState<string>("전체");
  const [totalAmount, setTotalAmount] = React.useState<number>(0);
  const [deptName, setDeptName] = React.useState<string>('');

  const navigate = useNavigate();

  const handleSelectDept = (e: any) => {
    if(e === "0") {
      setDept("전체");
      try {
        const response = axios.get(`${process.env.REACT_APP_SERVER_URL}/admin/orders`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        response.then((res) => {
          setProductOrderData(res.data);
          setTotalAmount(0);
          setDeptName('');
        })
      } catch (error) {
        console.log(error);
      }
    }
    else {
      if(e === "1") setDept("Human Resources");
      else if(e === "2") setDept("Finance");
      else if(e === "3") setDept("IT");
      else if(e === "4") setDept("Admin");
      try {
        const response = axios.get(`${process.env.REACT_APP_SERVER_URL}/admin/orders/${e}`, {
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
    }
  };

  const handleSelectStatus = async (e: any) => {
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
      alert(res.data);
    } catch (error) {
      console.log(error); 
    }
  };

  React.useEffect(() => {
    try {
      const response = axios.get(`${process.env.REACT_APP_SERVER_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      response.then((res) => {
        setProductOrderData(res.data);
      })
    } catch (error) {
      console.log(error);
    }
  },[])

  React.useEffect(() => {
    GetToken();
    if(name !== "seyun") navigate("/home"); // 사원이면 사원 페이지
  },[])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Card style={{ fontSize: 20, padding: 5 }}>로고</Card>
        <Card hidden={name === null ? true : false} style={{ fontSize: 20, padding: 5 }}>{name}</Card>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Card hidden={deptName === '' ? true : false} style={{ fontSize: 40, padding: 10, paddingLeft: 100, paddingRight: 100 }}>{deptName} 부서의 총 사용 금액: {totalAmount}원</Card>
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
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table bordered hover style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>*</th>
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
            {Object.entries(productOrderData).map(([k,v]) => (
              <tr key={k}>
                <td>{v.orderId}</td>
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
                  <DropdownButton id="dropdown-basic-button" title={v.status} onSelect={handleSelectStatus}>
                    <Dropdown.Item eventKey={`대기 ${v.orderId}`} active={v.status === "대기"}>대기</Dropdown.Item>
                    <Dropdown.Item eventKey={`반려 ${v.orderId}`} active={v.status === "반려"}>반려</Dropdown.Item>
                    <Dropdown.Item eventKey={`승인 ${v.orderId}`} active={v.status === "승인"}>승인</Dropdown.Item>
                  </DropdownButton>
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
    </div>
  );
}
