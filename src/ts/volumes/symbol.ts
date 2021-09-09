///<reference path="./constants.ts"/>
///<reference path="./colors.ts"/>

const VOLUMETRIC_COMMANDS_SYMBOL: VolumetricDrawCommand[] = [
  [
    TYPE_SHAPE_EMOJI,
    {
      type: 'ref',
      index: 0,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: UNSCALED_VOLUME_DIMENSION * .8 | 0, // .8 to allow for overflows
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: UNSCALED_VOLUME_DIMENSION * .5,
    },
  ],
];

const VOLUMETRIC_TEMPLATE_SYMBOL = 'E0S<';
const VOLUMETRIC_SYMBOL = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_SYMBOL : VOLUMETRIC_TEMPLATE_SYMBOL;

const VOLUMETRIC_PARAMS_SYMBOL: [(Vector4 | string)[], ((NumericValue<ValueRange> | CharValue)[] | string)?][] = [
  // piercing attack
  [
    [COLOR_RED_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'char',
          value: '◉'
        }] : '◉'
  ],
  // poison 
  [
    [COLOR_GREEN_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'char',
          value: '☠'
        }]: '☠'
  ],
  // electric
  [
    [COLOR_YELLOW_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'char',
          value: 'ϟ'
        }]: 'ϟ'
  ],
  // move lateral 
  [
    [COLOR_CYAN_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'char',
          value: '↔'
        }]: '↔'
  ],
  // move medial 
  [
    [COLOR_CYAN_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'char',
          value: '↕'
        }]: '↕'
  ],
  // power gain
  [
    [COLOR_YELLOW_GLOWING],
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'char',
          value: '▲'
        }]: '▲'
  ],
  // power drain
  [
    [COLOR_YELLOW_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'char',
          value: '▼'
        }]: '▼'
  ],
  // web
  [
    [COLOR_YELLOW_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'char',
          value: '🕸️'
        }]: '🕸️'
  ],
];