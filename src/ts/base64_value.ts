type ValueRange = 'positive-integer' | 'integer' | 'positive-float' | 'angle';

type Value<T> = LiteralValue<T> | RefValue;

type RefValue = {
  type: 'ref',
  index: number,
};

type LiteralValue<T> = {
  type: 'literal',
  range: T,
  value: number,
};

const literalValueToBase64 = (value: LiteralValue<ValueRange>) => {
  return literalValueComponentsToBase64(value.value, value.range);
}

const literalValueComponentsToBase64 = (value: number, range: ValueRange) => {
  switch (range) {
    case 'angle':
      return angleToBase64(value);
    case 'integer':
      return integerToBase64(value);
    case 'positive-integer':
      return positiveIntegerToBase64(value);
    case 'positive-float':
      return positiveFloatToBase64(value);
  }
};
