import axios from 'axios';
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import LoadingSpinner from '../components/LoadingSpinner';
import { GetUserInfo, SetUserInfo } from '../components/JWTToken';

interface User {
  id: string;
  password: string;
}

export default function Login() {
  const [userName, setUserName] = React.useState<string | null>(GetUserInfo().name);
  const [user, setUser] = React.useState<User>({
    id: '',
    password: ''
  });
  const [spinnerShow, setSpinnerShow] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((user: User) => ({
      ...user,
      [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinnerShow(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, {
        "loginId": user.id,
        "password": user.password
      });
      await SetUserInfo(res.data.accessToken, res.data.refreshToken, res.data.userName);
      alert(`${GetUserInfo().name}님 환영합니다`);
      GetUserInfo().name === "admin" ? navigate("/home/admin", { replace: true }) : navigate("/home", { replace: true });
    } catch (error) {
      console.log(error);
    }
    setSpinnerShow(false);
  };

  React.useEffect(() => {
    if(userName !== null) navigate("/home", { replace: true });
  },[])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input type='text' placeholder='id' name='id'
           value={user.id} required
           onChange={handleChange}/>
          <input type='password' placeholder='password' name='password'
           value={user.password} required
           onChange={handleChange}/>
          <input type='submit' value="로그인"/>
          <button onClick={() => {navigate("/register")}}>회원가입</button>
        </form>
      </div>
      {LoadingSpinner(spinnerShow)}
    </div>
  );
}
