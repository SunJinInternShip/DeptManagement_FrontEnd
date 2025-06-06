import axios from 'axios';
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import LoadingSpinner from '../components/LoadingSpinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import styles from '../styles/Login.module.css'
import logo from '../assets/sunjin.png';

interface User {
  deptCode: string;
  deptName: string;
  name: string;
  id: string;
  password: string;
}

// 회원가입
export default function Signup() {
  const [user, setUser] = React.useState<User>({
    deptCode: '',
    deptName: '',
    name: '',
    id: '',
    password: ''
  });
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  const navigate = useNavigate();

  // 부서 인증
  const verifyDept = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(user.deptCode !== '') {
      try {
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/verify/department`, {
          "deptCode": user.deptCode
        });
        setUser((user: User) => ({
          ...user,
          deptName: res.data.deptName,
        }));
        return res.status
      } catch (error: unknown) {
        if(axios.isAxiosError(error)) {
          setUser((user: User) => ({
            ...user,
            deptCode: ''
          }));
          return error.status
        }
      }
    }
}

  // 내용 수정
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((user: User) => ({
      ...user,
      [name]: value
    }));
  }

  // 회원가입 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinnerShow(true);
    try {
      const deptResult = await verifyDept(e);
      if(deptResult === axios.HttpStatusCode.Ok) {
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/signup`, {
          "deptCode": user.deptCode,
          "userName": user.name,
          "loginId": user.id,
          "password": user.password
        });
        alert("회원가입 성공!");
        navigate("/");
      }
      else {
        alert("등록되어 있지 않은 부서입니다.");
        throw new Error("회원가입 실패")
      }
    } catch (error: unknown) {
      console.log(error);
    }
    setSpinnerShow(false);
  }

  return (
    <div className={styles.maindiv}>
      <div className='container-sm d-flex flex-column justify-content-center align-items-center'>
      <Image className={`m-4 ${styles.width20}`} src={logo}></Image>
        <Form onSubmit={handleSubmit} className={`d-flex flex-column justify-content-center align-items-center`}>
          <InputGroup className={`p-1 ${styles.width70}`}>
            <InputGroup.Text className={`w-25 ${styles.aligntext}`}>부서 코드</InputGroup.Text>
            <Form.Control type="text" name='deptCode' maxLength={20} required
             value={user.deptCode} onChange={handleChange}/>
          </InputGroup>
          <InputGroup className={`p-1 ${styles.width70}`}>
            <InputGroup.Text className={`w-25 ${styles.aligntext}`}>이름</InputGroup.Text>
            <Form.Control type="text" name='name' maxLength={20} required
             value={user.name} onChange={handleChange}/>
          </InputGroup>
          <InputGroup className={`p-1 ${styles.width70}`}>
            <InputGroup.Text className={`w-25 ${styles.aligntext}`}>아이디</InputGroup.Text>
            <Form.Control type="text" name='id' maxLength={20} required
             value={user.id} onChange={handleChange}/>
          </InputGroup>
          <InputGroup className={`p-1 ${styles.width70}`}>
            <InputGroup.Text className={`w-25 ${styles.aligntext}`}>비밀번호</InputGroup.Text>
            <Form.Control type="password" name='password' maxLength={20} required
             value={user.password} onChange={handleChange}/>
          </InputGroup>
          <div className={`p-1 m-4 w-100`}>
            <Button className={`w-100 ${styles.aligntext}`} type='submit'>회원가입</Button>
          </div>
        </Form>
      </div>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}