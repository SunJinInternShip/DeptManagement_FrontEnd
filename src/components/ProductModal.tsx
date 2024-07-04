import styles from '../styles/ProductModal.module.css'

interface Product {
  pType: string;
  pName: string;
  price: number;
  quantity: number;
}

export default function Modal() {
  return(
    <div className={styles.Modal}>
      <div>
        <input type="file" accept="image/*" />
        <input type="button" value="임시 닫기" onClick={() => {window.location.reload()}}/>
      </div>
    </div>
  )
}

//export function ProductOrder() {}

//export function ProductModification() {}