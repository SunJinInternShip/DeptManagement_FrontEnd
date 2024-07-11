import * as React from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { GetUserInfo } from './JWTToken';
import LoadingSpinner from './LoadingSpinner';

interface Receipt {
  name: string;
  price: number | string;
  file: File | null;
  preview: string | ArrayBuffer | null;
}

export default function ReceiptModal(modalShow: boolean, handleClose: any) {
  const accessToken = GetUserInfo().accessToken;

  const [receipt, setReceipt] = React.useState<Receipt>({
    name: '',
    price: '',
    file: null,
    preview: null
  });
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  // 내용 변경
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReceipt((receipt: Receipt) => ({
      ...receipt,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //try catch
    alert(receipt);
  };

  React.useEffect(() => {
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
  },[receipt.file])

  // 모달이 닫히면 값 초기화
  React.useEffect(() => {
    setSpinnerShow(true);
    if(modalShow === false) {
      setReceipt({
        name: '',
        price: '',
        file: null,
        preview: null
      });
    }
    setSpinnerShow(false);
  },[modalShow])

  return (
    <div style={{ display: 'block', position: 'initial' }}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Modal.Body className="d-flex flex-column align-items-center">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control type="text" placeholder='name' name='name' required
               value={receipt.name}
               onChange={handleChangeText}/>
              <Form.Control type="number" placeholder='price' name='price' required
               value={receipt.price} min={0}
               onChange={handleChangeText}/>
              <Form.Control type="file" placeholder='img' name='file' required
               onChange={handleChangeImage}/>
              <Image src={receipt.preview?.toString()} rounded/>
              <Form.Control type="submit"/>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}