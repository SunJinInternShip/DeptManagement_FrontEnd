import * as React from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { GetUserInfo } from './JWTToken';
import LoadingSpinner from './LoadingSpinner';

interface Receipt {
  file: File | Blob | null;
  preview: string | ArrayBuffer | null;
}

interface Order {
  account: string;
  bName: string;
  price: number | string;
  detail: string;
}


export default function SearchModal(modalShow: boolean, handleClose: any, orderInfo: Order, orderId: number) {
  const accessToken = GetUserInfo().accessToken;

  const [receipt, setReceipt] = React.useState<Receipt>({
    file: null,
    preview: null
  });
  const [order, setOrder] = React.useState<Order>(orderInfo)
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  return (
    <div style={{ display: 'block', position: 'initial' }}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Modal.Body className="d-flex flex-column align-items-center">
          <Form style={{display: 'flex', justifyContent: 'space-between'}}>
            <Image rounded/>
            <Form.Group>
              <Form.Check
               type='radio'
               name='g1'
              />
              <Form.Check
               type='radio'
               name='g1'
              />
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}