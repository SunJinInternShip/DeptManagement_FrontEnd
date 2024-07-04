import * as React from 'react';
import Modal from '../components/ProductModal';
import Spinner from '../components/Spinner';

export default function DepartmentMain() {
  const [state, setState] = React.useState<boolean>(false);
  //<input type='button' value="버튼" onClick={() => {setState(!state)}}/> {state? Modal() : ""}
  //{Spinner()}
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    </div>
  );
}
