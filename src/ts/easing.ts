
type Easing = (p: number) => number;

const easeLinear = p => p;

const easeInQuad = p => p*p;

const easeOutQuad = p => 1 - (1 - p) * (1 - p);

const easeInOutExp4BackToStart = p => 1 - Mathpow((p-.5)*2, 4);

const easeSquareBackToStart = p => Mathmin((1 - Mathabs(p - .5)*2) * 5, 1);

const easeSinBackToStart = p => Mathsin(p * CONST_PI_2DP);

const easeOutBack = p => 1 + 2 * Mathpow(p - 1, 5) + Mathpow(p - 1, 2);
