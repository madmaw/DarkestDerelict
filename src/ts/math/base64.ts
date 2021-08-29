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
const angleToBase64 = (a: number) => integerToBase64(Math.round(a * 32 / Math.PI));
const positiveIntegerToBase64 = (i: number) => String.fromCharCode(i + OFFSET);
const positiveFloatToBase64 = (f: number) => positiveIntegerToBase64(Math.round(f * FLOAT_DIVISOR));

const integerFromBase64 = (s: string) => s.charCodeAt(0) - OFFSET - 32;
const angleFromBase64 = (s: string) => (integerFromBase64(s) / 32) * Math.PI;
const positiveIntegerFromBase64 = (s: string) => s.charCodeAt(0) - OFFSET;
const positiveFloatFromBase64 = (s: string) => positiveIntegerFromBase64(s)/FLOAT_DIVISOR;