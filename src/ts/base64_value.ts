type ValueRange = 'positive-integer' | 'integer' | 'positive-float' | 'angle';

type Value<T> = NumericValue<T> | RefValue | CharValue;

type RefValue = {
  type: 'ref',
  index: number,
};

type NumericValue<T> = {
  type: 'numeric',
  range: T,
  value: number,
};

type CharValue = {
  type: 'char',
  value: string,
}

const numericOrCharValueToBase64 = (value: NumericValue<ValueRange> | CharValue) => {
  return value.type == 'char'
      ? value.value
      : numericValueComponentsToBase64(value.value, value.range);
}

const numericValueComponentsToBase64 = (value: number, range: ValueRange) => {
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
