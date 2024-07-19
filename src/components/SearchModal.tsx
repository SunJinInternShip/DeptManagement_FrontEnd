import * as React from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { GetUserInfo } from './JWTToken';
import LoadingSpinner from './LoadingSpinner';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

interface Receipt {
  file: File | Blob | null;
  preview: string | ArrayBuffer | null;
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


export default function SearchModal(modalShow: boolean, handleClose: any, order: Order) {
  const accessToken = GetUserInfo().accessToken;

  const [receipt, setReceipt] = React.useState<Receipt>({
    file: null,
    preview: null
  });
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  return (
    <div style={{ display: 'block', position: 'initial' }}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Modal.Body className="d-flex flex-column align-items-center">
          <Form style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
              <Image rounded/>
              {order.orderStatus}
            </div>
            <Form.Group>
              <InputGroup>
                <InputGroup.Text style={{width: "25%"}}>사원</InputGroup.Text>
                <Form.Control value={`${order.applicantDeptName} ${order.applicant}`} readOnly/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text style={{width: "25%"}}>계정</InputGroup.Text>
                <Form.Control value={`${order.description}`} readOnly/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text style={{width: "25%"}}>상호명</InputGroup.Text>
                <Form.Control value={`${order.storeName}`} readOnly/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text style={{width: "25%"}}>비용</InputGroup.Text>
                <Form.Control value={`${order.totalPrice}`} readOnly/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text style={{width: "25%"}}>적요</InputGroup.Text>
                <Form.Control value={`${order.description}`} readOnly/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text style={{width: "25%"}}>신청일</InputGroup.Text>
                <Form.Control value={`${order.createdAt}`} readOnly/>
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}