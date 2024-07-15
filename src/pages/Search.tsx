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

interface Product {
  pType: string;
  pName: string;
  price: number | string;
  quantity: number | string;
}

// 사원 페이지
export default function Search() {

  return (
    <div>
      <TopBar/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        부서:
        <div>
          <DropdownButton id="dropdown-basic-button" title="전체" onSelect={() => {}}>
            <Dropdown.Item eventKey="0">전체</Dropdown.Item>
            <Dropdown.Item eventKey="1">Human Resources</Dropdown.Item>
            <Dropdown.Item eventKey="2">Finance</Dropdown.Item>
            <Dropdown.Item eventKey="3">IT</Dropdown.Item>
            <Dropdown.Item eventKey="4">Admin</Dropdown.Item>
          </DropdownButton>
        </div>
        이름:
        <div>
          <DropdownButton id="dropdown-basic-button" title="전체" onSelect={() => {}}>
            <Dropdown.Item eventKey="0">전체</Dropdown.Item>
            <Dropdown.Item eventKey="1">김아무개</Dropdown.Item>
          </DropdownButton>
        </div>
        처리 현황:
        <div>
          <DropdownButton id="dropdown-basic-button" title="전체" onSelect={() => {}}>
            <Dropdown.Item eventKey="0">전체</Dropdown.Item>
            <Dropdown.Item eventKey="1">대기</Dropdown.Item>
            <Dropdown.Item eventKey="2">처리중</Dropdown.Item>
            <Dropdown.Item eventKey="3">승인</Dropdown.Item>
            <Dropdown.Item eventKey="4">반려</Dropdown.Item>
          </DropdownButton>
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
              <tr>
                <td>SCM</td>
                <td>김아무개</td>
                <td>비품</td>
                <td>XX상사</td>
                <td>15000</td>
                <td>7/15 A 구매</td>
                <td>반려</td>
                <td>아무튼 반려임</td>
                <td>2024.07.14</td>
                <td>2024.07.15</td>
              </tr>
            </tbody>
          </Table>
        </div>
    </div>
  );
}
