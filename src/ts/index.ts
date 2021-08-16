///<reference path="./flags.ts"/>
///<reference path="./constants.ts"/>
///<reference path="./volumetric.ts"/>
///<reference path="./gl.ts"/>

const { volume } = processCommands(
    [
      /*
      // shoulders
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
        TYPE_TRANSLATE_Z, 
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
          value: 7,
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
          value: -1,
          range: 'integer'
        },
      ],
      [
        TYPE_ROTATE_Z, 
        {
          type: 'literal',
          value: Math.PI/2,
          range: 'angle'
        },
      ],
      [
        TYPE_SCALE_Z, 
        {
          type: 'literal',
          value: 0.8,
          range: 'positive-float'
        },
      ],
      [
        TYPE_SHAPE_CAPSULE,
        {
          type: 'literal',
          range: 'positive-integer',
          value: 2,
        },
        {
          type: 'literal',
          range: 'positive-integer',
          value: 11,
        },
        {
          type: 'literal',
          range: 'positive-integer',
          value: 9,
        },
      ],  
      [
        TYPE_CONTEXT_END_UNION,
      ],
      */
      [
        TYPE_SHAPE_BOX,
        {
          type: 'literal',
          range: 'positive-integer',
          value: 10,
        },
        {
          type: 'literal',
          range: 'positive-integer',
          value: 10,
        },
        {
          type: 'literal',
          range: 'positive-integer',
          value: 10,
        },
      ],
      [
        TYPE_TRANSLATE_Y, 
        {
          type: 'literal',
          value: 7,
          range: 'integer'
        },
      ],
      [
        TYPE_SHAPE_BOX,
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
    ],
    [],
);

console.log(volume);

const bounds = calculateVolumeBounds(volume);
//const bounds: Rect3 = [[Math.min(minx, minz), miny, Math.min(minx, minz)], [Math.max(maxx, maxz), maxy, Math.max(maxx, maxz)]];

console.log(bounds);

const [textureCanvas, textureCanvasBounds] = volumeToCanvas(volume, bounds);
d.appendChild(textureCanvas);

const canvas = document.createElement('canvas');
canvas.className = 'c';
canvas.width = 512;
canvas.height = 512;
d.appendChild(canvas);
const gl = canvas.getContext('webgl', { alpha: false });

const CONST_GL_RENDERBUFFER = FLAG_USE_GL_CONSTANTS?gl.RENDERBUFFER:0x8D41;
const CONST_GL_FRAMEBUFFER = FLAG_USE_GL_CONSTANTS?gl.FRAMEBUFFER:0x8D40;
const CONST_GL_DEPTH_COMPONENT16 = FLAG_USE_GL_CONSTANTS?gl.DEPTH_COMPONENT16:0x81A5;
const CONST_GL_DEPTH_ATTACHMENT = FLAG_USE_GL_CONSTANTS?gl.DEPTH_ATTACHMENT:0x8D00;
const CONST_GL_FRAGMENT_SHADER = FLAG_USE_GL_CONSTANTS?gl.FRAGMENT_SHADER:0x8B30;
const CONST_GL_ELEMENT_ARRAY_BUFFER = FLAG_USE_GL_CONSTANTS?gl.ELEMENT_ARRAY_BUFFER:0x8893;
const CONST_GL_COLOR_ATTACHMENT0 = FLAG_USE_GL_CONSTANTS?gl.COLOR_ATTACHMENT0:0x8CE0;
const CONST_GL_DEPTH_TEST = FLAG_USE_GL_CONSTANTS?gl.DEPTH_TEST:0x0B71;
const CONST_GL_CULL_FACE = FLAG_USE_GL_CONSTANTS?gl.CULL_FACE:0x0B44;
const CONST_GL_BLEND = FLAG_USE_GL_CONSTANTS?gl.BLEND:0x0BE2;
const CONST_GL_LESS = FLAG_USE_GL_CONSTANTS?gl.LESS:0x0201;
const CONST_GL_FRONT = FLAG_USE_GL_CONSTANTS?gl.FRONT:0x0404;
const CONST_GL_BACK = FLAG_USE_GL_CONSTANTS?gl.BACK:0x0405;
const CONST_GL_COLOR_BUFFER_BIT = FLAG_USE_GL_CONSTANTS?gl.COLOR_BUFFER_BIT:0x4000;
const CONST_GL_DEPTH_BUFFER_BIT = FLAG_USE_GL_CONSTANTS?gl.DEPTH_BUFFER_BIT:0x100;
const CONST_GL_COLOR_AND_DEPTH_BUFFER_BIT = FLAG_USE_GL_CONSTANTS?gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT:0x4100;
const CONST_GL_TEXTURE_2D = FLAG_USE_GL_CONSTANTS?gl.TEXTURE_2D:0x0DE1;
const CONST_GL_UNSIGNED_BYTE = FLAG_USE_GL_CONSTANTS?gl.UNSIGNED_BYTE:0x1401;
const CONST_GL_UNSIGNED_SHORT = FLAG_USE_GL_CONSTANTS?gl.UNSIGNED_SHORT:0x1403;
const CONST_GL_RGBA = FLAG_USE_GL_CONSTANTS?gl.RGBA:0x1908;
const CONST_GL_TRIANGLES = FLAG_USE_GL_CONSTANTS?gl.TRIANGLES:0x0004;
const CONST_GL_TEXTURE0 = FLAG_USE_GL_CONSTANTS?gl.TEXTURE0:0x84C0;
const CONST_GL_TEXTURE1 = FLAG_USE_GL_CONSTANTS?gl.TEXTURE1:0x84C1;
const CONST_GL_TEXTURE2 = FLAG_USE_GL_CONSTANTS?gl.TEXTURE2:0x84C2;
const CONST_GL_ARRAY_BUFFER = FLAG_USE_GL_CONSTANTS ? gl.ARRAY_BUFFER : 0x8892;
const CONST_GL_TEXTURE_MAG_FILTER = FLAG_USE_GL_CONSTANTS ? gl.TEXTURE_MAG_FILTER : 10240;
const CONST_GL_NEAREST = FLAG_USE_GL_CONSTANTS ? gl.NEAREST : 9728;
const CONST_GL_TEXTURE_MIN_FILTER = FLAG_USE_GL_CONSTANTS ? gl.TEXTURE_MIN_FILTER : 10241;
const CONST_GL_SRC_ALPHA = FLAG_USE_GL_CONSTANTS ? gl.SRC_ALPHA : 770;
const CONST_GL_ONE_MINUS_SRC_ALPHA = FLAG_USE_GL_CONSTANTS ? gl.ONE_MINUS_SRC_ALPHA : 771;
const CONST_GL_FLOAT = FLAG_USE_GL_CONSTANTS ? gl.FLOAT : 5126;
const CONST_GL_STATIC_DRAW = FLAG_USE_GL_CONSTANTS ? gl.STATIC_DRAW : 0x88E4;
const CONST_GL_VERTEX_SHADER = FLAG_USE_GL_CONSTANTS?gl.VERTEX_SHADER:0x8B31;
const CONST_GL_LINK_STATUS = FLAG_USE_GL_CONSTANTS?gl.LINK_STATUS:0x8B82;

const A_VERTEX_POSITION_INDEX = 0;
const A_VERTEX_POSITION = FLAG_LONG_SHADER_NAMES ? 'aVertexPosition' : 'a';

const A_SURFACE_TEXTURE_COORD_INDEX = 1;
const A_SURFACE_TEXTURE_COORD = FLAG_LONG_SHADER_NAMES ? 'aSurfaceTextureCoord' : 'b';

const A_SURFACE_TEXTURE_BOUNDS_INDEX = 2;
const A_SURFACE_TEXTURE_BOUNDS = FLAG_LONG_SHADER_NAMES ? 'aSurfaceTextureBounds' : 'c';

const A_SURFACE_ROTATION_INDEX = 3;
const A_SURFACE_ROTATION = FLAG_LONG_SHADER_NAMES ? 'aSurfaceRotation': 'd';

const ATTRIBUTE_NAMES = FLAG_LONG_SHADER_NAMES
    ? [
      A_VERTEX_POSITION,
      A_SURFACE_TEXTURE_COORD,
      A_SURFACE_TEXTURE_BOUNDS,
      A_SURFACE_ROTATION,
    ]
    : 'abcd'.split('');

const U_MODEL_VIEW_MATRIX_INDEX = 0;
const U_MODEL_VIEW_MATRIX = FLAG_LONG_SHADER_NAMES ? 'uModelViewMatrix' : 'A';

const U_MODEL_ROTATION_MATRIX_INDEX = 1;
const U_MODEL_ROTATION_MATRIX = FLAG_LONG_SHADER_NAMES ? 'uModelRotationMatrix' : 'B';

const U_PROJECTION_MATRIX_INDEX = 2;
const U_PROJECTION_MATRIX = FLAG_LONG_SHADER_NAMES ? 'uProjectionMatrix' : 'C';

const U_CAMERA_POSITIION_INDEX = 3;
const U_CAMERA_POSITION = FLAG_LONG_SHADER_NAMES ? 'uCameraPosition' : 'D';

const U_SURFACE_TEXTURE_SAMPLER_INDEX = 4;
const U_SURFACE_TEXTURE_SAMPLER = FLAG_LONG_SHADER_NAMES ? 'uSurfaceTextureSampler' : 'E';

const UNIFORM_NAMES = FLAG_LONG_SHADER_NAMES
    ? [
      U_MODEL_VIEW_MATRIX,
      U_MODEL_ROTATION_MATRIX,
      U_PROJECTION_MATRIX,
      U_CAMERA_POSITION,
      U_SURFACE_TEXTURE_SAMPLER,
    ]
    : 'ABCDE'.split('');

const V_SURFACE_TEXTURE_COORD = FLAG_LONG_SHADER_NAMES ? 'vSurfaceTextureCoord' : 'Z';
const V_SURFACE_TEXTURE_BOUNDS = FLAG_LONG_SHADER_NAMES ? 'vSurfaceTextureBounds' : 'Y';
const V_VERTEX_NORMAL = FLAG_LONG_SHADER_NAMES ? 'vVertexNormal' : 'X';
const V_SURFACE_ROTATION = FLAG_LONG_SHADER_NAMES ? 'vSurfaceRotation' : 'W';
const V_WORLD_POSITION = FLAG_LONG_SHADER_NAMES ? 'vWorldPosition' : 'V';

const PRECISION = `lowp`;

const L_VERTEX_NORMAL = FLAG_LONG_SHADER_NAMES ? 'lVertexNormal' : 'z';

// VERTEX
const VERTEX_SHADER = `
attribute vec4 ${A_VERTEX_POSITION};
attribute vec2 ${A_SURFACE_TEXTURE_COORD};
attribute vec4 ${A_SURFACE_TEXTURE_BOUNDS};
attribute mat4 ${A_SURFACE_ROTATION};

uniform mat4 ${U_MODEL_VIEW_MATRIX};
uniform mat4 ${U_MODEL_ROTATION_MATRIX};
uniform mat4 ${U_PROJECTION_MATRIX};

varying ${PRECISION} vec2 ${V_SURFACE_TEXTURE_COORD};
varying ${PRECISION} vec4 ${V_SURFACE_TEXTURE_BOUNDS};
varying ${PRECISION} mat3 ${V_SURFACE_ROTATION};
varying ${PRECISION} vec4 ${V_WORLD_POSITION};

void main() {
  ${V_WORLD_POSITION} = ${U_MODEL_VIEW_MATRIX} * ${A_VERTEX_POSITION};
  gl_Position = ${U_PROJECTION_MATRIX} * ${V_WORLD_POSITION};
  ${V_SURFACE_TEXTURE_COORD} = ${A_SURFACE_TEXTURE_COORD};
  ${V_SURFACE_TEXTURE_BOUNDS} = ${A_SURFACE_TEXTURE_BOUNDS};
  ${V_SURFACE_ROTATION} = mat3(${A_SURFACE_ROTATION}*${U_MODEL_ROTATION_MATRIX});
}
`;


// FRAGMENT
const L_SURFACE = FLAG_LONG_SHADER_NAMES ? 'lSurface' : 'z';
const L_LIGHTING = FLAG_LONG_SHADER_NAMES ? 'lLighting' : 'y';
const L_SURFACE_NORMAL = FLAG_LONG_SHADER_NAMES ? 'lSurfaceNormal' : 'x';
const L_CAMERA_DIRECTION = FLAG_LONG_SHADER_NAMES ? 'lCameraDirection' : 'w';

const FRAGMENT_SHADER = `
uniform sampler2D ${U_SURFACE_TEXTURE_SAMPLER};
uniform ${PRECISION} vec3 ${U_CAMERA_POSITION};

varying ${PRECISION} vec2 ${V_SURFACE_TEXTURE_COORD};
varying ${PRECISION} vec4 ${V_SURFACE_TEXTURE_BOUNDS};
varying ${PRECISION} mat3 ${V_SURFACE_ROTATION};
varying ${PRECISION} vec4 ${V_WORLD_POSITION};

void main() {
  ${PRECISION} vec3 ${L_CAMERA_DIRECTION} = ${V_SURFACE_ROTATION} * normalize(${V_WORLD_POSITION}.xyz - ${U_CAMERA_POSITION});
  ${PRECISION} float depth = texture2D(${U_SURFACE_TEXTURE_SAMPLER}, ${V_SURFACE_TEXTURE_COORD}).b;
  //${PRECISION} float depth = 0.;
  ${PRECISION} vec2 surfacePosition = ${V_SURFACE_TEXTURE_COORD} - ${L_CAMERA_DIRECTION}.xy * depth/${L_CAMERA_DIRECTION}.z;
  if (all(lessThan(${V_SURFACE_TEXTURE_BOUNDS}.xy, surfacePosition)) && all(lessThan(surfacePosition, ${V_SURFACE_TEXTURE_BOUNDS}.zw))) {
    //${PRECISION} vec4 ${L_SURFACE} = texture2D(${U_SURFACE_TEXTURE_SAMPLER}, ${V_SURFACE_TEXTURE_COORD});
    ${PRECISION} vec4 ${L_SURFACE} = texture2D(${U_SURFACE_TEXTURE_SAMPLER}, surfacePosition);
    ${PRECISION} vec3 ${L_SURFACE_NORMAL} = vec3(${L_SURFACE}.x, ${L_SURFACE}.y, 0.5)*2.-1.;
    ${L_SURFACE_NORMAL} = vec3(${L_SURFACE_NORMAL}.xy, sqrt(1. - pow(length(${L_SURFACE_NORMAL}), 2.)));
    //${L_SURFACE_NORMAL} = ${V_SURFACE_ROTATION} * vec3(0., 0., 1.);
    ${PRECISION} float ${L_LIGHTING} = 0.5 + 0.5 * max(dot(${L_SURFACE_NORMAL}, ${V_SURFACE_ROTATION} * normalize(vec3(0., 0., 1.))), -0.);
    gl_FragColor = vec4(vec3(${L_SURFACE}.a*${L_LIGHTING}), ${L_SURFACE}.a > 0. ? 1. : 0.);
  } else {
    gl_FragColor = vec4(0.);
  }
}
`;

const vertexShader = loadShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);
gl.enable(CONST_GL_CULL_FACE);
gl.cullFace(CONST_GL_BACK);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.clearColor(1, 1, 1, 1);
gl.clearDepth(1);
gl.enable(CONST_GL_DEPTH_TEST); 
gl.depthFunc(CONST_GL_LESS);


if (FLAG_SHOW_GL_ERRORS && !gl.getProgramParameter(shaderProgram, CONST_GL_LINK_STATUS)) {
  console.error('Unable to initialize the shader program: ', gl.getProgramInfoLog(shaderProgram));
  console.log(VERTEX_SHADER);
  console.log(FRAGMENT_SHADER);
}

// positions
const vertices = CARDINAL_PROJECTIONS.map((rotation, i) => {
  const [omin, omax] = bounds;
  const inverse = matrix4Invert(rotation);
  const transform = matrix4MultiplyStack([
    inverse,
    matrix4Translate(-VOLUME_MIDPOINT, -omin[1], -VOLUME_MIDPOINT),
  ]);
  const extents1 = vector3TransformMatrix4(transform, ...omin);
  const extents2 = vector3TransformMatrix4(transform, ...omax);
  const [minx, miny] = extents1.map((v, i) => Math.min(v, extents2[i])) as Vector3;
  const [maxx, maxy, maxz] = extents1.map((v, i) => Math.max(v, extents2[i])) as Vector3;

  const positions = [
    [minx, miny, maxz],
    [maxx, miny, maxz],
    [maxx, maxy, maxz],
    [minx, maxy, maxz],
  ];
  return positions.map((v: Vector3) => vector3TransformMatrix4(rotation, ...v));
}); 
console.log('vertices', vertices);
const positions: number[] = vertices.flat(2);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(CONST_GL_ARRAY_BUFFER, positionBuffer);
gl.bufferData(
    CONST_GL_ARRAY_BUFFER,
    new Float32Array(positions),
    CONST_GL_STATIC_DRAW,
);

// indices
const indices = CARDINAL_PROJECTIONS.map((_, i) =>
    [i * 4, i*4+1, i*4+2, i*4, i*4+2, i*4+3]
).flat();

const indexBuffer = gl.createBuffer();
gl.bindBuffer(CONST_GL_ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(
    CONST_GL_ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW,
);

// surface texture
const surfaceTexture = gl.createTexture();
gl.bindTexture(CONST_GL_TEXTURE_2D, surfaceTexture);
gl.texImage2D(
    CONST_GL_TEXTURE_2D,
    0,
    CONST_GL_RGBA,
    CONST_GL_RGBA,
    CONST_GL_UNSIGNED_BYTE,
    textureCanvas,
);
gl.generateMipmap(CONST_GL_TEXTURE_2D);

// surface texture coordinates
const textureCoordinates = textureCanvasBounds
    .map(([x1, y1, x2, y2]) => [x1, y1, x2, y1, x2, y2, x1, y2])
    .flat();
const textureCoordinatesBuffer = gl.createBuffer();
gl.bindBuffer(CONST_GL_ARRAY_BUFFER, textureCoordinatesBuffer);
gl.bufferData(
    CONST_GL_ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    CONST_GL_STATIC_DRAW,
);

// surface texture bounds
const textureBounds = textureCanvasBounds
    .map<number[][]>(v => new Array(4).fill(v))
    .flat(2);
const textureBoundsBuffer = gl.createBuffer();
gl.bindBuffer(CONST_GL_ARRAY_BUFFER, textureBoundsBuffer);
gl.bufferData(
    CONST_GL_ARRAY_BUFFER,
    new Float32Array(textureBounds),
    CONST_GL_STATIC_DRAW,
);

// surface rotations
const surfaceRotations: number[] = INVERSE_CARDINAL_PROJECTIONS.map(
    v => new Array<Matrix4>(4).fill(v),
).flat(2);

const surfaceRotationBuffer = gl.createBuffer();
gl.bindBuffer(CONST_GL_ARRAY_BUFFER, surfaceRotationBuffer);
gl.bufferData(
    CONST_GL_ARRAY_BUFFER,
    new Float32Array(surfaceRotations),
    CONST_GL_STATIC_DRAW,
);

let rot = 0;

const aspect = 1;
const zNear = .1;
const perspectiveMatrix = matrix4InfinitePerspective(CONST_DEFAULT_TAN_FOV_ON_2, aspect, zNear);
const cameraPosition: Vector3 = [0, 0, 0];

const f = () => {

  rot += 0.01;

  gl.clear(CONST_GL_COLOR_BUFFER_BIT | CONST_GL_DEPTH_BUFFER_BIT);

  const projectionMatrix = matrix4Multiply(
      perspectiveMatrix,
      matrix4Translate(...cameraPosition),
  );
  const modelRotationMatrix = matrix4MultiplyStack([matrix4Rotate(rot, 0, 1, 0), matrix4Rotate(rot/2, 1, 0, 0)]);
  //const modelRotationMatrix = matrix4Identity();
  const modelViewMatrix = matrix4MultiplyStack([matrix4Translate(0, 0, -50), modelRotationMatrix]);

  const attributes = ATTRIBUTE_NAMES.map(name => gl.getAttribLocation(shaderProgram, name));
  const uniforms = UNIFORM_NAMES.map(name => gl.getUniformLocation(shaderProgram, name)); 

  // vertexes
  gl.bindBuffer(CONST_GL_ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(
      attributes[A_VERTEX_POSITION_INDEX],
      3, // numComponents
      CONST_GL_FLOAT, // type
      false, // normalise
      0, // stride
      0, // offset
  );
  gl.enableVertexAttribArray(attributes[A_VERTEX_POSITION_INDEX]);

  // indexes
  gl.bindBuffer(CONST_GL_ELEMENT_ARRAY_BUFFER, indexBuffer);

  // surface texture coordinates
  gl.bindBuffer(CONST_GL_ARRAY_BUFFER, textureCoordinatesBuffer);
  gl.vertexAttribPointer(
      attributes[A_SURFACE_TEXTURE_COORD_INDEX],
      2, // numComponents
      CONST_GL_FLOAT, // type
      false, // normalise
      0, // stride
      0, // offset
  );
  gl.enableVertexAttribArray(attributes[A_SURFACE_TEXTURE_COORD_INDEX]);

  // surface texture bounds
  gl.bindBuffer(CONST_GL_ARRAY_BUFFER, textureBoundsBuffer);
  gl.vertexAttribPointer(
      attributes[A_SURFACE_TEXTURE_BOUNDS_INDEX],
      4, // numComponents
      CONST_GL_FLOAT, // type
      false, // normalise
      0, // stride
      0, // offset
  );
  gl.enableVertexAttribArray(attributes[A_SURFACE_TEXTURE_BOUNDS_INDEX]);

  // surface texture
  gl.activeTexture(CONST_GL_TEXTURE0);
  gl.bindTexture(CONST_GL_TEXTURE_2D, surfaceTexture)
  gl.uniform1i(uniforms[U_SURFACE_TEXTURE_SAMPLER_INDEX], 0);

  // surface rotation
  gl.bindBuffer(CONST_GL_ARRAY_BUFFER, surfaceRotationBuffer);
  for (let i=0; i<4; i++) {
    gl.enableVertexAttribArray(attributes[A_SURFACE_ROTATION_INDEX]+i);
    gl.vertexAttribPointer(
        attributes[A_SURFACE_ROTATION_INDEX]+i,
        4,
        CONST_GL_FLOAT,
        false,
        64,
        i*16,
    );
  }

  // uniforms
  gl.uniformMatrix4fv(
      uniforms[U_MODEL_VIEW_MATRIX_INDEX],
      false,
      modelViewMatrix,
  );
  gl.uniformMatrix4fv(
      uniforms[U_MODEL_ROTATION_MATRIX_INDEX],
      false,
      matrix4Invert(modelRotationMatrix),
  );
  gl.uniformMatrix4fv(
      uniforms[U_PROJECTION_MATRIX_INDEX],
      false,
      projectionMatrix,
  );
  gl.uniform3fv(
      uniforms[U_CAMERA_POSITIION_INDEX],
      cameraPosition,
  );

  gl.drawElements(
      gl.TRIANGLES,
      36,
      CONST_GL_UNSIGNED_SHORT,
      0
  );

  requestAnimationFrame(f);
}
f();
