const WALL_DIMENSION = 24;
const WALL_BOLT_INSET = 3;
const WALL_BOLT_DIAMETER = 3;
const WALL_BOLT_OFFSET = 18;

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
  // +ve x
  [
    TYPE_TRANSLATE_X,
    {
      type: "literal",
      range: 'integer',
      value: WALL_DIMENSION/2,
    }
  ],
  [
    TYPE_TRANSLATE_Y,
    {
      type: "literal",
      range: 'integer',
      value: WALL_BOLT_OFFSET/2,
    }
  ],
  [
    TYPE_TRANSLATE_Z,
    {
      type: "literal",
      range: 'integer',
      value: WALL_BOLT_OFFSET/2,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],
  [
    TYPE_TRANSLATE_Y,
    {
      type: "literal",
      range: 'integer',
      value: -WALL_BOLT_OFFSET,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],
  [
    TYPE_TRANSLATE_Z,
    {
      type: "literal",
      range: 'integer',
      value: -WALL_BOLT_OFFSET,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],
  [
    TYPE_TRANSLATE_Y,
    {
      type: "literal",
      range: 'integer',
      value: WALL_BOLT_OFFSET,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],
  // -ve x
  [
    TYPE_TRANSLATE_X,
    {
      type: "literal",
      range: 'integer',
      value: -WALL_DIMENSION,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],
  [
    TYPE_TRANSLATE_Z,
    {
      type: "literal",
      range: 'integer',
      value: WALL_BOLT_OFFSET,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],
  [
    TYPE_TRANSLATE_Y,
    {
      type: "literal",
      range: 'integer',
      value: -WALL_BOLT_OFFSET,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],
  [
    TYPE_TRANSLATE_Z,
    {
      type: "literal",
      range: 'integer',
      value: -WALL_BOLT_OFFSET,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],
  // -ve z
  [
    TYPE_TRANSLATE_Z,
    {
      type: "literal",
      range: 'integer',
      value: -WALL_BOLT_INSET,
    }
  ],
  [
    TYPE_TRANSLATE_X,
    {
      type: "literal",
      range: 'integer',
      value: WALL_BOLT_INSET,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],
  [
    TYPE_TRANSLATE_X,
    {
      type: "literal",
      range: 'integer',
      value: WALL_BOLT_OFFSET,
    }
  ],
  [
    TYPE_TRANSLATE_Y,
    {
      type: "literal",
      range: 'integer',
      value: WALL_BOLT_OFFSET,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],  
  [
    TYPE_TRANSLATE_Z,
    {
      type: "literal",
      range: 'integer',
      value: WALL_DIMENSION,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],  
  [
    TYPE_TRANSLATE_X,
    {
      type: "literal",
      range: 'integer',
      value: -WALL_BOLT_OFFSET,
    }
  ],
  [
    TYPE_TRANSLATE_Y,
    {
      type: "literal",
      range: 'integer',
      value: -WALL_BOLT_OFFSET,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: WALL_BOLT_DIAMETER,
    }
  ],  

];
