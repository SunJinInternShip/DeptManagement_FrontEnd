import * as React from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { GetUserInfo } from './JWTToken';
import LoadingSpinner from './LoadingSpinner';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import styles from '../styles/ManagementModal.module.css'

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

interface Approval {
  deniedDescription: string;
  approved: boolean;
}


export default function ManagementModal(modalShow: boolean, handleClose: any, order: Order) {
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  const [receipt, setReceipt] = React.useState<Receipt>({
    file: null,
    preview: null
  });
  const [approval, setApproval] = React.useState<Approval>({
    deniedDescription: "",
    approved: true
  });

  // 내용 변경
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApproval((approval: Approval) => ({
      ...approval,
      deniedDescription: e.target.value
    }));
  };

  // 모달이 열리면 이미지 조회, 닫히면 값 초기화
  React.useEffect(() => {
    //setSpinnerShow(true);
    if(modalShow === true) {
      if(order.orderId !== undefined) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReceipt((receipt: Receipt) => ({
            ...receipt,
            preview: reader.result
          }));
        };
        let url: string;
        url = role === 'TEAMLEADER' ? `${process.env.REACT_APP_SERVER_URL}/teamleader/img/${order.orderId}` : `${process.env.REACT_APP_SERVER_URL}/centerdirector/img/${order.orderId}`;
        const loadImg = async () => {
          try {
            const response: any = await axios.get(url, {
                responseType: 'blob',
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
            });
            setReceipt((receipt: Receipt) => ({
              ...receipt,
              file: response.data
            }));
            reader.readAsDataURL(response.data);
          } catch (error: any) {
            console.log(error);
            setReceipt({
              file: null,
              preview: null
            });
          }
        }
        loadImg()
      }
    }
    else {
      setReceipt({
        file: null,
        preview: null
      });
      setApproval({
        deniedDescription: "",
        approved: true
      });
    }
    //setSpinnerShow(false);
  },[modalShow])

  // 이미지 미리 보기
  React.useEffect(() => {
    //setSpinnerShow(true);
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
    //setSpinnerShow(false);
  },[receipt.file])

  // 승인 및 반려 처리
  const handleClick = async () => {
    if(approval.approved === false && approval.deniedDescription === "") {
      alert("반려 사유를 입력해주세요.")
    }
    else {
      const ApprovedToStr: string = approval.approved === true ? "true" : "false";
      if(role === "TEAMLEADER") {
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/temleader/department/submit/${order.orderId}`, {
          deniedDescription: approval.deniedDescription,
          isApproved: ApprovedToStr
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        alert(res.data);
        handleClose();
      }
      else if(role === "CENTERDIRECTOR") {
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/centerdirector/department/submit/${order.orderId}`, {
          deniedDescription: approval.deniedDescription,
          isApproved: ApprovedToStr
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        alert(res.data);
        handleClose();
      }
    }
  }

  return (
    <div className={styles.maindiv}>
      <Modal show={modalShow} onHide={handleClose} animation centered size="lg">
        <Modal.Header closeButton/>
        <div className="d-flex flex-row">
          <Modal.Body className="d-flex flex-column w-50">
            <Image rounded className='d-flex container-sm w-50 pt-1 pb-2'
             src={receipt.preview?.toString()}/>
            <Form.Group>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>사원</InputGroup.Text>
                <Form.Control value={`${order.applicantDeptName} ${order.applicant}`} readOnly/>
              </InputGroup>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>계정</InputGroup.Text>
                <Form.Control value={`${order.productType}`} readOnly/>
              </InputGroup>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>상호명</InputGroup.Text>
                <Form.Control value={`${order.storeName}`} readOnly/>
              </InputGroup>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>비용</InputGroup.Text>
                <Form.Control value={`${order.totalPrice}`} readOnly/>
              </InputGroup>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>적요</InputGroup.Text>
                <Form.Control value={`${order.description}`} readOnly/>
              </InputGroup>
              <InputGroup className='p-1'>
                <InputGroup.Text className={`w-25 ${styles.aligntext}`}>신청일</InputGroup.Text>
                <Form.Control value={`${order.createdAt}`} readOnly/>
              </InputGroup>
            </Form.Group>
          </Modal.Body>
          <Modal.Body className="d-flex flex-column w-50">
            <div className='d-flex flex-row justify-content-center'>
              <Button variant={approval.approved === true ? 'primary' : 'outline-primary'} className={`${styles.width30} mx-3`}
               onClick={() => {setApproval((approval: Approval) => ({...approval, approved: true}))}}>
                승인
              </Button>
              <Button variant={approval.approved === false ? 'danger' : 'outline-danger'} className={`${styles.width30} mx-3`}
               onClick={() => {setApproval((approval: Approval) => ({...approval, approved: false}))}}>
                반려
              </Button>
            </div>
            {approval.approved === true ?
              <div className='d-flex justify-content-center align-items-center h-100'/>
            :
              <div className='d-flex justify-content-center align-items-center h-100'>
                <InputGroup>
                  <InputGroup.Text className={`w-25 ${styles.aligntext}`}>비고</InputGroup.Text>
                  <Form.Control as="textarea" rows={5} className={styles.textarea}
                   readOnly={approval.approved} onChange={handleChangeText}/>
                </InputGroup>
              </div>
            }
          </Modal.Body>
        </div>
        <Modal.Footer className='d-flex justify-content-center'>
          <Button variant={approval.approved === true ? 'primary' : 'danger'} className={styles.width30} onClick={handleClick}>
            {approval.approved === true ? '승인' : '반려'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}