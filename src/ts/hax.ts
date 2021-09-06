const shortenMethods = <F, T extends F>(o: F): T => {
  //let dts = '';
  for(const k in o) {
    const shortened = k.replace(/(^..)[a-z]*([A-Z][a-z]?)?[a-z]*([A-Z][a-z]?)?[a-z]*([A-Z][a-z]?)?[a-z]*(.+)$/, '$1$2$3$4$5');
    //if (shortened != k) {
      // if (o[shortened]) {
      //   console.log(`//${shortened} already exists!`);
      // } else {
      //   dts += `${shortened}: PropType<${o.constructor?.name || 'object'}, '${k}'>;\n`;
      // }
      o[shortened] = o[k];
    //}
  }
  //console.log(dts);
  return o as any;
};

type Trueish = true | 1 | any;
type Falseish = false | 0 | undefined | null;
type Booleanish = Trueish | Falseish;
type TouchOrMouseEvent = TouchEvent | MouseEvent;

const TRUE = 1 as const;
const FALSE = 0 as const;

const MathPI = Math.PI;
const Mathsqrt = Math.sqrt;
const Mathpow = Math.pow;
const Mathrandom = Math.random;
const Mathmin = Math.min;
const Mathmax = Math.max;
const Mathabs = Math.abs;
const Mathsin = Math.sin;
const Mathcos = Math.cos;
const Mathatan2 = Math.atan2;
const Mathround = Math.round;