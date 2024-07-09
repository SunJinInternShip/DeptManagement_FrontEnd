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
  price: number | string;
  quantity: number | string;
}
const accessToken: string | null = localStorage.getItem("accessToken");

export function ProductOrder(modalShow: boolean, handleClose: any) {
  const [product, setProduct] = React.useState<Product>({
    pType: '비품',
    pName: '',
    price: '',
    quantity: ''
  });

  const handleSelect = (e: any) => {
    setProduct((product: Product) => ({
      ...product,
      pType: e
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  React.useEffect(() => {
    if(modalShow === false) {
      setProduct({
        pType: '비품',
        pName: '',
        price: '',
        quantity: ''
      });
    }
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
               value={product.price} min={0}
               onChange={handleChange}/>
              <Form.Control type="number" placeholder='quantity' name='quantity'
               value={product.quantity} min={1}
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

export function ProductEdit(modalShow: boolean, handleClose: any, productInfo: Product, orderId: number) {
  const [product, setProduct] = React.useState<Product>(productInfo);
  
  const handleSelect = (e: any) => {
    setProduct((product: Product) => ({
      ...product,
      pType: e,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((product: Product) => ({
      ...product,
      [name]: value
    }));
  };

  const handleEdit = async () => {
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
  }

  const handleDelete = async () => {
    alert(orderId);
  }

  React.useEffect(() => {
    if(modalShow === true) {
      setProduct(productInfo);
    }
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
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleEdit}>수정</Button>
          <Button variant="primary" onClick={handleDelete}>삭제</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}