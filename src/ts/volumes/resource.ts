///<reference path="./constants.ts"/>
///<reference path="./colors.ts"/>

const VOLUMETRIC_COMMANDS_RESOURCE: VolumetricDrawCommand[] = [
  [
    TYPE_ROTATE_X,
    {
      type: 'ref',
      index: 5,
    },
  ],
  [
    TYPE_SHAPE_CYLINDER,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 2,
    },
    {
      type: 'ref',
      index: 1,
    },
    {
      type: 'ref',
      index: 1,
    },
    {
      type: 'ref',
      index: 0,
    },
  ],
  // internal hole
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_SHAPE_CYLINDER,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 2,
      },
      {
        type: 'ref',
        index: 2,
      },
      {
        type: 'ref',
        index: 2,
      },
      {
        type: 'ref',
        index: 0,
      },
    ],  
  [
    TYPE_CONTEXT_END_SUBTRACTION
  ],
  // external wrapper
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_SHAPE_CYLINDER,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 2,
      },
      {
        type: 'ref',
        index: 3,
      },
      {
        type: 'ref',
        index: 3,
      },
      {
        type: 'ref',
        index: 0,
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
          value: 2,
        },
        {
          type: 'ref',
          index: 4,
        },
        {
          type: 'ref',
          index: 4,
        },
        {
          type: 'ref',
          index: 0,
        },
      ],  
    [
      TYPE_CONTEXT_END_SUBTRACTION
    ],      
  [
    TYPE_CONTEXT_END_UNION
  ],  
];

const VOLUMETRIC_TEMPLATE_RESOURCE = 'X5D<110.D<220-.D<330.D<440-';
const VOLUMETRIC_RESOURCE = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_RESOURCE : VOLUMETRIC_TEMPLATE_RESOURCE;

const VOLUMETRIC_PARAMS_RESOURCE: [(Vector4 | string)[], ((NumericValue<ValueRange> | CharValue)[] | string)?][] = [
  // health 0
  [
    [COLOR_CYAN_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'numeric',
          range: 'positive-integer',
          value: 4,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 24,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'angle',
          value: Math.PI/4,
        }] : '>R:::b'
  ],

  // health shielded 1
  [
    [COLOR_CYAN_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'numeric',
          range: 'positive-integer',
          value: 4,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 24,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 34,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 30,
        }, {
          type: 'numeric',
          range: 'angle',
          value: Math.PI/4,
        }] : '>R:\\Xb'
  ],      
  // health missing 2
  [
    [COLOR_CYAN_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'numeric',
          range: 'positive-integer',
          value: 4,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 24,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 18,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'angle',
          value: Math.PI/4,
        }] : '>RL::b'
  ],            
  // health missing shielded 3
  [
    [COLOR_CYAN_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'numeric',
          range: 'positive-integer',
          value: 4,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 24,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 18,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 34,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 30,
        }, {
          type: 'numeric',
          range: 'angle',
          value: Math.PI/4,
        }] : '>RL\\Xb'
  ],            
  // power 4
  [
    [COLOR_CYAN_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'numeric',
          range: 'positive-integer',
          value: 3,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 24,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'angle',
          value: 0,
        }] : '=R:::Z' 
  ],
  // power shielded 5
  [
    [COLOR_CYAN_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'numeric',
          range: 'positive-integer',
          value: 3,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 24,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 34,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 30,
        }, {
          type: 'numeric',
          range: 'angle',
          value: 0,
        }] : '=R:\\ZZ'  
  ],            
  // power missing 6
  [
    [COLOR_CYAN_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'numeric',
          range: 'positive-integer',
          value: 3,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 24,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 16,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 0,
        }, {
          type: 'numeric',
          range: 'angle',
          value: 0,
        }] : '=RJ::Z' 
  ],              
  // power missing shielded 7
  [
    [COLOR_CYAN_GLOWING], 
    FLAG_USE_VOLUME_COMMANDS 
        ? [{
          type: 'numeric',
          range: 'positive-integer',
          value: 3,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 24,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 16,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 34,
        }, {
          type: 'numeric',
          range: 'positive-integer',
          value: 30,
        }, {
          type: 'numeric',
          range: 'angle',
          value: 0,
        }] : '=RJ\\ZZ' 
  ],
];