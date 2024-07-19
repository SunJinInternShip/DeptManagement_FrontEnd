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
import Accordion from 'react-bootstrap/Accordion';
import InputGroup from 'react-bootstrap/InputGroup';
import SearchModal from '../components/SearchModal';

interface Requirement {
  userId: number;
  userName: string;
  deptId: number;
  deptName: string;
  reqStatus: Status[];
}

interface Status {
  statusId: string;
  statusName: string;
}

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

// 사원 페이지
export default function Search() {
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  const [orderData, setOrderData] = React.useState<Array<any>>([]);
  const [requirement, setRequirement] = React.useState<Requirement>({
    // Id = 백엔드 | Name = 프론트
    userId: 0,
    userName: "전체",
    deptId: 0,
    deptName: "전체",
    reqStatus: [
      {
        statusId: "first",
        statusName: "1차 처리중"
      },
      {
        statusId: "second",
        statusName: "2차 처리중"
      },
      {
        statusId: "approve",
        statusName: "승인"
      },
      {
        statusId: "denied",
        statusName: "반려"
      }
    ]
  })
  const [deptData, setDeptData] = React.useState<any>([]);
  const [memberData, setMemberData] = React.useState<any>([]);
  const [modalShow, setModalShow] = React.useState<boolean>(false);
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

  // 데이터 조회
  const searchToDB = async () => {
    const oStatus = Object.entries(requirement.reqStatus).map(([k,v]) => (v.statusId))
    const uId = requirement.userName === "전체" ? null : requirement.userId;
    const dId = requirement.deptName === "전체" ? null : requirement.deptId;

    if(oStatus.length === 0) {
      alert("하나 이상의 [처리 현황]을 선택해주세요.")
      return
    }

    let obj: Object = {}

    obj = {...obj, status: oStatus}
    if(uId !== null) obj = {...obj, member: uId}
    if(dId !== null) obj = {...obj, department: dId}
  
    if(role === "EMPLOYEE") {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/employee/orders`, {
          params: obj,
          paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
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
            return qs.stringify(params, { arrayFormat: 'repeat' })
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
    else if(role === "CENTERDIRECTOR") {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/centerdirector/department/details`, {
          params: obj,
          paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
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

  // 상세 조회 모달 열기
  const handleClick = (o: Order) => {
    setOrder(o);
    setModalShow(true);
  }

  // 모달이 닫힐 때
  const handleClose = () => {
    setModalShow(false);
  };

  // 부서 선택
  const handleSelectDept = (e: any) => {
    if(e.target.value === "전체") {
      setRequirement((requirement: Requirement) => ({
        ...requirement,
        deptId: 0,
        deptName: e.target.value
      }));
    }
    else {
      Object.entries(deptData).forEach(e1 => {
        e1.forEach((e2: any) => {
          if(e2.deptName === e.target.value) {
            setRequirement((requirement: Requirement) => ({
              ...requirement,
              deptId: e2.deptId,
              deptName: e2.deptName
            }));
          }
        });
      });
    }
  };

  // 이름 선택
  const handleSelectName = (e: any) => {
    if(e.target.value === "전체") {
      setRequirement((requirement: Requirement) => ({
        ...requirement,
        userId: 0,
        userName: e.target.value
      }));
    }
    else {
      Object.entries(memberData).forEach(e1 => {
        e1.forEach((e2: any) => {
          if(e2.memberName === e.target.value) {
            setRequirement((requirement: Requirement) => ({
              ...requirement,
              userId: e2.memberId,
              userName: e2.memberName
            }));
          } 
        });
      });
    }
  };

  // 상태 선택
  const handleSelectStatus = (e: any) => {
    const array: Array<string> = e.split(" "); // [statusId, statusName1, statusName2]
    // 전체 선택 시
    if(array[0] === "전체") {
      // 이미 전부 선택되어 있으면 전체 선택 취소
      if(requirement.reqStatus.length === 4) {
        setRequirement((requirement: Requirement) => ({
          ...requirement,
          reqStatus: []
        }));
      }
      // 전부 선택되어 있지 않으면 전체 선택
      else {
        setRequirement((requirement: Requirement) => ({
          ...requirement,
          reqStatus: [
            {
              statusId: "first",
              statusName: "1차 처리중"
            },
            {
              statusId: "second",
              statusName: "2차 처리중"
            },
            {
              statusId: "approve",
              statusName: "승인"
            },
            {
              statusId: "denied",
              statusName: "반려"
            }
          ]
        }));
      }
    }
    // 그 외에 선택 시
    else {
      // status에 이미 있다면 삭제
      if(requirement.reqStatus.filter(status => status.statusId === array[0]).length === 1) {
        setRequirement((requirement: Requirement) => ({
          ...requirement,
          reqStatus: requirement.reqStatus.filter(status => status.statusId !== array[0])
        }));
      }
      // 없다면 추가
      else {
        setRequirement((requirement: Requirement) => ({
          ...requirement,
          reqStatus: [
              ...requirement.reqStatus, {
                statusId: array[0],
                statusName: array[2] === "처리중" ? `${array[1]} ${array[2]}` : array[1]
              }
          ]
        }));
      }
    }
  };

  // 최초 페이지 로드 시, 데이터 조회
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

  return (
    <div>
      <TopBar/>
      <Accordion style={{ display: 'flex', justifyContent: 'center' }}>
        <Accordion.Item eventKey='0' style={{width: '90%'}}>
          <Accordion.Header>
            <span style={{ border: '1px solid black', borderRadius: '10px', padding: '5px', marginRight: '20px' }}>{requirement.deptName}</span>
            <span style={{ border: '1px solid black', borderRadius: '10px', padding: '5px', marginRight: '20px' }}>{requirement.userName}</span>
            {Object.entries(requirement.reqStatus).map(([k, v]) => (
              <span key={k} style={{ border: '1px solid black', borderRadius: '10px', padding: '5px', marginRight: '20px' }}>
                {v.statusName}
              </span>
            ))}
          </Accordion.Header>

          <Accordion.Body hidden={role !== "CENTERDIRECTOR" ? true : false}>
            <div>
              <InputGroup>
                <InputGroup.Text>부서</InputGroup.Text>
                <Form.Select onChange={handleSelectDept}>
                  <option>
                    전체
                  </option>
                  {Object.entries(deptData).map(([k,v]: any) => (
                    <option key={k}>
                      {v.deptName}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </div>
          </Accordion.Body>
          <Accordion.Body hidden={role === "EMPLOYEE" ? true : false}>
            <div>
              <InputGroup>
                <InputGroup.Text>사원</InputGroup.Text>
                <Form.Select onChange={handleSelectName}>
                  <option>
                    전체
                  </option>
                  {Object.entries(memberData).map(([k,v]: any) => (
                    <option key={k}>
                      {v.memberName}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </div>
          </Accordion.Body>
          <Accordion.Body>
            <div>
              <InputGroup>
                <InputGroup.Text>처리 현황</InputGroup.Text>
                <Button
                 style={requirement.reqStatus.length === 4 ? {} : { background: '#FFFFFF', color: '#0D6EFD' }}
                 onClick={() => {handleSelectStatus('전체')}}>전체</Button>
                <Button
                 style={requirement.reqStatus.filter(status => status.statusId === "first").length === 1 ? {} : { background: '#FFFFFF', color: '#0D6EFD'}}
                 onClick={() => {handleSelectStatus('first 1차 처리중')}}>1차 처리중</Button>
                <Button
                 style={requirement.reqStatus.filter(status => status.statusId === "second").length === 1 ? {} : { background: '#FFFFFF', color: '#0D6EFD'}}
                 onClick={() => {handleSelectStatus('second 2차 처리중')}}>2차 처리중</Button>
                <Button
                 style={requirement.reqStatus.filter(status => status.statusId === "approve").length === 1 ? {} : { background: '#FFFFFF', color: '#0D6EFD'}}
                 onClick={() => {handleSelectStatus('approve 승인')}}>승인</Button>
                <Button
                 style={requirement.reqStatus.filter(status => status.statusId === "denied").length === 1 ? {} : { background: '#FFFFFF', color: '#0D6EFD'}}
                 onClick={() => {handleSelectStatus('denied 반려')}}>반려</Button>
              </InputGroup>
            </div>
          </Accordion.Body>
          <Accordion.Body>
            <Button onClick={searchToDB}>조회</Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
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
              <th>비고</th>
              <th>신청 날짜</th>
              <th>처리 날짜</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(orderData).reverse().map(([k,v]) => (
              <tr key={k} onClick={() => handleClick(v)}>
                <td>{v.applicantDeptName}</td>
                <td>{v.applicant}</td>
                <td>{v.productType}</td>
                <td>{v.storeName}</td>
                <td>{v.totalPrice}</td>
                <td>{v.description}</td>
                <td>{v.orderStatus}</td>
                <td>{v.deniedDescription}</td>
                <td>{v.createdAt}</td>
                <td>{v.procDate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {SearchModal(modalShow, handleClose, order)}
      </div>
    </div>
  );
}
