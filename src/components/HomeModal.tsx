import * as React from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { GetUserInfo } from './JWTToken';
import LoadingSpinner from './LoadingSpinner';
import image from '../assets/blank_img.jpg';
import styles from '../styles/HomeModal.module.css'

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

// 홈 - 추가 모달
export function HomeOrder(modalShow: boolean, handleClose: any) {
  // localStorage에 저장된 유저 정보 가져옴
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  // input type image의 ref
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [receipt, setReceipt] = React.useState<Receipt>({
    file: null,
    preview: null
  });
  const [blankReceipt, setBlankReceipt] = React.useState<Receipt>({
    file: null,
    preview: null
  });
  const [order, setOrder] = React.useState<Order>({
    account: '비품',
    bName: '',
    price: '',
    detail: ''
  })
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  // 빈 이미지 -> File
  const blankImageToFile = () => {
    try {
      let img = new window.Image();
      img.src = image;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx: any = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob: any) => {
          const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
          setBlankReceipt((receipt: Receipt) => ({
            ...receipt,
            file: file
          }));
        }, 'image/jpeg');
      }
    } catch (error: any) {
      console.log(error);
    }
  }
  
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

  // 내용 변경
  const handleSelectAccount = (e: any) => {
    setOrder((order: Order) => ({
      ...order,
      account: e.target.value
    }));
  };

  // 물품 주문 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinnerShow(true);

    // image + req -> formData
    let formData = new FormData();
    const img: any = receipt.file ? receipt.file : blankReceipt.file;
    const requestData = {
      "productType": order.account,
      "storeName": order.bName,
      "totalPrice": order.price,
      "description": order.detail
    };
    const blob = new Blob([JSON.stringify(requestData)], {type: 'application/json'});

    formData.append("image", img);
    formData.append("request", blob);
    
    let url: string;
    url = role === 'EMPLOYEE'? `${process.env.REACT_APP_SERVER_URL}/employee/orders` : `${process.env.REACT_APP_SERVER_URL}/teamleader/orders`;

    try {
      const res = await axios.post(url, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        }
      });
      alert(res.data);
      handleClose();
    } catch (error: any) {
      alert(error.response.data.message);
    }
    setSpinnerShow(false);
  }

  // 이미지 미리 보기
  React.useEffect(() => {
    setSpinnerShow(true);
    const reader = new FileReader();
    if(receipt.file !== null) {
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

      if(blankReceipt.preview === null && blankReceipt.file !== null) {
        reader.onloadend = () => {
          setBlankReceipt((receipt: Receipt) => ({
            ...receipt,
            preview: reader.result
          }));
        };
        reader.readAsDataURL(blankReceipt.file);
      }
    }
    setSpinnerShow(false);
  },[receipt.file, blankReceipt.file])

  // 모달이 닫히면 값 초기화
  React.useEffect(() => {
    setSpinnerShow(true);
    if(modalShow === false) {
      setReceipt({
        file: null,
        preview: null
      });
      setOrder({
        account: '비품',
        bName: '',
        price: '',
        detail: ''
      });
    }
    setSpinnerShow(false);
  },[modalShow])

  // 빈 이미지 로드
  React.useEffect(() => {
    setSpinnerShow(true);
    blankImageToFile();
    setSpinnerShow(false);
  },[])

  return (
    <div className={styles.ordermaindiv}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="d-flex flex-column">
            <Image rounded className={`d-flex container-sm w-50 pt-1 pb-2 ${styles.image}`}
             onClick={() => {return inputRef.current !== null ? inputRef.current.click() : ''}}
             src={receipt.file ? receipt.preview?.toString() : blankReceipt.preview?.toString()}/>
            <Form.Group>
              <Form.Control type="file" name='file' accept='image/jpeg' ref={inputRef} hidden
               onChange={handleChangeImage}/>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>계정</InputGroup.Text>
                <Form.Select onChange={handleSelectAccount}>
                  <option>비품</option>
                  <option>간식</option>
                  <option>식비</option>
                  <option>일반 경비</option>
                  <option>접대비</option>
                  <option>교통비</option>
                  <option>기타</option>
                </Form.Select>
              </InputGroup>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>상호명</InputGroup.Text>
                <Form.Control type="text" name='bName' maxLength={15} required
                 value={order.bName}
                 onChange={handleChangeText}/>
              </InputGroup>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>비용</InputGroup.Text>
                <Form.Control type="number" name='price' required
                 value={order.price} min={0}
                 onChange={handleChangeText}/>
              </InputGroup>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>적요</InputGroup.Text>
                <Form.Control type="text" name='detail' maxLength={30}
                 value={order.detail}
                 onChange={handleChangeText}/>
              </InputGroup>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className={`mx-2 d-flex container-sm ${styles.aligntext}`} type="submit">
              추가
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}

// 홈 - 수정 모달
export function HomeEdit(modalShow: boolean, handleClose: any, orderInfo: Order, orderId: number) {
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [currentReceipt, setCurrentReceipt] = React.useState<string>("");
  const [newReceipt, setNewReceipt] = React.useState<Receipt>({
    file: null,
    preview: null
  });
  const [order, setOrder] = React.useState<Order>(orderInfo)
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
    setNewReceipt((receipt: Receipt) => ({
      ...receipt,
      file: img?.item(0)
    }));
  };

  // 내용 변경
  const handleSelectAccount = (e: any) => {
    setOrder((order: Order) => ({
      ...order,
      account: e.target.value
    }));
  };

  // 물품 삭제 요청
  const handleDelete = async () => {
    setSpinnerShow(true);
    if(orderId !== undefined && role) {
      const lowerRole = role.toLowerCase()
      try {
        const res = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/${lowerRole}/${orderId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        alert(res.data);
        handleClose();
      } catch (error: any) {
        alert(error.response.data.message);
      }
    }
    setSpinnerShow(false);
  }

  // 물품 수정 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinnerShow(true);

    let formData = new FormData();

    const requestData = {
      "productType": order.account,
      "storeName": order.bName,
      "totalPrice": order.price,
      "description": order.detail
    };
    const blob = new Blob([JSON.stringify(requestData)], {type: 'application/json'});

    if(newReceipt.file) formData.append("image", newReceipt.file);
    formData.append("request", blob);

    if(orderId !== undefined && role) {
      const lowerRole = role.toLowerCase()
      console.log(order.account)
      console.log(order.bName)
      console.log(order.price)
      console.log(order.detail)
      try {
        const res = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/${lowerRole}/${orderId}`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`
          }
        });
        alert(res.data);
        handleClose();
      } catch (error: any) {
        alert(error.response.data.message);
      }
      setSpinnerShow(false);
    }
  }

  const loadCurrentImg = async () => {
    if(orderId !== undefined && role) {
      const lowerRole = role.toLowerCase()
      try {
        const response: any = await axios.get(`${process.env.REACT_APP_SERVER_URL}/${lowerRole}/img/${orderId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
        });
        setCurrentReceipt(response.data);
      } catch (error: any) {
        console.log(error);
      }
    }
  }

  // 모달이 열리면 선택된 물품 값으로 변경, 닫히면 값 초기화
  React.useEffect(() => {
    setSpinnerShow(true);
    if(modalShow === true) {
      console.log(orderInfo)
      setOrder(orderInfo);
      loadCurrentImg()
    }
    else {
      setNewReceipt({
        file: null,
        preview: null
      });
    }
    setSpinnerShow(false);
  },[modalShow])

  // 이미지 미리 보기
  React.useEffect(() => {
    setSpinnerShow(true);
    if(newReceipt.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReceipt((receipt: Receipt) => ({
          ...receipt,
          preview: reader.result
        }));
      };
      reader.readAsDataURL(newReceipt.file);
    }
    else if(newReceipt.file === null) {
      setNewReceipt((receipt: Receipt) => ({
        ...receipt,
        preview: null
      }));
    }
    setSpinnerShow(false);
  },[newReceipt.file])

  return (
    <div className={styles.ordermaindiv}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Form onSubmit={handleSubmit}>
          <Modal.Body className="d-flex flex-column">
            <div className={`d-flex pb-2 ${styles.btndiv}`}>
              <Button variant='warning' className={`mx-2 px-4 ${styles.aligntext}`} type="submit">수정</Button>
              <Button variant='danger' className={`mx-2 px-4 ${styles.aligntext}`} type="button" onClick={handleDelete}>삭제</Button>
            </div>
            <Image rounded className={`d-flex container-sm w-50 pt-1 pb-2 ${styles.image}`}
             onClick={() => {return inputRef.current !== null ? inputRef.current.click() : ''}}
             src={newReceipt.file ? newReceipt.preview?.toString() : currentReceipt}/>
            <Form.Group>
              <Form.Control type="file" name='file' ref={inputRef} hidden
               onChange={handleChangeImage}/>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>계정</InputGroup.Text>
                <Form.Select onChange={handleSelectAccount}>
                  <option>비품</option>
                  <option>간식</option>
                  <option>식비</option>
                  <option>일반 경비</option>
                  <option>접대비</option>
                  <option>교통비</option>
                  <option>기타</option>
                </Form.Select>
              </InputGroup>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>상호명</InputGroup.Text>
                <Form.Control type="text" name='bName' maxLength={15} required
                 value={order.bName}
                 onChange={handleChangeText}/>
              </InputGroup>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>비용</InputGroup.Text>
                <Form.Control type="number" name='price' required
                 value={order.price} min={0}
                 onChange={handleChangeText}/>
              </InputGroup>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>적요</InputGroup.Text>
                <Form.Control type="text" name='detail' maxLength={30}
                 value={order.detail}
                 onChange={handleChangeText}/>
              </InputGroup>
            </Form.Group>
          </Modal.Body>
        </Form>
      </Modal>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}