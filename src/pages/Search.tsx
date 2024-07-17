import * as React from 'react';
import axios from 'axios';
import { ProductOrder, ProductEdit } from '../components/ProductModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import { GetUserInfo, RemoveUserInfo } from '../components/JWTToken';
import ReceiptModal from '../components/ReceiptModal';
import TopBar from '../components/TopBar';
import qs from 'qs';

interface Requirement {
  statusName: string;
  statusId: string;
  userName: string;
  userId: number;
  deptName: string;
  deptId: number;
}

// 사원 페이지
export default function Search() {
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  const [orderData, setOrderData] = React.useState<Object>([]);
  const [requirement, setRequirement] = React.useState<Requirement>({
    // Name = 프론트 || Id = 백엔드
    statusName: "전체",
    statusId: "전체",
    userName: "전체",
    userId: 0,
    deptName: "전체",
    deptId: 0,
  })

  const searchToDB = async () => {
    const oStatus = requirement.statusName === "전체" ? null : requirement.statusId;
    const uId = requirement.userName === "전체" ? null : requirement.userId;
    const dId = requirement.deptName === "전체" ? null : requirement.deptId;

    let obj: Object = {}

    if(oStatus !== null) obj = {...obj, status: oStatus}
    if(uId !== null) obj = {...obj, member: uId}
    if(dId !== null) obj = {...obj, department: dId}
    
    if(role === "EMPLOYEE") {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/employee/orders`, {
          params: obj,
          paramsSerializer: params => {
            return qs.stringify(params)
          },
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

  const handleSelectDept = (e: any) => {
    setRequirement((requirement: Requirement) => ({
      ...requirement,
      deptId: e
    }));
  };

  const handleSelectName = (e: any) => {
    setRequirement((requirement: Requirement) => ({
      ...requirement,
      userId: e
    }));
  };

  const handleSelectStatus = (e: any) => {
    const array: Array<string> = e.split(" "); // [statusName, statusId]
    setRequirement((requirement: Requirement) => ({
      ...requirement,
      statusName: array[0],
      statusId: array[1]
    }));
  };
  
  React.useEffect(() => {
    searchToDB();
  },[]);

  return (
    <div>
      <TopBar/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div hidden={role !== "CENTERDIRECTOR" ? true : false}>
          부서:
          <DropdownButton id="dropdown-basic-button" title={requirement.deptId} onSelect={handleSelectDept}>
            <Dropdown.Item eventKey="0">전체</Dropdown.Item>
            <Dropdown.Item eventKey="1" active={requirement.deptId === 1}>
             Human Resources
            </Dropdown.Item>
            <Dropdown.Item eventKey="2" active={requirement.deptId === 2}>
             Finance
            </Dropdown.Item>
          </DropdownButton>
        </div>
        <div hidden={role === "EMPLOYEE" ? true : false}>
          이름:
          <DropdownButton id="dropdown-basic-button" title="전체" onSelect={handleSelectName}>
            <Dropdown.Item eventKey="0">전체</Dropdown.Item>
            <Dropdown.Item eventKey="1">김아무개</Dropdown.Item>
          </DropdownButton>
        </div>
        <div>
          처리 현황:
          <DropdownButton id="dropdown-basic-button" title={requirement.statusName} onSelect={handleSelectStatus}>
            <Dropdown.Item eventKey="전체 전체" active={requirement.statusName === "전체"}>
             전체
            </Dropdown.Item>
            <Dropdown.Item eventKey="처리중 progress" active={requirement.statusName === "처리중"}>
             처리중
            </Dropdown.Item>
            <Dropdown.Item eventKey="승인 approve" active={requirement.statusName === "승인"}>
             승인
            </Dropdown.Item>
            <Dropdown.Item eventKey="반려 denied" active={requirement.statusName === "반려"}>
             반려
            </Dropdown.Item>
          </DropdownButton>
        </div>
        <div>
          <Button onClick={searchToDB}>조회</Button>
        </div>
      </div>
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
                <th>반려 사유</th>
                <th>신청 날짜</th>
                <th>처리 날짜</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(orderData).reverse().map(([k,v]) => (
                <tr key={k}>
                  <td>{v.applicantDeptName}</td>
                  <td>{v.applicant}</td>
                  <td>{v.productType}</td>
                  <td>{v.storeName}</td>
                  <td>{v.totalPrice}</td>
                  <td>{v.description}</td>
                  <td>{v.orderStatus}</td>
                  <td>{v.rejectionDescription}</td>
                  <td>{v.createdAt}</td>
                  <td>{v.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
    </div>
  );
}
