import * as React from 'react';
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

export function ProductOrder() {
  const [product, setProduct] = React.useState<Product>({
    pType: '1',
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

  return (
    <div className="modal show"
     style={{ display: 'block', position: 'initial' }}>
      <Modal.Dialog>
        <Modal.Header closeButton />

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
              <Form.Control type="text" value="123" />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}