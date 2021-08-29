///<reference path="./constants.ts"/>

const VOLUMETRIC_COMMANDS_PISTOL: VolumetricDrawCommand[] = [
  [
    TYPE_TRANSLATE_Y,
    {
      type: 'numeric',
      range: 'integer',
      value: 6,
    },
  ],
  [
    TYPE_SHAPE_ROUNDING,
    {
      type: 'numeric',
      range: 'positive-float',
      value: 2,
    }
  ],
  // trigger 
  [
    TYPE_SHAPE_CYLINDER,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 2,
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
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_TRANSLATE_Y,
      {
        type: 'numeric',
        range: 'integer',
        value: 4,
      },
    ],
    [
      TYPE_SHAPE_CYLINDER,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 4,
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
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 8,
      },    
    ],    
  [
    TYPE_CONTEXT_END_SUBTRACTION,
  ],
  [
    TYPE_TRANSLATE_Z,
    {
      type: 'numeric',
      range: 'integer',
      value: 4,
    },
  ],

  [
    // barrel
    TYPE_SHAPE_BOX,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 6,
    },
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
  ],
  // hole
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_ROTATE_Z,
      {
        type: 'numeric',
        range: 'angle',
        value: Math.PI/2,
      },
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
        value: 20,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 4,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 4,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 6,
      },
    ],
  [
    TYPE_CONTEXT_END_REMATERIAL,
  ],
  // grip
  [
    TYPE_TRANSLATE_Y,
    {
      type: 'numeric',
      range: 'integer',
      value: -9,
    },
  ],
  [
    TYPE_TRANSLATE_Z,
    {
      type: 'numeric',
      range: 'integer',
      value: -6,
    },
  ],
  [
    TYPE_ROTATE_X,
    {
      type: 'numeric',
      range: 'angle',
      value: -Math.PI/10,
    },
  ],
  [
    TYPE_SHAPE_BOX,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 7,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 9,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 16,
    },
  ],
];

const VOLUMETRIC_TEMPLATE_PISTOL = 'y`RzD<BBB.y^D>DDB-z^B@NB.Zj#;DN>>@%yQzTXWBACJ';
const VOLUMETRIC_PISTOL = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_PISTOL : VOLUMETRIC_TEMPLATE_PISTOL;
