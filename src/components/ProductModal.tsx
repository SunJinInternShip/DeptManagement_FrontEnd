import * as React from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { GetUserInfo } from './JWTToken';
import LoadingSpinner from './LoadingSpinner';

interface Product {
  pType: string;
  pName: string;
  price: number | string;
  quantity: number | string;
}

// 부서에서 물품 주문
export function ProductOrder(modalShow: boolean, handleClose: any) {
  const accessToken = GetUserInfo().accessToken;

  const [product, setProduct] = React.useState<Product>({
    pType: '비품',
    pName: '',
    price: '',
    quantity: ''
  });
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  // 물품 타입 선택
  const handleSelect = (e: any) => {
    setProduct((product: Product) => ({
      ...product,
      pType: e
    }));
  };

  // 내용 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((product: Product) => ({
      ...product,
      [name]: value
    }));
  };

  // 물품 주문 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinnerShow(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/orders`, {
        "productType": product.pType,
        "productName": product.pName,
        "price": product.price,
        "quantity": product.quantity
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      alert(res.data);
      handleClose();
    } catch (error: unknown) {
      console.log(error);
    }
    setSpinnerShow(false);
  }

  // 모달이 닫히면 값 초기화
  React.useEffect(() => {
    setSpinnerShow(true);
    if(modalShow === false) {
      setProduct({
        pType: '비품',
        pName: '',
        price: '',
        quantity: ''
      });
    }
    setSpinnerShow(false);
  },[modalShow])

  return (
    <div style={{ display: 'block', position: 'initial' }}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Modal.Body className="d-flex flex-column align-items-center">
          <Dropdown>
            <DropdownButton id="dropdown-basic-button" title={product.pType} onSelect={handleSelect} style={{width: "100%"}}>
              <Dropdown.Item eventKey="비품" active={product.pType === "비품"}>비품</Dropdown.Item>
              <Dropdown.Item eventKey="간식" active={product.pType === "간식"}>간식</Dropdown.Item>
              <Dropdown.Item eventKey="기타" active={product.pType === "기타"}>기타</Dropdown.Item>
            </DropdownButton>
          </Dropdown>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control type="text" placeholder='pname' name='pName' required
               value={product.pName}
               onChange={handleChange}/>
              <Form.Control type="number" placeholder='price' name='price' required
               value={product.price} min={0}
               onChange={handleChange}/>
              <Form.Control type="number" placeholder='quantity' name='quantity'
               value={product.quantity} min={1}
               onChange={handleChange}/>
              <Form.Control type='submit' value="등록"/>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}

// 부서에서 물품 수정
export function ProductEdit(modalShow: boolean, handleClose: any, productInfo: Product, orderId: number) {
  const accessToken = GetUserInfo().accessToken;

  const [product, setProduct] = React.useState<Product>(productInfo);
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  // 물품 타입 선택
  const handleSelect = (e: any) => {
    setProduct((product: Product) => ({
      ...product,
      pType: e
    }));
  };

  // 내용 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((product: Product) => ({
      ...product,
      [name]: value
    }));
  };

  // 물품 수정 요청
  const handleEdit = async () => {
    setSpinnerShow(true);
    try {
      const res = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/orders/${orderId}`, {
        "productType": product.pType,
        "productName": product.pName,
        "price": product.price,
        "quantity": product.quantity
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      alert(res.data);
      handleClose();
    } catch (error) {
      console.log(error); 
    }
    setSpinnerShow(false);
  }

  // 물품 삭제 요청
  const handleDelete = async () => {
    setSpinnerShow(true);
    try {
      const res = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      alert(res.data);
      handleClose();
    } catch (error) {
      console.log(error);
    }
    setSpinnerShow(false);
  }

  // 모달이 열리면 선택된 물품 값으로 변경
  React.useEffect(() => {
    setSpinnerShow(true);
    if(modalShow === true) {
      setProduct(productInfo);
    }
    setSpinnerShow(false);
  },[modalShow])

  return (
    <div style={{ display: 'block', position: 'initial' }}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Modal.Body className="d-flex flex-column align-items-center">
          <Dropdown>
            <DropdownButton id="dropdown-basic-button" title={product.pType} onSelect={handleSelect} style={{width: "100%"}}>
              <Dropdown.Item eventKey="비품" active={product.pType === "비품"}>비품</Dropdown.Item>
              <Dropdown.Item eventKey="간식" active={product.pType === "간식"}>간식</Dropdown.Item>
              <Dropdown.Item eventKey="기타" active={product.pType === "기타"}>기타</Dropdown.Item>
            </DropdownButton>
          </Dropdown>
          <Form>
            <Form.Group>
              <Form.Control type="text" placeholder='pname' name='pName' required
               value={product.pName}
               onChange={handleChange}/>
              <Form.Control type="number" placeholder='price' name='price' required
               value={product.price} 
               onChange={handleChange}/>
              <Form.Control type="number" placeholder='quantity' name='quantity'
               value={product.quantity}
               onChange={handleChange}/>
              <Form.Control type="button" value="수정" onClick={handleEdit}/>
              <Form.Control type="button" value="삭제" onClick={handleDelete}/>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}