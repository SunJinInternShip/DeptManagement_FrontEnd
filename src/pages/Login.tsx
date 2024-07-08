import axios from 'axios';
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { SetToken } from '../components/JWTToken';

interface User {
  id: string;
  password: string;
}

export default function Login() {
  const [user, setUser] = React.useState<User>({
    id: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((user: User) => ({
      ...user,
      [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, {
        "loginId": user.id,
        "password": user.password
      });
      SetToken(res.data.accessToken, res.data.refreshToken);
      alert("로그인 성공!");
    } catch (error) {
      console.log(error);
    }
    navigate("/home");
  };

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
    </div>
  );
}
