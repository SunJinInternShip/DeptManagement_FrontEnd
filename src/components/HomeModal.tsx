import * as React from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { GetUserInfo } from './JWTToken';
import LoadingSpinner from './LoadingSpinner';

interface Receipt {
  file: File | null;
  preview: string | ArrayBuffer | null;
}

interface Order {
  account: string;
  bName: string;
  price: number | string;
  detail: string;
}

// 홈에서 추가 버튼
export function HomeOrder(modalShow: boolean, handleClose: any) {
  const accessToken = GetUserInfo().accessToken;

  const [receipt, setReceipt] = React.useState<Receipt>({
    file: null,
    preview: null
  });
  const [order, setOrder] = React.useState<Order>({
    account: '',
    bName: '',
    price: '',
    detail: ''
  })
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  // 내용 변경
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder((order: Order) => ({
      ...order,
      [name]: value
    }));
  };

  // 내용 변경
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img: any = e.target.files;
    setReceipt((receipt: Receipt) => ({
      ...receipt,
      file: img?.item(0)
    }));
  };

  // 이미지 미리 보기
  React.useEffect(() => {
    setSpinnerShow(true);
    if(receipt.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt((receipt: Receipt) => ({
          ...receipt,
          preview: reader.result
        }));
      };
      reader.readAsDataURL(receipt.file);
    }
    else if(receipt.file === null) {
      setReceipt((receipt: Receipt) => ({
        ...receipt,
        preview: null
      }));
    }
    setSpinnerShow(false);
  },[receipt.file])

  // 모달이 닫히면 값 초기화
  React.useEffect(() => {
    setSpinnerShow(true);
    if(modalShow === false) {
      setReceipt({
        file: null,
        preview: null
      });
      setOrder({
        account: '',
        bName: '',
        price: '',
        detail: ''
      });
    }
    setSpinnerShow(false);
  },[modalShow])

  return (
    <div style={{ display: 'block', position: 'initial' }}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Modal.Body className="d-flex flex-column align-items-center">
          <Form style={{display: 'flex', justifyContent: 'space-between'}}>
            <Image src={receipt.preview?.toString()} rounded/>
            <Form.Group>
              <Form.Control type="file" placeholder='img' name='file' required
               onChange={handleChangeImage}/>
              <Form.Control type="text" placeholder='account' name='account' required
               value={order.account}
               onChange={handleChangeText}/>
              <Form.Control type="text" placeholder='bName' name='bName' required
               value={order.bName}
               onChange={handleChangeText}/>
              <Form.Control type="number" placeholder='price' name='price' required
               value={order.price} min={0}
               onChange={handleChangeText}/>
              <Form.Control type="text" placeholder='detail' name='detail' required
               value={order.detail}
               onChange={handleChangeText}/>'
              <Form.Control type="submit"/>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}