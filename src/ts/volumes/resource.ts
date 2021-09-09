///<reference path="./constants.ts"/>
///<reference path="./colors.ts"/>

const VOLUMETRIC_COMMANDS_RESOURCE: VolumetricDrawCommand[] = [
  [
    TYPE_ROTATE_X,
    {
      type: 'ref',
      index: 3,
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
];

const VOLUMETRIC_TEMPLATE_RESOURCE = 'X3D<110.D<220-';
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
          range: 'angle',
          value: Math.PI/4,
        }] : '>R:b'
  ],
  // health missing 1
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
          range: 'angle',
          value: Math.PI/4,
        }] : '>RLb'
  ],                
  // power 2
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
          range: 'angle',
          value: 0,
        }] : '=R:Z' 
  ],
  // power missing 3
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
          range: 'angle',
          value: 0,
        }] : '=RJZ' 
  ],
];