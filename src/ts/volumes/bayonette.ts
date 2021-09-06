///<reference path="./colors.ts"/>

const VOLUMETRIC_COMMANDS_BAYONET: VolumetricDrawCommand[] = [
  [
    TYPE_ROTATE_Z,
    {
      type: 'numeric',
      range: 'angle',
      value: -Math.PI/2,
    }
  ],
  [
    TYPE_TRANSLATE_X,
    {
      type: 'numeric',
      range: 'integer',
      value: -5,
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
      value: 4,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 16,
    },
  ],
  [
    TYPE_TRANSLATE_Z,
    {
      type: 'numeric',
      range: 'integer',
      value: -2,
    },
  ],
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_TRANSLATE_Z,
      {
        type: 'numeric',
        range: 'integer',
        value: 5,
      },
    ],
    [
      TYPE_SHAPE_CAPSULE,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 4,
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
  [
    TYPE_CONTEXT_END_SUBTRACTION
  ],
  // blade
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_MATERIAL_ID,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 1,
      }
    ],
    [
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: 8,
      },
    ],
    [
      TYPE_TRANSLATE_Z,
      {
        type: 'numeric',
        range: 'integer',
        value: 1,
      },
    ],
    [
      TYPE_SCALE_Y,
      {
        type: 'numeric',
        range: 'positive-float',
        value: .3,
      }
    ],
    [
      TYPE_SHAPE_CAPSULE,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 14,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 10,
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
        TYPE_TRANSLATE_Z,
        {
          type: 'numeric',
          range: 'integer',
          value: 5,  
        }
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
          value: 10,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 7,
        },
      ],
    [
      TYPE_CONTEXT_END_SUBTRACTION,
    ],
  [
    TYPE_CONTEXT_END_UNION
  ],
  //handle
  [
    TYPE_MATERIAL_ID,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 2,
    }
  ],
  [
    TYPE_SCALE_Y,
    {
      type: 'numeric',
      range: 'positive-float',
      value: .8,
    }
  ],  
  [
    TYPE_TRANSLATE_X,
    {
      type: 'numeric',
      range: 'integer',
      value: -5,
    },
  ],
  [
    TYPE_SHAPE_CYLINDER,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 8,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 6,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 6,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 6,
    },
  ],  
];

const VOLUMETRIC_BAYONET = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_BAYONET : '';

const VOLUMETRIC_PARAMS_BAYONET: [(Vector4 | string)[], ((NumericValue<ValueRange> | CharValue)[] | string)?][] = [
  [
    [COLOR_GUNMETAL, COLOR_WHITE_SHINY, COLOR_LEATHER], 
  ],
];
