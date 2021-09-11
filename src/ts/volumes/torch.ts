///<reference path="./colors.ts"/>

const VOLUMETERIC_COMMANDS_TORCH: VolumetricDrawCommand[] = [
  [
    TYPE_ROTATE_Z,
    {
      type: 'numeric',
      range: 'angle',
      value: Math.PI/2,
    }
  ],
  [
    TYPE_SHAPE_CYLINDER,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 20,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 8,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 8,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 10,
    },
  ],
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: 14,
      }
    ],
    [
      TYPE_SHAPE_CYLINDER,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 10,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 12,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 12,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 12,
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
        TYPE_SHAPE_CYLINDER,
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 10,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 8,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 8,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 10,
        },
      ],
    [
      TYPE_CONTEXT_END_REMATERIAL
    ],
  [
    TYPE_CONTEXT_END_UNION,
  ],
  [
    TYPE_MATERIAL_ID,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 2,
    },
  ],
  [
    TYPE_SHAPE_BOX,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 6,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 10,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 2,
    },
  ]
];

const VOLUMETRIC_TORCH = FLAG_USE_VOLUME_COMMANDS ? VOLUMETERIC_COMMANDS_TORCH : 'ZjDNBBD.xhDDFFF.#;DDBBD%+#<B@D<';

const VOLUMETRIC_PARAMS_TORCH: [(Vector4 | string)[], ((NumericValue<ValueRange> | CharValue)[] | string)?][] = [
  // torch
  [
    [COLOR_YELLOW_SHINY, COLOR_WHITE_GLOWING, COLOR_BLACK], 
  ],
];
