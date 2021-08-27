///<reference path="./constants.ts"/>

const VOLUMETRIC_COMMANDS_SYMBOL: VolumetricDrawCommand[] = [
  [
    TYPE_SHAPE_EMOJI,
    {
      type: 'char',
      value: 'C',
      //value: '🐱',
      //value: '🔥',
      //value: '💀',
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
