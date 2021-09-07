///<reference path="./constants.ts"/>

const WALL_INSET = 2;
const WALL_INSET_DIAMETER_INNER = 26;
const WALL_INSET_DIAMETER_OUTER = 28;

const VOLUMETRIC_COMMANDS_WALL_INSET: VolumetricDrawCommand[] = [
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
      value: WALL_DIMENSION,
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
      value: (WALL_DIMENSION - WALL_INSET)/2,
    },    
  ],
  [
    TYPE_ROTATE_X,
    {
      type: 'numeric',
      range: 'angle',
      value: Math.PI/4,
    },    
  ],
  [
    TYPE_SHAPE_CYLINDER,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: WALL_INSET,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: WALL_INSET_DIAMETER_INNER,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: WALL_INSET_DIAMETER_OUTER,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 4,
    },
  ],
  [ 
    TYPE_SAVE_CONTEXT,
  ],  
  [
    TYPE_CONTEXT_END_SUBTRACTION,
  ],
  [
    TYPE_CONTEXT_START,
  ],
  [
    TYPE_ROTATE_Z,
    {
      type: 'numeric',
      range: 'angle',
      value: Math.PI,
    },    
  ],
  [
    TYPE_RESTORE_CONTEXT,
  ],
  [
    TYPE_CONTEXT_END_SUBTRACTION,
  ],
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
    TYPE_RESTORE_CONTEXT,
  ],
  [
    TYPE_CONTEXT_END_SUBTRACTION,
  ],
  [
    TYPE_CONTEXT_START,
  ],
  [
    TYPE_ROTATE_Z,
    {
      type: 'numeric',
      range: 'angle',
      value: -Math.PI/2,
    },    
  ],
  [
    TYPE_RESTORE_CONTEXT,
  ],
  [
    TYPE_CONTEXT_END_SUBTRACTION,
  ],
];
const VOLUMETRIC_TEMPLATE_WALL_INSET = 'BVVV.xgz\\XbD<TV>!-.Zz^-.Zj^-.ZJ^-?xhyfzfS;';
const VOLUMETRIC_WALL_INSET = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_WALL_INSET : VOLUMETRIC_TEMPLATE_WALL_INSET;

