import axios from 'axios';
import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate } from "react-router-dom";
import LoadingSpinner from '../components/LoadingSpinner';
import { GetUserInfo, SetUserInfo } from '../components/JWTToken';
import styles from '../styles/Login.module.css'
import logo from '../assets/sunjin.png';

interface User {
  id: string;
  password: string;
}

// 로그인
export default function Login() {
  const accessToken = GetUserInfo().accessToken;
  const role = GetUserInfo().role;

  const [user, setUser] = React.useState<User>({
    id: '',
    password: ''
  });
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  const navigate = useNavigate();

  // 내용 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((user: User) => ({
      ...user,
      [name]: value
    }));
  }

  // 로그인 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinnerShow(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, {
        "loginId": user.id,
        "password": user.password
      });
      await SetUserInfo(res.data.accessToken, res.data.refreshToken, res.data.userName, res.data.role);
      alert(`${GetUserInfo().name}님 환영합니다`);
      GetUserInfo().role === "CENTERDIRECTOR" ? navigate("/search", { replace: true }) : navigate("/home", { replace: true });
    } catch (error: any) {
      alert(error.response.data.message);
    }
    setSpinnerShow(false);
  };

  // 로그인한 유저가 없다면 기본 페이지(로그인 페이지)로
  React.useEffect(() => {
    if(accessToken !== null) {
      role === "CENTERDIRECTOR" ? navigate("/search", { replace: true }) : navigate("/home", { replace: true });
    }
  },[])

  return (
    <div className={styles.maindiv}>
      <div className='container-sm d-flex flex-column justify-content-center align-items-center'>
      <Image className={`m-4 ${styles.width20}`} src={logo}></Image>
        <Form onSubmit={handleSubmit} className={`d-flex flex-column justify-content-center align-items-center`}>
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
            <Button className={`w-100 ${styles.aligntext}`} type='submit'>로그인</Button>
          </div>
          <div className={`p-1 m-4 w-100`}>
            <Button className={`w-100 ${styles.aligntext}`} onClick={() => navigate("/signup")}>회원가입</Button>
          </div>
        </Form>
      </div>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}
