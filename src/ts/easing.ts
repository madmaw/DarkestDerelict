
type Easing = (p: number) => number;

const easeLinear = p => p;

const easeInQuad = p => p*p;

const easeOutQuad = p => 1 - (1 - p) * (1 - p);

const easeInOutExp4BackToStart = p => 1 - Math.pow((p-.5)*2, 4);

const easeSquareBackToStart = p => Math.min((1 - Math.abs(p - .5)*2) * 5, 1);

const easeSinBackToStart = p => Math.sin(p * CONST_PI_2DP);

const easeOutBack = p => 1 + 2 * Math.pow(p - 1, 5) + Math.pow(p - 1, 2);
