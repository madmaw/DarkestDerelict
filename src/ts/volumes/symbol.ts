///<reference path="./constants.ts"/>

const VOLUMETRIC_COMMANDS_SYMBOL: VolumetricDrawCommand[] = [
  [
    TYPE_SHAPE_EMOJI,
    // {
    //   type: 'char',
    //   value: 'C',
    //   //value: '🐱',
    //   //value: '🔥',
    //   //value: '💀',
    // },
    {
      type: 'ref',
      index: 0,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: UNSCALED_VOLUME_DIMENSION * .8, // .8 to allow for overflows
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 2,
    },
  ],
];

const VOLUMETRIC_TEMPLATE_SYMBOL = 'E0S<';
const VOLUMETRIC_SYMBOL = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_SYMBOL : VOLUMETRIC_TEMPLATE_SYMBOL;