///<reference path="./constants.ts"/>

const VOLUMETRIC_COMMANDS_DOOR: VolumetricDrawCommand[] = [
  [
    TYPE_SHAPE_BOX,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 4,
    },
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
  ],
  [TYPE_CONTEXT_START],
    [
      TYPE_TRANSLATE_Z,
      {
        type: 'numeric',
        range: 'integer',
        value: 4,
      }
    ],
    [
      TYPE_SHAPE_BOX,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 4,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 12,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 4,
      },
    ],
  [TYPE_CONTEXT_END_SUBTRACTION],
  [
    TYPE_TRANSLATE_Y,
    {
      type: 'numeric',
      range: 'integer',
      value: -10,
    }
  ],
  [
    TYPE_TRANSLATE_X,
    {
      type: 'numeric',
      range: 'integer',
      value: -2,
    }
  ],
  // [TYPE_CONTEXT_START],
  //   [
  //     TYPE_MATERIAL_ID,
  //     {
  //       type: 'numeric',
  //       range: 'positive-integer',
  //       value: 1,
  //     },
  //   ],
  //   [
  //     TYPE_SHAPE_BOX,
  //     {
  //       type: 'numeric',
  //       range: 'positive-integer',
  //       value: 2,
  //     },
  //     {
  //       type: 'numeric',
  //       range: 'positive-integer',
  //       value: 4,
  //     },
  //     {
  //       type: 'numeric',
  //       range: 'positive-integer',
  //       value: 4,
  //     },
  //   ],
  // [TYPE_CONTEXT_END_REMATERIAL],
  [TYPE_CONTEXT_START],
    [
      TYPE_MATERIAL_ID,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 1,
      },
    ],
    [
      TYPE_SHAPE_BOX,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 2,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 2,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 2,
      },
    ],  
  [TYPE_CONTEXT_END_REMATERIAL],
];

const VOLUMETRIC_TEMPLATE_DOOR = 'B>VV.z^B>F>-yPxX.#<B<<<-';
const VOLUMETRIC_DOOR = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_DOOR : VOLUMETRIC_TEMPLATE_DOOR;
