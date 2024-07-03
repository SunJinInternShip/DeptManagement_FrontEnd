import * as React from 'react';

export default function Login() {
  const [id, setId] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    alert(`아이디: ${id}\n비밀번호: ${password}`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input type='text' placeholder='id' onChange={(e: any) => {setId(e.target.value)}}/>
          <input type='text' placeholder='password' onChange={(e: any) => {setPassword(e.target.value)}}/>
          <input type='submit' value="로그인"/>
        </form>
      </div>
    </div>
  );
}
