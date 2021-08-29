///<reference path="../sprite.ts"/>

const VOLUMETRIC_COMMANDS_MARINE: VolumetricDrawCommand[] = [
   // hips
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_TRANSLATE_X, 
      {
        type: 'numeric',
        value: 1,
        range: 'integer'
      },
    ],
    [
      TYPE_ROTATE_Z, 
      {
        type: 'numeric',
        value: Math.PI/2,
        range: 'angle'
      },
    ],
    [
      TYPE_SHAPE_CAPSULE,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 3,
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
    ],  
  [
    TYPE_CONTEXT_END_UNION,
  ],
  // left thigh
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_TRANSLATE_Y, 
      {
        type: 'numeric',
        value: 1,
        range: 'integer'
      },
    ],
    // [
    //   TYPE_ROTATE_Z, 
    //   {
    //     type: 'numeric',
    //     value: Math.PI/6,
    //     range: 'angle'
    //   },
    // ],
    [
      TYPE_ROTATE_X, 
      {
        type: 'numeric',
        value: Math.PI/9,
        range: 'angle'
      },
    ],
    [
      TYPE_ROTATE_Y, 
      {
        type: 'numeric',
        value: -Math.PI/2,
        range: 'angle'
      },
    ],
    [
      TYPE_TRANSLATE_X, 
      {
        type: 'numeric',
        value: -3,
        range: 'integer'
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
        value: 6,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 5,
      },
    ],  
    // left calf
    [
      TYPE_TRANSLATE_X, 
      {
        type: 'numeric',
        value: -4,
        range: 'integer'
      },
    ],
    // [
    //   TYPE_ROTATE_X, 
    //   {
    //     type: 'numeric',
    //     value: Math.PI/9,
    //     range: 'angle'
    //   },
    // ],
    [
      TYPE_ROTATE_Z, 
      {
        type: 'numeric',
        value: Math.PI/9,
        range: 'angle'
      },
    ],
    [
      TYPE_ROTATE_Y, 
      {
        type: 'numeric',
        value: Math.PI/20,
        range: 'angle'
      },
    ],
    [
      TYPE_TRANSLATE_X, 
      {
        type: 'numeric',
        value: -2,
        range: 'integer'
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
        value: 5,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 4,
      },
    ],  
    // left foot
    [
      TYPE_TRANSLATE_X, 
      {
        type: 'numeric',
        value: -3,
        range: 'integer'
      },
    ],
    // [
    //   TYPE_ROTATE_X, 
    //   {
    //     type: 'numeric',
    //     value: Math.PI/4,
    //     range: 'angle'
    //   },
    // ],    
    [
      TYPE_ROTATE_Y, 
      {
        type: 'numeric',
        value: -Math.PI/2,
        range: 'angle'
      },
    ],
    [
      TYPE_TRANSLATE_X, 
      {
        type: 'numeric',
        value: -2,
        range: 'integer'
      },
    ],
    [
      TYPE_SCALE_Y, 
      {
        type: 'numeric',
        value: 1.5,
        range: 'positive-float'
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
        value: 3,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 2,
      },      
    ],    
  [
    TYPE_CONTEXT_END_UNION,
  ],  
  // right thigh
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_TRANSLATE_Y, 
      {
        type: 'numeric',
        value: -1,
        range: 'integer'
      },
    ],
    // [
    //   TYPE_ROTATE_Z, 
    //   {
    //     type: 'numeric',
    //     value: Math.PI/6,
    //     range: 'angle'
    //   },
    // ],
    [
      TYPE_ROTATE_X, 
      {
        type: 'numeric',
        value: -Math.PI/9,
        range: 'angle'
      },
    ],
    [
      TYPE_ROTATE_Y, 
      {
        type: 'numeric',
        value: -Math.PI/2,
        range: 'angle'
      },
    ],
    [
      TYPE_TRANSLATE_X, 
      {
        type: 'numeric',
        value: -3,
        range: 'integer'
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
        value: 6,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 5,
      },
    ],  
    // right calf
    [
      TYPE_TRANSLATE_X, 
      {
        type: 'numeric',
        value: -4,
        range: 'integer'
      },
    ],
    // [
    //   TYPE_ROTATE_X, 
    //   {
    //     type: 'numeric',
    //     value: -Math.PI/9,
    //     range: 'angle'
    //   },
    // ],
    [
      TYPE_ROTATE_Z, 
      {
        type: 'numeric',
        value: -Math.PI/9,
        range: 'angle'
      },
    ],
    [
      TYPE_ROTATE_Y, 
      {
        type: 'numeric',
        value: Math.PI/20,
        range: 'angle'
      },
    ],
    [
      TYPE_TRANSLATE_X, 
      {
        type: 'numeric',
        value: -2,
        range: 'integer'
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
        value: 5,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 4,
      },
    ],  
    // right foot
    [
      TYPE_TRANSLATE_X, 
      {
        type: 'numeric',
        value: -3,
        range: 'integer'
      },
    ],
    // [
    //   TYPE_ROTATE_X, 
    //   {
    //     type: 'numeric',
    //     value: -Math.PI/4,
    //     range: 'angle'
    //   },
    // ],    
    [
      TYPE_ROTATE_Y, 
      {
        type: 'numeric',
        value: -Math.PI/2,
        range: 'angle'
      },
    ],
    [
      TYPE_TRANSLATE_X, 
      {
        type: 'numeric',
        value: -2,
        range: 'integer'
      },
    ],
    [
      TYPE_SCALE_Y, 
      {
        type: 'numeric',
        value: 1.5,
        range: 'positive-float'
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
        value: 3,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 2,
      },      
    ],
  [
    TYPE_CONTEXT_END_UNION,
  ],    
  // upper body
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_TRANSLATE_Z,
      {
        type: 'numeric',
        range: 'integer',
        value: 8,
      }
    ],
    // shoulders
    [
      TYPE_CONTEXT_START,
    ],
      [
        TYPE_ROTATE_Z, 
        {
          type: 'numeric',
          value: Math.PI/2,
          range: 'angle'
        },
      ],
      [
        TYPE_SHAPE_CAPSULE,
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 9,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 5,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 5,
        },
      ],  
    [
      TYPE_CONTEXT_END_UNION,
    ],
    // head   
    [
      TYPE_CONTEXT_START,
    ],
      [
        TYPE_TRANSLATE_Z, 
        {
          type: 'numeric',
          value: 4,
          range: 'integer'
        },
      ],
      [
        TYPE_TRANSLATE_X, 
        {
          type: 'numeric',
          value: 1,
          range: 'integer'
        },
      ],
      // helmet
      [
        TYPE_CONTEXT_START,
      ],
        [
          TYPE_SCALE_Z, 
          {
            type: 'numeric',
            value: 1.2,
            range: 'positive-float'
          },
        ],
        [
          TYPE_SHAPE_SPHERE,
          {
            type: 'numeric',
            value: 6,
            range: 'positive-integer',
          },
        ],
      [
        TYPE_CONTEXT_END_UNION,
      ],
      // visor
      [
        TYPE_CONTEXT_START,
      ],
        [
          TYPE_MATERIAL_ID,
          {
            type: 'numeric',
            value: 1,
            range: 'positive-integer',
          }
        ],
        [
          TYPE_SCALE_Z, 
          {
            type: 'numeric',
            value: .6,
            range: 'positive-float'
          },
        ],  
        [
          TYPE_TRANSLATE_X, 
          {
            type: 'numeric',
            value: 2,
            range: 'integer'
          },
        ],
        [
          TYPE_SHAPE_SPHERE,
          {
            type: 'numeric',
            range: 'positive-integer',
            value: 5,
          },
        ],
      [
        TYPE_CONTEXT_END_REMATERIAL,
      ],
    [
      TYPE_CONTEXT_END_UNION,
    ],
    // torso
    [
      TYPE_CONTEXT_START,
    ],
      [
        TYPE_TRANSLATE_Z, 
        {
          type: 'numeric',
          value: -4,
          range: 'integer'
        },
      ],
      [
        TYPE_SCALE_X, 
        {
          type: 'numeric',
          value: 0.7,
          range: 'positive-float'
        },
      ],
      [
        TYPE_ROTATE_Y, 
        {
          type: 'numeric',
          value: -Math.PI/2,
          range: 'angle'
        },
      ],
      [
        TYPE_SHAPE_CAPSULE,
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 5,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 11,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 7,
        },
      ],
    [
      TYPE_CONTEXT_END_UNION,
    ],
    // logo
    // [
    //   TYPE_CONTEXT_START,
    // ],
    //   [
    //     TYPE_MATERIAL_ID,
    //     {
    //       type: 'numeric',
    //       range: 'positive-integer',
    //       value: 2,
    //     },  
    //   ],
    //   [
    //     TYPE_TRANSLATE_Z, 
    //     {
    //       type: 'numeric',
    //       value: -1,
    //       range: 'integer'
    //     },
    //   ],
    //   [
    //     TYPE_ROTATE_Y, 
    //     {
    //       type: 'numeric',
    //       value: -Math.PI/2,
    //       range: 'angle'
    //     },
    //   ],
    //   [
    //     TYPE_ROTATE_Z, 
    //     {
    //       type: 'numeric',
    //       value: Math.PI/2,
    //       range: 'angle'
    //     },
    //   ],
    //   [
    //     TYPE_SHAPE_EMOJI,
    //     {
    //       type: 'char',
    //       value: '🐱',
    //       //value: 'A',
    //     },
    //     {
    //       type: 'numeric',
    //       range: 'positive-integer',
    //       value: 5,
    //     },
    //     {
    //       type: 'numeric',
    //       range: 'positive-integer',
    //       value: 12,
    //     },
    //   ],
    // [
    //   TYPE_CONTEXT_END_REMATERIAL,
    // ],    
    // left upper arm
    [
      TYPE_CONTEXT_START,
    ],
      [
        TYPE_TRANSLATE_Y, 
        {
          type: 'numeric',
          value: -5,
          range: 'integer'
        },
      ],
      [
        TYPE_ROTATE_Y, 
        {
          type: 'numeric',
          value: -Math.PI*3/7,
          range: 'angle'
        },
      ],
      [
        TYPE_TRANSLATE_X, 
        {
          type: 'numeric',
          value: -2,
          range: 'integer'
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
          value: 4,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 3,
        },
      ],
      // left fore arm
      [
        TYPE_TRANSLATE_X, 
        {
          type: 'numeric',
          value: -4,
          range: 'integer'
        },
      ],
      [
        TYPE_ROTATE_Y, 
        {
          type: 'numeric',
          value: -Math.PI/3,
          range: 'angle'
        },
      ],
      [
        TYPE_TRANSLATE_X, 
        {
          type: 'numeric',
          value: -2,
          range: 'integer'
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
          value: 3,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 2,
        },
      ],
      // left hand
      [
        TYPE_TRANSLATE_X, 
        {
          type: 'numeric',
          value: -4,
          range: 'integer'
        },
      ],
      [
        TYPE_SHAPE_SPHERE,
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 3,
        },
      ],      
    [
      TYPE_CONTEXT_END_UNION,
    ],
    // right upper arm
    [
      TYPE_CONTEXT_START,
    ],
      [
        TYPE_TRANSLATE_Y, 
        {
          type: 'numeric',
          value: 5,
          range: 'integer'
        },
      ],
      [
        TYPE_ROTATE_Y, 
        {
          type: 'numeric',
          value: -Math.PI*3/7,
          range: 'angle'
        },
      ],
      [
        TYPE_TRANSLATE_X, 
        {
          type: 'numeric',
          value: -2,
          range: 'integer'
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
          value: 5,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 3,
        },
      ],
      // right fore arm
      [
        TYPE_TRANSLATE_X, 
        {
          type: 'numeric',
          value: -4,
          range: 'integer'
        },
      ],
      [
        TYPE_ROTATE_Y, 
        {
          type: 'numeric',
          value: -Math.PI/3,
          range: 'angle'
        },
      ],
      [
        TYPE_TRANSLATE_X, 
        {
          type: 'numeric',
          value: -2,
          range: 'integer'
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
          value: 3,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 2,
        },
      ],
      // right hand
      [
        TYPE_TRANSLATE_X, 
        {
          type: 'numeric',
          value: -4,
          range: 'integer'
        },
      ],
      [
        TYPE_SHAPE_SPHERE,
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 3,
        },
      ],
    [
      TYPE_CONTEXT_END_UNION,
    ],
  [
    TYPE_CONTEXT_END_UNION,
  ],
];

const VOLUMETRIC_TEMPLATE_MARINE = '.x[ZjC=>>+.y[X^YJxWC>@?xVZ^Y\\xXC>?>xWYJxXhjC>=<+.yYXVYJxWC>@?xVZVY\\xXC>?>xWYJxXhjC>=<+.zb.ZjCC??+.z^x[.d`S@+.#;dMx\\S?%+.zVwPYJC?EA+.yUYLxXC>>=xVYOxXC>=<xVS=+.y_YLxXC>?=xVYOxXC>=<xVS='
const VOLUMETRIC_MARINE = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_MARINE : VOLUMETRIC_TEMPLATE_MARINE;