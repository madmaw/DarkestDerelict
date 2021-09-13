///<reference path="./colors.ts"/>

const VOLUMETERIC_COMMANDS_FOOD: VolumetricDrawCommand[] = [
  [
    TYPE_ROTATE_Z,
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
      TYPE_SHAPE_BOX,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 24,
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
        value: 8,
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
    ],
    [
      TYPE_ROTATE_Z,
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
        value: 20,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 14,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 14,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 16,
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
      /*
      [
        TYPE_ROTATE_X,
        {
          type: 'numeric',
          range: 'angle',
          value: Math.PI/4,
        }
      ],
      */
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
          type: 'ref',
          index: 0,
        },
      ],
    [
      TYPE_CONTEXT_END_REMATERIAL,
    ],
  [
    TYPE_CONTEXT_END_REMATERIAL
  ],
];

const VOLUMETRIC_FOOD = FLAG_USE_VOLUME_COMMANDS ? VOLUMETERIC_COMMANDS_FOOD : 'ZJDVLLN.#;BRLL#<BBLLZJDNHHJ.#;DNBB0%%';

const VOLUMETRIC_PARAMS_FOOD: [(Vector4 | string)[], ((NumericValue<ValueRange> | CharValue)[] | string)?][] = [
  [
    [COLOR_GUNMETAL, COLOR_RED_SHINY, COLOR_WHITE_SHINY],
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'numeric',
          range: 'positive-integer',
          value: 8,
        }, {
          type: 'numeric',
          range: 'angle',
          value: 0,
        }] : 'B'
  ],
  [
    [COLOR_GUNMETAL, COLOR_BLUE_SHINY, COLOR_WHITE_SHINY],
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'numeric',
          range: 'positive-integer',
          value: 4,
        }, {
          type: 'numeric',
          range: 'angle',
          value: Math.PI/4,
        }] : '>'
  ],
  [
    [COLOR_GUNMETAL, COLOR_GREEN_SHINY, COLOR_WHITE_SHINY], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'numeric',
          range: 'positive-integer',
          value: 3,
        }, {
          type: 'numeric',
          range: 'angle',
          value: 0,
        }] : '='
  ],
];
