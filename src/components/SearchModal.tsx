import * as React from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { GetUserInfo } from './JWTToken';
import LoadingSpinner from './LoadingSpinner';
import InputGroup from 'react-bootstrap/InputGroup';
import styles from '../styles/Search.module.css'

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

// 조회 모달
export default function SearchModal(modalShow: boolean, handleClose: any, order: Order) {
  const role = GetUserInfo().role;

  const [receipt, setReceipt] = React.useState<string>("");
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

 // 모달이 열리면 이미지 조회, 닫히면 값 초기화
  React.useEffect(() => {
    setSpinnerShow(true);
    if(modalShow === true) {
      if(order.orderId !== undefined && role) {
        const lowerRole = role.toLowerCase()
        const loadImg = async () => {
          try {
            const response: any = await axios.get(`${process.env.REACT_APP_SERVER_URL}/${lowerRole}/img/${order.orderId}`, {
                headers: {
                  Authorization: `Bearer ${GetUserInfo().accessToken}`
                }
            });
            setReceipt(response.data);
          } catch (error: any) {
            console.log(error);
          }
        }
        loadImg()
      }
    }
    setSpinnerShow(false);
  },[modalShow])

  return (
    <div className={styles.maindiv}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Modal.Body className="d-flex flex-column">
          <Image rounded className='d-flex container-sm w-50 pt-1 pb-2'
           src={receipt}/>
          <Form.Group>
            <InputGroup className='p-1'>
              <InputGroup.Text className={`w-25 ${styles.aligntext}`}>사원</InputGroup.Text>
              <Form.Control value={`${order.applicantDeptName} ${order.applicant}`} readOnly/>
            </InputGroup>
            <InputGroup className='p-1'>
              <InputGroup.Text className={`w-25 ${styles.aligntext}`}>계정</InputGroup.Text>
              <Form.Control value={`${order.productType}`} readOnly/>
            </InputGroup>
            <InputGroup className='p-1'>
              <InputGroup.Text className={`w-25 ${styles.aligntext}`}>상호명</InputGroup.Text>
              <Form.Control value={`${order.storeName}`} readOnly/>
            </InputGroup>
            <InputGroup className='p-1'>
              <InputGroup.Text className={`w-25 ${styles.aligntext}`}>비용</InputGroup.Text>
              <Form.Control value={`${order.totalPrice}`} readOnly/>
            </InputGroup>
            <InputGroup className='p-1'>
              <InputGroup.Text className={`w-25 ${styles.aligntext}`}>적요</InputGroup.Text>
              <Form.Control value={`${order.description}`} readOnly/>
            </InputGroup>
            <InputGroup className='p-1'>
              <InputGroup.Text className={`w-25 ${styles.aligntext}`}>신청일</InputGroup.Text>
              <Form.Control value={`${order.createdAt}`} readOnly/>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
      </Modal>
      {LoadingSpinner(spinnerShow)}
    </div>
  )
}