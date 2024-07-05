import * as React from 'react';
import { ProductOrder } from '../components/ProductModal';
import Spinner from '../components/Spinner';

export default function DepartmentMain() {
  const [state, setState] = React.useState<boolean>(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>로고</span>
        <span>test님 반갑습니다!</span>
      </div>
      <div style={{ textAlign: 'center' }}>
        YYY 부서의 총 사용 금액: 123,456,789 원
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <input type='button' value="버튼1"/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table style={{ width: '100%' }}>
          <tr>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
          </tr>
          <tr>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
          </tr>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <input type='button' value="버튼2"/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table style={{ width: '100%' }}>
          <tr>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
          </tr>
          <tr>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
            <td>123</td>
          </tr>
        </table>
      </div>
      {ProductOrder()}
    </div>
  );
}
