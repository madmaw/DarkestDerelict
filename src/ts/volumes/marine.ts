///<reference path="../sprite.ts"/>

const MARINE_LEFT_SHOULDER_INDEX = 0;
const MARINE_RIGHT_SHOULDER_INDEX = 1;

const MARINE_ANIMAITON_NEUTRAL = 0;
const MARINE_ANIMATION_WALK_1 = 1;
const MARING_ANIMAITON_WALK_2 = 2;

const ANIMATIONS_MARINE: SpriteAnimationSequence[] = [
  [
    {
      frames: 1,
      tweens: [
        // left shoulder
        {
          range: 'angle',
          from: 0,
          to: 0,
        },
        // right shoulder
        {
          range: 'angle',
          from: 0,
          to: 0,
        }
      ],
    }
  ],
  [
    {
      frames: 4,
      tweens: [
        // left shoulder
        {
          range: 'angle',
          from: 0,
          to: -Math.PI/4,
        },
        // right shoulder
        {
          range: 'angle',
          from: 0,
          to: Math.PI/4,
        }
      ],
    },
    {
      frames: 8,
      tweens: [
        // left shoulder
        {
          range: 'angle',
          from: -Math.PI/4,
          to: Math.PI/4,
        },
        // right shoulder
        {
          range: 'angle',
          from: Math.PI/4,
          to: -Math.PI/4,
        }
      ],
    },
    {
      frames: 4,
      tweens: [
        // left shoulder
        {
          range: 'angle',
          from: Math.PI/4,
          to: 0,
        },
        // right shoulder
        {
          range: 'angle',
          from: -Math.PI/4,
          to: 0,
        }
      ],
    }    
  ],
];

const VOLUMETRIC_COMMANDS_MARINE: VolumetricDrawCommand[] = [
  // shoulders
  [
    TYPE_CONTEXT_START,
  ],
  [
    TYPE_ROTATE_Y, 
    {
      type: 'literal',
      value: Math.PI/2,
      range: 'angle'
    },
  ],
  [
    TYPE_SHAPE_CAPSULE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: 9,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: 5,
    },
    {
      type: 'literal',
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
    TYPE_TRANSLATE_Y, 
    {
      type: 'literal',
      value: 4,
      range: 'integer'
    },
  ],
  [
    TYPE_TRANSLATE_X, 
    {
      type: 'literal',
      value: 1,
      range: 'integer'
    },
  ],
  [
    TYPE_SCALE_Y, 
    {
      type: 'literal',
      value: 1.2,
      range: 'positive-float'
    },
  ],
  [
    TYPE_SHAPE_SPHERE,
    {
      type: 'literal',
      value: 6,
      range: 'positive-integer',
    },
  ],
  [
    TYPE_CONTEXT_END_UNION,
  ],
  // torso
  [
    TYPE_CONTEXT_START,
  ],
  [
    TYPE_TRANSLATE_Y, 
    {
      type: 'literal',
      value: -5,
      range: 'integer'
    },
  ],
  [
    TYPE_SCALE_X, 
    {
      type: 'literal',
      value: 0.8,
      range: 'positive-float'
    },
  ],
  [
    TYPE_ROTATE_Z, 
    {
      type: 'literal',
      value: -Math.PI/2,
      range: 'angle'
    },
  ],
  [
    TYPE_SHAPE_CAPSULE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: 7,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: 11,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: 7,
    },
  ],  
  [
    TYPE_CONTEXT_END_UNION,
  ],
  // left upper arm
  [
    TYPE_CONTEXT_START,
  ],
  [
    TYPE_TRANSLATE_Z, 
    {
      type: 'literal',
      value: -5,
      range: 'integer'
    },
  ],
  [
    TYPE_ROTATE_Z, 
    {
      type: 'literal',
      value: -Math.PI/2,
      range: 'angle'
    },
  ],
  [
    TYPE_ROTATE_Z, 
    {
      type: 'ref',
      index: MARINE_LEFT_SHOULDER_INDEX,
    },
  ],
  [
    TYPE_TRANSLATE_X, 
    {
      type: 'literal',
      value: -2,
      range: 'integer'
    },
  ],
  [
    TYPE_SHAPE_CAPSULE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: 4,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: 4,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: 4,
    },
  ],
  // left fore arm
  [
    TYPE_TRANSLATE_X, 
    {
      type: 'literal',
      value: -4,
      range: 'integer'
    },
  ],
  [
    TYPE_ROTATE_Z, 
    {
      type: 'literal',
      value: -Math.PI/2,
      range: 'angle'
    },
  ],
  [
    TYPE_TRANSLATE_X, 
    {
      type: 'literal',
      value: -2,
      range: 'integer'
    },
  ],
  [
    TYPE_SHAPE_CAPSULE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: 4,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: 3,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: 2,
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
    TYPE_TRANSLATE_Z, 
    {
      type: 'literal',
      value: 5,
      range: 'integer'
    },
  ],
  [
    TYPE_ROTATE_Z, 
    {
      type: 'literal',
      value: -Math.PI/2,
      range: 'angle'
    },
  ],
  [
    TYPE_ROTATE_Z, 
    {
      type: 'ref',
      index: MARINE_RIGHT_SHOULDER_INDEX,
    },
  ],
  [
    TYPE_TRANSLATE_X, 
    {
      type: 'literal',
      value: -2,
      range: 'integer'
    },
  ],
  [
    TYPE_SHAPE_CAPSULE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: 4,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: 4,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: 4,
    },
  ],
  // right fore arm
  [
    TYPE_TRANSLATE_X, 
    {
      type: 'literal',
      value: -4,
      range: 'integer'
    },
  ],
  [
    TYPE_ROTATE_Z, 
    {
      type: 'literal',
      value: -Math.PI/3,
      range: 'angle'
    },
  ],
  [
    TYPE_TRANSLATE_X, 
    {
      type: 'literal',
      value: -2,
      range: 'integer'
    },
  ],
  [
    TYPE_SHAPE_CAPSULE,
    {
      type: 'literal',
      range: 'positive-integer',
      value: 4,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: 3,
    },
    {
      type: 'literal',
      range: 'positive-integer',
      value: 2,
    },
  ],
  [
    TYPE_CONTEXT_END_UNION,
  ],      
]