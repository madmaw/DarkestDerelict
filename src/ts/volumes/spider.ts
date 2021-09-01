///<reference path="./constants.ts"/>

const VOLUMETRIC_COMMANDS_SPIDER: VolumetricDrawCommand[] = [
  [
    TYPE_TRANSLATE_X,
    {
      type: 'numeric',
      range: 'integer',
      value: 4,
    }
  ],
  // abdomen
  [
    TYPE_CONTEXT_START,
  ],
    [
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: -10,
      }
    ],
    [
      TYPE_TRANSLATE_Z,
      {
        type: 'numeric',
        range: 'integer',
        value: 5,
      }
    ],
    [
      TYPE_SHAPE_SPHERE,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 10,
      }
    ],
    [TYPE_CONTEXT_START],
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
          value: 5,
        }
      ],
      [
        TYPE_SHAPE_BOX,
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 9,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 2,
        },
        {
          type: 'numeric',
          range: 'positive-integer',
          value: 5,
        },
      ],
    [TYPE_CONTEXT_END_REMATERIAL],
  [
    TYPE_CONTEXT_END_UNION
  ],
  // head
  [
    TYPE_TRANSLATE_X,
    {
      type: 'numeric',
      range: 'integer',
      value: -6,
    }
  ],
  [
    TYPE_CONTEXT_START
  ],
    [
      TYPE_SCALE_Z,
      {
        type: 'numeric',
        range: 'positive-float',
        value: .4,
      }
    ],
    [
      TYPE_SHAPE_SPHERE,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 5,
      }
    ],
  [
    TYPE_CONTEXT_END_UNION
  ],
  // legs  
  [
    TYPE_ROTATE_Z,
    {
      type: 'numeric',
      range: 'angle',
      value: -Math.PI/6,
    }
  ],
  [
    TYPE_CONTEXT_START
  ],
    [
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: 2,
      }
    ],
    [
      TYPE_ROTATE_Y,
      {
        type: 'numeric',
        range: 'angle',
        value: -Math.PI/4,
      }
    ],
    [
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: 1,
      }
    ],
    [
      TYPE_SHAPE_CAPSULE,
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
        value: 2,
      },
    ],
    [
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: 2,
      }
    ],
    [
      TYPE_ROTATE_Y,
      {
        type: 'numeric',
        range: 'angle',
        value: Math.PI/2,
      }
    ],
    [
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: 4,
      }
    ],
    [
      TYPE_SHAPE_CAPSULE,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 8,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 1,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 2,
      },
    ],
    [TYPE_SAVE_CONTEXT],
  [
    TYPE_CONTEXT_END_UNION
  ],
  [
    TYPE_CONTEXT_START
  ],
    [
      TYPE_ROTATE_Z,
      {
        type: 'numeric',
        range: 'angle',
        value: Math.PI/3,
      }
    ],
    [
      TYPE_RESTORE_CONTEXT
    ],  
  [
    TYPE_CONTEXT_END_UNION
  ],  
  [
    TYPE_CONTEXT_START
  ],
    [
      TYPE_SCALE_X,
      {
        type: 'numeric',
        range: 'positive-float',
        value: .5,
      }
    ],
    [
      TYPE_ROTATE_Z,
      {
        type: 'numeric',
        range: 'angle',
        value: Math.PI*2/3,
      }
    ],
    [
      TYPE_RESTORE_CONTEXT
    ],  
  [
    TYPE_CONTEXT_END_UNION
  ],  
  [
    TYPE_CONTEXT_START
  ],
    [
      TYPE_SCALE_X,
      {
        type: 'numeric',
        range: 'positive-float',
        value: .5,
      }
    ],
    [
      TYPE_ROTATE_Z,
      {
        type: 'numeric',
        range: 'angle',
        value: -Math.PI/3,
      }
    ],
    [
      TYPE_RESTORE_CONTEXT
    ],  
  [
    TYPE_CONTEXT_END_UNION
  ],
  [
    TYPE_CONTEXT_START
  ],
    [
      TYPE_ROTATE_Z,
      {
        type: 'numeric',
        range: 'angle',
        value: -Math.PI*2/3,
      }
    ],
    [
      TYPE_RESTORE_CONTEXT
    ],  
  [
    TYPE_CONTEXT_END_UNION
  ],        
  [
    TYPE_CONTEXT_START
  ],
    [
      TYPE_ROTATE_Z,
      {
        type: 'numeric',
        range: 'angle',
        value: Math.PI,
      }
    ],
    [
      TYPE_RESTORE_CONTEXT
    ],  
  [
    TYPE_CONTEXT_END_UNION
  ],        

  // eyes
  [
    TYPE_MATERIAL_ID,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 1,
    },
  ],  
  [
    TYPE_TRANSLATE_Z,
    {
      type: 'numeric',
      range: 'integer',
      value: 1,
    }
  ],
  [
    TYPE_TRANSLATE_X,
    {
      type: 'numeric',
      range: 'integer',
      value: 2,
    }
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 2,
    }
  ],
];

const VOLUMETRIC_TEMPLATE_SPIDER = 'BVV>#;.BTT>%';
const VOLUMETRIC_SPIDER = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_SPIDER : VOLUMETRIC_TEMPLATE_SPIDER;
