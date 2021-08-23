const WALL_DIMENSION = 24;
const WALL_INSET = 2;
const WALL_INSET_DIAMETER_INNER = 22;
const WALL_INSET_DIAMETER_OUTER = 24;

const VOLUMETRIC_COMMANDS_WALL: VolumetricDrawCommand[] = [
  [
    TYPE_SHAPE_BOX,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_DIMENSION,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_DIMENSION,
    },
    {
      type: 'literal',
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
      type: 'literal',
      range: 'integer',
      value: (WALL_DIMENSION - WALL_INSET)/2,
    },    
  ],
  [
    TYPE_ROTATE_X,
    {
      type: 'literal',
      range: 'angle',
      value: Math.PI/4,
    },    
  ],
  [
    TYPE_SHAPE_CYLINDER,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_INSET,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_INSET_DIAMETER_INNER,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_INSET_DIAMETER_OUTER,
    },
    {
      type: 'literal',
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
    TYPE_ROTATE_Y,
    {
      type: 'literal',
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
    TYPE_ROTATE_Y,
    {
      type: 'literal',
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
    TYPE_ROTATE_Y,
    {
      type: 'literal',
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
