
type Easing = (p: number) => number;

const easeLinear = p => p;

const easeInQuad = p => p*p;

const easeOutQuad = p => 1 - (1 - p) * (1 - p);