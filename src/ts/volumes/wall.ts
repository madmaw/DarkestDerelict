///<reference path="./constants.ts"/>

const WALL_INSET = 2;
const WALL_INSET_DIAMETER_INNER = 26;
const WALL_INSET_DIAMETER_OUTER = 28;

const VOLUMETRIC_COMMANDS_WALL: VolumetricDrawCommand[] = [
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
    TYPE_TRANSLATE_Z,
    {
      type: 'numeric',
      range: 'integer',
      value: FLOOR_DEPTH/2,
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
  [
    TYPE_MATERIAL_OUT_OF_BOUNDS,
  ],
  [
    TYPE_TRANSLATE_X,
    {
      type: 'numeric',
      range: 'integer',
      value: WALL_DIMENSION/2,
    },    
  ],
  [
    TYPE_TRANSLATE_Y,
    {
      type: 'numeric',
      range: 'integer',
      value: WALL_DIMENSION/2 - WALL_INSET,
    },    
  ],
  [
    TYPE_TRANSLATE_Z,
    {
      type: 'numeric',
      range: 'integer',
      value: WALL_DIMENSION/2 - WALL_INSET,
    },    
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 1,
    },
  ],
];
