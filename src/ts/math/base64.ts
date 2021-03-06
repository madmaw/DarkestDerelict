const OFFSET = 58; // character after '9'
// positive floats can be 0 -> 2 in value
const FLOAT_DIVISOR = 32;

const integerToBase64 = (i: number) => {
  const code = i + OFFSET + 32;
  if (code == 92) {
    return '\\\\';
  }
  return String.fromCharCode(code);
};
const angleToBase64 = (a: number) => integerToBase64(Mathround(a * 32 / MathPI)); // no need to convert, wil lbe tree-shaken out
const positiveIntegerToBase64 = (i: number) => String.fromCharCode(i + OFFSET);
const positiveFloatToBase64 = (f: number) => positiveIntegerToBase64(Mathround(f * FLOAT_DIVISOR));
const colorToBase64 = (color: Vector4) => color.map(v => positiveIntegerToBase64((v/4 | 0))).join('');
const arrayToBase64 = (a: any, depth: number) => {
  if (depth) {
    const arr: any[] = (a || []);
    for (let i=0; i<arr.length; i++) {
      arr[i] = arr[i] != null ? arr[i] : [];
    }
    return positiveIntegerToBase64(arr.length) + arr.map(v => arrayToBase64(v, depth-1)).join('');
    //return `${arr.length}` + arr.map(v => arrayToBase64(v, depth-1)).join('');
  } else {
    return integerToBase64(a);
    //return `${a}`;
  }
};

const integerFromBase64 = (s: string) => s.charCodeAt(0) - OFFSET - 32;
const angleFromBase64 = (s: string) => (integerFromBase64(s) / 32) * CONST_PI_3DP;
const positiveIntegerFromBase64 = (s: string) => s.charCodeAt(0) - OFFSET;
const positiveFloatFromBase64 = (s: string) => positiveIntegerFromBase64(s)/FLOAT_DIVISOR;
// multiply by 4.05 so 63 => 255, not 252
const colorFromBase64 = (s: string) => [...s].map(c => positiveIntegerFromBase64(c)*4.05 | 0) as Vector4;
const arrayFromBase64 = <T>(s: string[], depth: number, p: number[] = []): T => {
  const c = s.shift();
  if (depth) {
    let length = positiveIntegerFromBase64(c);
    const arr = [];
    while (length--) {
      arr.push(arrayFromBase64(s, depth-1, p));
    }
    return arr as any;
  } else {
    const v = integerFromBase64(c);
    return (v < 0 ? p[Mathabs(v + 1)] : v) as any;
  }
};
