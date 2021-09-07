///<reference path="./constants.ts"/>

const VOLUMETRIC_COMMANDS_KEY: VolumetricDrawCommand[] = [
  [
    TYPE_ROTATE_Z,
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
      value: 16,
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
  [TYPE_CONTEXT_START],
    [
      TYPE_TRANSLATE_X,
      {
        type: 'numeric',
        range: 'integer',
        value: 6,  
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
        value: 3,  
      }
    ],
    [
      TYPE_SHAPE_CAPSULE,
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 6,
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
  [TYPE_CONTEXT_END_UNION],
  [TYPE_CONTEXT_START],
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
        value: 2,  
      }
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
        value: 2,
      },
      {
        type: 'numeric',
        range: 'positive-integer',
        value: 2,
      },
    ],
  [TYPE_CONTEXT_END_UNION],
  [
    TYPE_TRANSLATE_X,
    {
      type: 'numeric',
      range: 'integer',
      value: -12,  
    }
  ],
  [
    TYPE_ROTATE_Z,
    {
      type: 'numeric',
      range: 'angle',
      value: Math.PI/2,  
    }
  ],
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
      value: 12,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 12,
    },
    {
      type: 'numeric',
      range: 'positive-integer',
      value: 6,
    },
  ],
  [TYPE_CONTEXT_START],
    [
      TYPE_TRANSLATE_Y,
      {
        type: 'numeric',
        range: 'integer',
        value: 2,  
      }
    ],  
    [
      TYPE_SHAPE_CAPSULE,
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
        value: 4,
      },
    ],  
  [TYPE_CONTEXT_END_SUBTRACTION],
];

const VOLUMETRIC_TEMPLATE_KEY = 'Zjx^CJ<<.x`Yjx]C@<<+.x\\Yjx\\C><<+xNZjD<FF@.y\\C@>>-';
const VOLUMETRIC_KEY = FLAG_USE_VOLUME_COMMANDS ? VOLUMETRIC_COMMANDS_KEY : VOLUMETRIC_TEMPLATE_KEY;
