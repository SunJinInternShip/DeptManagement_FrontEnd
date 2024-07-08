import * as React from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

interface Product {
  pType: string;
  pName: string;
  price: number;
  quantity: number;
}

// 종료 시 초기화 로직 필요 or 실행 시 초기화 로직
export function ProductOrder(modalShow: boolean, handleClose: any) {
  const accessToken: string | null = localStorage.getItem("accessToken");
  const [product, setProduct] = React.useState<Product>({
    pType: '비품',
    pName: '',
    price: 0,
    quantity: 0
  });

  const handleSelect = async (e: any) => {
    setProduct((product: Product) => ({
      ...product,
      pType: e,
    }));
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((product: Product) => ({
      ...product,
      [name]: value
    }));
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

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
  }

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
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleClick}>등록</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export function ProductEdit(modalShow: boolean, handleClose: any, productInfo: Product) {
  const [product, setProduct] = React.useState<Product>({
    pType: productInfo.pType,
    pName: productInfo.pName,
    price: productInfo.price,
    quantity: productInfo.quantity
  });

  const handleSelect = async (e: any) => {
    setProduct((product: Product) => ({
      ...product,
      pType: e,
    }));
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((product: Product) => ({
      ...product,
      [name]: value
    }));
  };

  return (
    <div
     style={{ display: 'block', position: 'initial' }}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Modal.Body className="d-flex flex-column align-items-center">
          <Dropdown>
            <DropdownButton id="dropdown-basic-button" title={product.pType} onSelect={handleSelect}>
              <Dropdown.Item eventKey="1" active={product.pType === "1"}>1</Dropdown.Item>
              <Dropdown.Item eventKey="2" active={product.pType === "2"}>2</Dropdown.Item>
              <Dropdown.Item eventKey="3" active={product.pType === "3"}>3</Dropdown.Item>
            </DropdownButton>
          </Dropdown>
          <Form>
            <Form.Group>
              <Form.Control type="text" placeholder='pname' name='pName'
               value={product.pName}
               onChange={handleChange}/>
              <Form.Control type="number" placeholder='price' name='price'
               value={product.price} 
               onChange={handleChange}/>
              <Form.Control type="number" placeholder='quantity' name='quantity'
               value={product.quantity}
               onChange={handleChange}/>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleClose}>수정</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}