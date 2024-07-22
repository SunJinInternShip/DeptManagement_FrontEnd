import * as React from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { GetUserInfo } from './JWTToken';
import LoadingSpinner from './LoadingSpinner';
import image from '../assets/blank_receipt.jpg';

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

// 홈 - 추가 버튼
export function HomeOrder(modalShow: boolean, handleClose: any) {
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  const [receipt, setReceipt] = React.useState<Receipt>({
    file: null,
    preview: null
  });
  const [blankReceipt, setBlankReceipt] = React.useState<Receipt>({
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

  // 빈 이미지 File으로
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
    } catch (error) {
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

  // 물품 주문 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinnerShow(true);

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
    } catch (error: unknown) {
      console.log(error);
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
        account: '',
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
    <div style={{ display: 'block', position: 'initial' }}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Modal.Body className="d-flex flex-column align-items-center">
          <Form style={{display: 'flex', justifyContent: 'space-between'}} onSubmit={handleSubmit} encType='multipart/form-data'>
            <Image rounded style={{ maxHeight: "30%", maxWidth: "30%"}}
             src={receipt.file ? receipt.preview?.toString() : blankReceipt.preview?.toString()}/>
            <Form.Group>
              <Form.Control type="file" placeholder='img' name='file'
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
              <Form.Control type="text" placeholder='detail' name='detail'
               value={order.detail}
               onChange={handleChangeText}/>
              <Form.Control type="submit"/>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}

export function HomeEdit(modalShow: boolean, handleClose: any, orderInfo: Order, orderId: number) {
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  const [currentReceipt, setCurrentReceipt] = React.useState<Receipt>({
    file: null,
    preview: null
  });
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

  // 물품 삭제 요청
  const handleDelete = async () => {
    setSpinnerShow(true);
    try {
      const res = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/employee/${orderId}`, {
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

  // 물품 수정 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinnerShow(true);

    let formData = new FormData();
    let img: any;
    if(newReceipt.file === null && currentReceipt.file !== null) {
      img = new File([currentReceipt.file], 'image.jpg', { type: 'image/jpeg' });
    }
    else {
      img = newReceipt.file
    }

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
    url = role === 'EMPLOYEE'? `${process.env.REACT_APP_SERVER_URL}/employee/${orderId}` : `${process.env.REACT_APP_SERVER_URL}/teamleader/${orderId}`;
    
    try {
      const res = await axios.patch(url, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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

  // 모달이 열리면 선택된 물품 값으로 변경, 닫히면 값 초기화
  React.useEffect(() => {
    setSpinnerShow(true);
    if(modalShow === true) {
      setOrder(orderInfo);
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

  // 수정 시, orderId에 따른 이미지
  React.useEffect(() => {
    if(orderId !== undefined) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentReceipt((receipt: Receipt) => ({
          ...receipt,
          preview: reader.result
        }));
      };

      let url: string;
      if(role === 'EMPLOYEE') url = `${process.env.REACT_APP_SERVER_URL}/employee/img/${orderId}`;
      else if(role === 'TEAMLEADER') url = `${process.env.REACT_APP_SERVER_URL}/teamleader/img/${orderId}`;
      else if(role === 'CENTERDIRECTOR') url = `${process.env.REACT_APP_SERVER_URL}/centerdirector/img/${orderId}`;

      const loadImg = async () => {
        try {
          const response: any = await axios.get(url, {
              responseType: 'blob',
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
          });
          setCurrentReceipt((receipt: Receipt) => ({
            ...receipt,
            file: response.data
          }));
          reader.readAsDataURL(response.data);
        } catch (error) {
          console.log(error);
          setCurrentReceipt({
            file: null,
            preview: null
          });
        }
      }

      loadImg()
    }
  },[orderId]);

  return (
    <div style={{ display: 'block', position: 'initial' }}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Modal.Body className="d-flex flex-column align-items-center">
          <Form style={{display: 'flex', justifyContent: 'space-between'}}
           onSubmit={handleSubmit}>
            <Image rounded style={{ maxHeight: "30%", maxWidth: "30%"}}
             src={newReceipt.file ? newReceipt.preview?.toString() : currentReceipt.preview?.toString()}/>
            <Form.Group>
              <Form.Control type="file" placeholder='img' name='file'
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
              <Form.Control type="text" placeholder='detail' name='detail'
               value={order.detail}
               onChange={handleChangeText}/>
              <Form.Control type="submit" value="수정"/>
              <Form.Control type="button" value="삭제" onClick={handleDelete}/>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}