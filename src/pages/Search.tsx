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
  statusId: string;
  statusName: string;
  userId: number;
  userName: string;
  deptId: number;
  deptName: string;
}

// 사원 페이지
export default function Search() {
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  const [orderData, setOrderData] = React.useState<Array<any>>([]);
  const [requirement, setRequirement] = React.useState<Requirement>({
    // Id = 백엔드 | Name = 프론트
    statusId: "전체",
    statusName: "전체",
    userId: 0,
    userName: "전체",
    deptId: 0,
    deptName: "전체"
  })
  const [deptData, setDeptData] = React.useState<any>([]);
  const [memberData, setMemberData] = React.useState<any>([]);

  // 데이터 조회
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
    else if(role === "TEAMLEADER") {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/teamleader/department/details`, {
          params: obj,
          paramsSerializer: params => {
            return qs.stringify(params)
          },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log(res);
        setOrderData(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    else if(role === "CENTERDIRECTOR") {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/centerdirector/department/details`, {
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
    const array: any[] = e.split(" "); // [deptId, deptName1, deptName2]
    setRequirement((requirement: Requirement) => ({
      ...requirement,
      deptId: array[0],
      deptName: array[1] === "전체" ? array[1] : `${array[1]} ${array[2]}`
    }));
  };

  const handleSelectName = (e: any) => {
    const array: any[] = e.split(" "); // [userId, userName]
    setRequirement((requirement: Requirement) => ({
      ...requirement,
      userId: array[0],
      userName: array[1]
    }));
  };

  const handleSelectStatus = (e: any) => {
    const array: Array<string> = e.split(" "); // [statusId, statusName]
    setRequirement((requirement: Requirement) => ({
      ...requirement,
      statusId: array[0],
      statusName: array[1]
    }));
  };
  
  React.useEffect(() => {
    searchToDB();
    if(role === "TEAMLEADER") {
      const loadDeptAndUserInfo = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/teamleader/department`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          let mData: Array<any> = [];
          res.data.members.forEach((e: any) => {
            mData.push({
              deptId: res.data.deptId,
              memberId: e.memberId,
              memberName: e.memberName
            })
          });
          setMemberData(mData);
        } catch (error) {
          console.log(error);
        }
      }
      loadDeptAndUserInfo();
    }
    else if(role === "CENTERDIRECTOR") {
      const loadDeptAndUserInfo = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/centerdirector/department`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          let dData: Array<any> = [];
          let mData: Array<any> = [];
          res.data.forEach((e1: any) => {
            dData.push({
              deptId: e1.deptId,
              deptName: e1.deptName
            })
            e1.members.forEach((e2: any) => {
              mData.push({
                deptId: e1.deptId,
                memberId: e2.memberId,
                memberName: e2.memberName
              })
            });
          });
          setMemberData(mData);
          setDeptData(dData);
        } catch (error) {
          console.log(error);
        }
      }
      loadDeptAndUserInfo();
    }
  },[]);

  React.useEffect(() => {
    //console.log(deptData);
    //console.log(memberData);
    //console.log(deptMemberData.arguments[0]);
    //console.log(Array.);
    //console.log(deptMemberData.length);
    //console.log(deptMemberData.map(([k,v]: any) => (k)));
    //console.log(deptMemberData.map((k: any) => (k)));
    //deptMemberData.forEach((element: any) => {
      //console.log(element);
      //console.log(element.members);
    //});
    //console.log(deptMemberData.map((dept: any) => (dept.deptName)));
    //console.log(deptMemberData.map((dept: any) => (dept.members.map((member: any) => (member)))));
    //const a: any = [{id: 1, name: "kim"}, {id: 2, name: "lee"}, {id: 2, name: "lee2"}];
    //console.log(a.filter((item: any) => item.id === 2));
    
    // user = [{ deptId, memberId, memberName }, ...]
    // dept = [{ deptId, deptName }, ...]

    /*
    {memberData.map((e: any) => {
              <Dropdown.Item eventKey={`${e.memberId} ${e.memberName}`} active={requirement.userName === `${e.memberName}`}>
                {e.memberName}
              </Dropdown.Item>
            })}
    */
  },[memberData]);

  return (
    <div>
      <TopBar/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div hidden={role !== "CENTERDIRECTOR" ? true : false}>
          부서:
          <DropdownButton id="dropdown-basic-button" title={requirement.deptName} onSelect={handleSelectDept}>
            <Dropdown.Item eventKey={`${0} 전체`} active={requirement.deptName === "전체"}>
              전체
            </Dropdown.Item>
            {Object.entries(deptData).map(([k,v]: any) => (
              <Dropdown.Item key={k} eventKey={`${v.deptId} ${v.deptName}`}
               active={requirement.deptName === `${v.deptName}`}>
                {v.deptName}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
        <div hidden={role === "EMPLOYEE" ? true : false}>
          이름:
          <DropdownButton id="dropdown-basic-button" title={requirement.userName} onSelect={handleSelectName}>
            <Dropdown.Item eventKey={`${0} 전체`} active={requirement.userName === "전체"}>
              전체
            </Dropdown.Item>
            {Object.entries(memberData).map(([k,v]: any) => (
              <Dropdown.Item key={k} eventKey={`${v.memberId} ${v.memberName}`}
               active={requirement.userName === `${v.memberName}`}>
                {v.memberName}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
        <div>
          처리 현황:
          <DropdownButton id="dropdown-basic-button" title={requirement.statusName} onSelect={handleSelectStatus}>
            <Dropdown.Item eventKey="전체 전체" active={requirement.statusName === "전체"}>
              전체
            </Dropdown.Item>
            <Dropdown.Item eventKey="progress 처리중" active={requirement.statusName === "처리중"}>
              처리중
            </Dropdown.Item>
            <Dropdown.Item eventKey="approve 승인" active={requirement.statusName === "승인"}>
              승인
            </Dropdown.Item>
            <Dropdown.Item eventKey="denied 반려" active={requirement.statusName === "반려"}>
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
                  <td>{v.procDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
    </div>
  );
}
