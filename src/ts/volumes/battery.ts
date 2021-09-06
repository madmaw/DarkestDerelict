///<reference path="./colors.ts"/>

const VOLUMETERIC_COMMANDS_BATTERY: VolumetricDrawCommand[] = [
  [
    TYPE_ROTATE_Y,
    {
      type: 'numeric',
      range: 'angle',
      value: -Math.PI/2,
    }
  ],
  [
    TYPE_SHAPE_CYLINDER,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 28,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 20,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 20,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 20,
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
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: 7,
      }
    ],
    [
      TYPE_SHAPE_BOX,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 14,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 20,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 20,
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
          value: 0,
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
          value: 6,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 24,
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
          value: 2,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 24,
        },
      ],      
    [
      TYPE_CONTEXT_END_REMATERIAL,
    ],
    [
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: -14,
      }
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
        value: 6,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 24,
      },
    ],
  [
    TYPE_CONTEXT_END_REMATERIAL
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
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_SHAPE_CYLINDER,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 28,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 18,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 18,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 20,
      },
    ],
  [
    TYPE_CONTEXT_END_REMATERIAL,
  ],
  [
    TYPE_TRANSLATE_X,
    {
      type: 'numeric',
      range: 'integer',
      value: 2,
    },
  ],
  [
    TYPE_SHAPE_CYLINDER,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 26,
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
      value: 8,
    },
  ],  

];

const VOLUMETRIC_BATTERY = FLAG_USE_VOLUME_COMMANDS ? VOLUMETERIC_COMMANDS_BATTERY : 'YJDVNNN.#;xaBHNN.#:B<@RB@<R%xLB<@R%#<.DVLLN%x^DVBBB';

const VOLUMETRIC_PARAMS_BATTERY: [(Vector4 | string)[], ((NumericValue<ValueRange> | CharValue)[] | string)?][] = [
  [
    [COLOR_ORANGE_SHINY, COLOR_CHITIN, COLOR_WHITE_SHINY], 
  ],
];
