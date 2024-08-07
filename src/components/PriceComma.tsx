// 비용으로 입력받은 값에 comma 처리 | ex) 10000(number) -> 10,000(string) 
export default function PriceComma(price: number): string {
  const array: Array<number | string> = Array.from(String(price), Number);
  let num = 0;
  array.reverse().forEach((v: number | string, i: number) => {
    if(i !== 0 && i % 3 === 0) {
      array.splice(i + num, 0, ",");
      num += 1;
    }
  });
  const str: string = array.reverse().join('');
  return str;
}