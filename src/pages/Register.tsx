import axios from 'axios';
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import LoadingSpinner from '../components/LoadingSpinner';

interface User {
  deptCode: string;
  deptName: string;
  btnState: boolean;
  name: string;
  id: string;
  password: string;
}

export default function Register() {
  const [user, setUser] = React.useState<User>({
    deptCode: '',
    deptName: '',
    btnState: false,
    name: '',
    id: '',
    password: ''
  });
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  const navigate = useNavigate();

  // 인증 버튼
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSpinnerShow(true);
    if(user.deptCode !== '') {
      try {
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/verify/department`, {
          "deptCode": user.deptCode
        });
        setUser((user: User) => ({
          ...user,
          deptName: res.data.deptName,
          btnState: true
        }));
      } catch (error: unknown) {
        alert("등록되어 있지 않은 부서입니다.");
        setUser((user: User) => ({
          ...user,
          deptCode: ''
        }));
      }
    }
    else alert("부서 코드를 입력해주세요.");
    setSpinnerShow(false);
}

  // 텍스트 수정
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((user: User) => ({
      ...user,
      [name]: value
    }));
  }

  // 회원가입 버튼
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinnerShow(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/signup`, {
        "deptCode": user.deptCode,
        "userName": user.name,
        "loginId": user.id,
        "password": user.password
      });
      alert("회원가입 성공!");
    } catch (error) {
      console.log(error);
    }
    setSpinnerShow(false);
    navigate("/");
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <input type='text' placeholder='부서 코드' name='deptCode'
             value={user.btnState? user.deptName : user.deptCode} readOnly={user.btnState} required
             onChange={handleChange}/>
            <button disabled={user.btnState} onClick={handleClick}>인증</button>
          </div>
          <input type='text' placeholder='이름' name='name'
           value={user.name} required
           onChange={handleChange}/>
          <input type='text' placeholder='아이디' name='id'
           value={user.id} required
           onChange={handleChange}/>
          <input type='password' placeholder='비밀번호' name='password'
           value={user.password} required
           onChange={handleChange}/>
          <input type='submit' value="회원가입" disabled={!user.btnState}/>
        </form>
      </div>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}
