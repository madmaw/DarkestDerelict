///<reference path="./constants.ts"/>

const VOLUMETRIC_COMMANDS_FLOOR: VolumetricDrawCommand[] = [
  [
    TYPE_SHAPE_ROUNDING,
    {
      type: 'numeric',
      range: 'positive-float',
      value: 3,
    }
  ],
  [
    TYPE_SHAPE_BOX,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: WALL_DIMENSION,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: WALL_DIMENSION,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: FLOOR_DEPTH,
    },
  ],
];
