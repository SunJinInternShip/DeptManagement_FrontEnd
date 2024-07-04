import * as React from 'react';
import { userData } from '../utils/SampleData';

export default function Login() {
  const [id, setId] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // /login
    userData.map((user) => {
      if(user.userId === id) {
        if(user.password === password) {
          alert("로그인");
        }
      }
    })
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input type='text' placeholder='id' required
           onChange={(e: any) => {setId(e.target.value)}}/>
          <input type='password' placeholder='password' required
           onChange={(e: any) => {setPassword(e.target.value)}}/>
          <input type='submit' value="로그인"/>
        </form>
      </div>
    </div>
  );
}
