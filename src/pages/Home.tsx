import * as React from 'react';
import axios from 'axios';
import { ProductOrder, ProductEdit } from '../components/ProductModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import { GetUserInfo, RemoveUserInfo } from '../components/JWTToken';
import ReceiptModal from '../components/ReceiptModal';
import TopBar from '../components/TopBar';
import { HomeOrder } from '../components/HomeModal';

interface Product {
  pType: string;
  pName: string;
  price: number | string;
  quantity: number | string;
}

// 사원 페이지
export default function Home() {
  const [orderModalShow, setOrderModalShow] = React.useState<boolean>(false);
  const [checkedItems, setCheckedItems] = React.useState<Array<any>>([]);

  // 모달이 닫힐 때
  const handleClose = () => {
    setOrderModalShow(false);
  };

  const handleClick = (itemId: number) => {
    if(checkedItems.find((item) => item === itemId) === undefined) {
      setCheckedItems([...checkedItems, itemId]);
    }
    else {
      setCheckedItems(checkedItems.filter(item => item !== itemId));
    }
  };

  return (
    <div>
      <TopBar/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
        {checkedItems.length > 0 ?
          <Button onClick={() => {setOrderModalShow(!orderModalShow)}}>수정</Button>
          :
          <Button onClick={() => {setOrderModalShow(!orderModalShow)}}>추가</Button>
        }
        <Button>상신</Button>
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
            <tr onClick={() => {handleClick(1)}}>
              <td><Form.Check onClick={() => {handleClick(1)}} readOnly checked={checkedItems.find((item) => item === 1) !== undefined}/></td>
              <td>SCM</td>
              <td>김아무개</td>
              <td>비품</td>
              <td>XX상사</td>
              <td>15000</td>
              <td>7/15 A 구매</td>
              <td>대기</td>
              <td>2024.07.15</td>
            </tr>
            <tr onClick={() => {handleClick(2)}}>
              <td><Form.Check onClick={() => {handleClick(2)}} readOnly checked={checkedItems.find((item) => item === 2) !== undefined}/></td>
              <td>SCM</td>
              <td>김아무개</td>
              <td>비품</td>
              <td>XX상사</td>
              <td>15000</td>
              <td>7/15 A 구매</td>
              <td>대기</td>
              <td>2024.07.15</td>
            </tr>
            <tr onClick={() => {handleClick(3)}}>
              <td><Form.Check onClick={() => {handleClick(3)}} readOnly checked={checkedItems.find((item) => item === 3) !== undefined}/></td>
              <td>SCM</td>
              <td>김아무개</td>
              <td>비품</td>
              <td>XX상사</td>
              <td>15000</td>
              <td>7/15 A 구매</td>
              <td>대기</td>
              <td>2024.07.15</td>
            </tr>
          </tbody>
        </Table>
      </div>
      {HomeOrder(orderModalShow, handleClose)}
    </div>
  );
}
