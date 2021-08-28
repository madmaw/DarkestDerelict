const ERROR_MARGIN = .0001;
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

const mathPI = Math.PI;
//const mathSqrt = Math.sqrt;
const mathPow = Math.pow;
const mathRandom = Math.random;
const mathMin = Math.min;
const mathMax = Math.max;
const mathAbs = Math.abs;
const mathSin = Math.sin;
const mathCos = Math.cos;
const mathAtan2 = Math.atan2;
//const mathRound = Math.round;