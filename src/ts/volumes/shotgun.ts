///<reference path="./constants.ts"/>

const VOLUMETRIC_COMMANDS_SHOTGUN: VolumetricDrawCommand[] = [
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
    TYPE_ROTATE_Z,
    {
      type: 'numeric',
      range: 'angle',
      value: Math.PI/2,
    },
  ],  
  [
    TYPE_TRANSLATE_X,
    {
      type: 'numeric',
      range: 'integer',
      value: 6,
    },
  ],
  [
    TYPE_TRANSLATE_Z,
    {
      type: 'numeric',
      range: 'integer',
      value: 4,
    },
  ],
  [TYPE_CONTEXT_START],
    [
      TYPE_TRANSLATE_Y,
      {
        type: 'numeric',
        range: 'integer',
        value: 2,
      },
    ],
    [
      // barrels
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
        value: 8,
      },
    ],
    // hole
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
          value: 20,
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
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 8,
        },
      ],
    [
      TYPE_CONTEXT_END_REMATERIAL,
    ],
    [TYPE_SAVE_CONTEXT],
  [TYPE_CONTEXT_END_UNION],
  // 2nd barrel
  [TYPE_CONTEXT_START],
    [
      TYPE_TRANSLATE_Y,
      {
        type: 'numeric',
        range: 'integer',
        value: -4,
      },
    ],
    [TYPE_RESTORE_CONTEXT],
  [TYPE_CONTEXT_END_UNION],
  // grip
  [
    TYPE_MATERIAL_ID,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 2,
    },
  ],
  [
    TYPE_TRANSLATE_X,
    {
      type: 'numeric',
      range: 'integer',
      value: -14,
    },
  ],
  [
    TYPE_TRANSLATE_Z,
    {
      type: 'numeric',
      range: 'integer',
      value: -4,
    },
  ],
  [
    TYPE_ROTATE_Y,
    {
      type: 'numeric',
      range: 'angle',
      value: Math.PI/3,
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
      value: 4,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 12,
    },
  ],
];

const VOLUMETRIC_TEMPLATE_SHOTGUN = 'D<@@B.y^D>DDB-Zjx`z^.y\\DN>>B.#;DN<<B%!+.yV^+#<xLzVYeB@>F';
const VOLUMETRIC_SHOTGUN = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_SHOTGUN : VOLUMETRIC_TEMPLATE_SHOTGUN;