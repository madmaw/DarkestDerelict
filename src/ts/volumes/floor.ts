///<reference path="./constants.ts"/>

const BOLT_INSET = 2;

const VOLUMETRIC_COMMANDS_FLOOR: VolumetricDrawCommand[] = [
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
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_MATERIAL_ID,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 1,
      },
    ],
    [
      TYPE_TRANSLATE_Z,
      {
        type: 'numeric',
        range: 'integer',
        value: FLOOR_DEPTH/2,
      }
    ],
    [
      TYPE_SHAPE_BOX,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: WALL_DIMENSION-2,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: WALL_DIMENSION-2,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: FLOOR_DEPTH,
      },  
    ],
  [
    TYPE_CONTEXT_END_REMATERIAL,
  ],
];

const VOLUMETRIC_TEMPLATE_FLOOR = 'BVV<.#;z[BTT<%';
const VOLUMETRIC_FLOOR = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_FLOOR : VOLUMETRIC_TEMPLATE_FLOOR;
