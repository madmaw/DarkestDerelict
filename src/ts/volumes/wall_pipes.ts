///<reference path="./constants.ts"/>

const PIPE_DIAMETER = (WALL_DIMENSION - FLOOR_DEPTH * 2)/3;

const VOLUMETRIC_COMMANDS_WALL_PIPES: VolumetricDrawCommand[] = [
  // ceiling
  [
    TYPE_TRANSLATE_Z,
    {
      type: 'numeric',
      range: 'integer',
      value: (WALL_DIMENSION - FLOOR_DEPTH)/2,
    }
  ],
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
      value: FLOOR_DEPTH,
    },
  ],
  // floor
  [
    TYPE_TRANSLATE_Z,
    {
      type: 'numeric',
      range: 'integer',
      value: -(WALL_DIMENSION - FLOOR_DEPTH),
    }
  ],
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
      value: FLOOR_DEPTH,
    },
  ],
  // separators
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_TRANSLATE_Z,
      {
        type: 'numeric',
        range: 'integer',
        value: (WALL_DIMENSION - FLOOR_DEPTH)/2,
      }
    ],
    [
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: (WALL_DIMENSION - FLOOR_DEPTH)/2,
      }
    ],
    [
      TYPE_SHAPE_BOX,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: FLOOR_DEPTH,
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
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: -(WALL_DIMENSION - FLOOR_DEPTH),
      }
    ],
    [
      TYPE_SHAPE_BOX,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: FLOOR_DEPTH,
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
    TYPE_CONTEXT_END_UNION
  ],
  // pipes
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_MATERIAL_ID,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 2,
      },
    ],
    [
      TYPE_TRANSLATE_Z,
      {
        type: 'numeric',
        range: 'integer',
        value: (FLOOR_DEPTH + PIPE_DIAMETER)/2,
      }
    ],
    [
      TYPE_TRANSLATE_Y,
      {
        type: 'numeric',
        range: 'integer',
        value: (WALL_DIMENSION - PIPE_DIAMETER)/2 - 1,
      }
    ],
    [
      TYPE_SHAPE_CYLINDER,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: WALL_DIMENSION,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: PIPE_DIAMETER,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: PIPE_DIAMETER,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 40,
      },
    ],
    [
      TYPE_TRANSLATE_Z,
      {
        type: 'numeric',
        range: 'integer',
        value: PIPE_DIAMETER,
      }
    ],
    [
      TYPE_SHAPE_CYLINDER,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: WALL_DIMENSION,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: PIPE_DIAMETER,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: PIPE_DIAMETER,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 40,
      },
    ],
    [
      TYPE_TRANSLATE_Z,
      {
        type: 'numeric',
        range: 'integer',
        value: PIPE_DIAMETER,
      }
    ],
    [
      TYPE_SHAPE_CYLINDER,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: WALL_DIMENSION,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: PIPE_DIAMETER,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: PIPE_DIAMETER,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 40,
      },
    ],
    [
      TYPE_SAVE_CONTEXT,
    ],
  [ 
    TYPE_CONTEXT_END_UNION
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
  ]
];
const VOLUMETRIC_TEMPLATE_WALL_PIPES = 'zgBVV<z@BVV<.zgxgB<VVx@B<VV+.#<z_ycDVBBbzbDVBBbzbDVBBb!+Zz^';
const VOLUMETRIC_WALL_PIPES = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_WALL_PIPES : VOLUMETRIC_TEMPLATE_WALL_PIPES;

