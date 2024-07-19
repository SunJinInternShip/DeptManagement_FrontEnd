import * as React from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { GetUserInfo } from './JWTToken';
import LoadingSpinner from './LoadingSpinner';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

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

  const [approval, setApproval] = React.useState<Approval>({
    deniedDescription: "",
    approved: true
  })

  // 내용 변경
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApproval((approval: Approval) => ({
      ...approval,
      deniedDescription: e.target.value
    }));
  };

  // 라디오 버튼 변경
  const handleClickRadio = (e: any) => {
    const approved: boolean = e.target.id === "true" ? true : false;
    setApproval((approval: Approval) => ({
      ...approval,
      approved: approved
    }));
    console.log(e.target.checked);
  }

  // 모달이 닫히면 값 초기화
  React.useEffect(() => {
    //setSpinnerShow(true);
    if(modalShow === false) {
      setApproval({
        deniedDescription: "",
        approved: true
      });
    }
    //setSpinnerShow(false);
  },[modalShow])

  const handleClick = async () => {
    if(approval.approved === false && approval.deniedDescription === "") {
      alert("반려 사유를 입력해주세요.")
    }
    else {
      const ApprovedToStr: string = approval.approved === true ? "true" : "false";
      if(role === "TEAMLEADER") {
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/temleader/department/submit/${order.orderId}`, {
          deniedDescription: approval.deniedDescription,
          approved: ApprovedToStr
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
          approved: ApprovedToStr
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
    <div style={{ display: 'block', position: 'initial' }}>
      <Modal show={modalShow} onHide={handleClose} animation centered>
        <Modal.Header closeButton/>

        <Modal.Body className="d-flex flex-column align-items-center">
          <Form style={{display: 'flex', justifyContent: 'space-between'}}>
            <Image rounded/>
            <Form.Group>
              <InputGroup>
                <InputGroup.Text>사원</InputGroup.Text>
                <Form.Control value={`${order.applicantDeptName} ${order.applicant}`} readOnly/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>계정</InputGroup.Text>
                <Form.Control value={`${order.description}`} readOnly/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>상호명</InputGroup.Text>
                <Form.Control value={`${order.storeName}`} readOnly/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>비용</InputGroup.Text>
                <Form.Control value={`${order.totalPrice}`} readOnly/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>적요</InputGroup.Text>
                <Form.Control value={`${order.description}`} readOnly/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>신청일</InputGroup.Text>
                <Form.Control value={`${order.createdAt}`} readOnly/>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Check type='radio' name='g1' label="승인" id='true' checked={approval.approved}
               onChange={handleClickRadio}/>
              <Form.Check type='radio' name='g1' label="반려" id='false' checked={!approval.approved}
               onChange={handleClickRadio}/>
              <InputGroup>
                <InputGroup.Text>반려사유</InputGroup.Text>
                <Form.Control as="textarea" readOnly={approval.approved} onChange={handleChangeText}/>
              </InputGroup>
              <Button onClick={handleClick}>등록</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}