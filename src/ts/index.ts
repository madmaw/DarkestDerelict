///<reference path="./flags.ts"/>
///<reference path="./constants.ts"/>
///<reference path="./volumetric.ts"/>
///<reference path="./gl.ts"/>

const { volume } = processCommands(
    [
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
          value: -4,
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
          value: 1,
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

const A_VERTEX_NORMAL_INDEX = 2;
const A_VERTEX_NORMAL = FLAG_LONG_SHADER_NAMES ? 'aVertexNormal': 'c';

const ATTRIBUTE_NAMES = FLAG_LONG_SHADER_NAMES
    ? [
      A_VERTEX_POSITION,
      A_SURFACE_TEXTURE_COORD,
      A_VERTEX_NORMAL,
    ]
    : 'abc'.split('');

const U_MODEL_VIEW_MATRIX_INDEX = 0;
const U_MODEL_VIEW_MATRIX = FLAG_LONG_SHADER_NAMES ? 'uModelViewMatrix' : 'A';

const U_PROJECTION_MATRIX_INDEX = 1;
const U_PROJECTION_MATRIX = FLAG_LONG_SHADER_NAMES ? 'uProjectionMatrix' : 'B';

const U_SURFACE_TEXTURE_SAMPLER_INDEX = 2;
const U_SURFACE_TEXTURE_SAMPLER = FLAG_LONG_SHADER_NAMES ? 'uSurfaceTextureSampler' : 'C';

const UNIFORM_NAMES = FLAG_LONG_SHADER_NAMES
    ? [
      U_MODEL_VIEW_MATRIX,
      U_PROJECTION_MATRIX,
      U_SURFACE_TEXTURE_SAMPLER,
    ]
    : 'ABC'.split('');

const V_SURFACE_TEXTURE_COORD = FLAG_LONG_SHADER_NAMES ? 'vSurfaceTextureCoord' : 'Z';
const V_VERTEX_NORMAL = FLAG_LONG_SHADER_NAMES ? 'vVertexNormal' : 'Y';
const V_VERTEX_NORMAL_MATRIX = FLAG_LONG_SHADER_NAMES ? 'vVertexNormalMatrix' : 'X';

const PRECISION = `lowp`;

const L_VERTEX_NORMAL = FLAG_LONG_SHADER_NAMES ? 'lVertexNormal' : 'z';

// VERTEX
const VERTEX_SHADER = `
attribute vec4 ${A_VERTEX_POSITION};
attribute vec2 ${A_SURFACE_TEXTURE_COORD};
attribute vec3 ${A_VERTEX_NORMAL};

uniform mat4 ${U_MODEL_VIEW_MATRIX};
uniform mat4 ${U_PROJECTION_MATRIX};

varying ${PRECISION} vec2 ${V_SURFACE_TEXTURE_COORD};
varying ${PRECISION} mat3 ${V_VERTEX_NORMAL_MATRIX};

void main() {
  gl_Position = ${U_PROJECTION_MATRIX} * ${U_MODEL_VIEW_MATRIX} * ${A_VERTEX_POSITION};
  ${V_SURFACE_TEXTURE_COORD} = ${A_SURFACE_TEXTURE_COORD};
  vec4 ${L_VERTEX_NORMAL} = ${U_MODEL_VIEW_MATRIX}*vec4(${A_VERTEX_NORMAL},0.) - ${U_MODEL_VIEW_MATRIX}*vec4(0.);
  ${PRECISION} vec3 axis = cross(${L_VERTEX_NORMAL}.xyz, vec3(0., 0., 1.));
  ${PRECISION} float c = dot(${L_VERTEX_NORMAL}.xyz, vec3(0., 0., 1.));
  ${PRECISION} float angle = acos(c);
  ${PRECISION} float s = sin(angle);
  ${PRECISION} float oc = 1. - c;
  ${V_VERTEX_NORMAL_MATRIX} = mat3(
    oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z - axis.x * s,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c         );
}
`;


// FRAGMENT
const L_SURFACE = FLAG_LONG_SHADER_NAMES ? 'lSurface' : 'z';
const L_LIGHTING = FLAG_LONG_SHADER_NAMES ? 'lLighting' : 'y';
const L_SURFACE_NORMAL = FLAG_LONG_SHADER_NAMES ? 'lSurfaceNormal' : 'x';

const FRAGMENT_SHADER = `
uniform sampler2D ${U_SURFACE_TEXTURE_SAMPLER};

varying ${PRECISION} vec2 ${V_SURFACE_TEXTURE_COORD};
varying ${PRECISION} mat3 ${V_VERTEX_NORMAL_MATRIX};


void main() {
  ${PRECISION} vec4 ${L_SURFACE} = texture2D(${U_SURFACE_TEXTURE_SAMPLER}, ${V_SURFACE_TEXTURE_COORD});
  ${PRECISION} vec3 ${L_SURFACE_NORMAL} = vec3(${L_SURFACE}.x, ${L_SURFACE}.y, 0.5)*2.-1.;
  ${L_SURFACE_NORMAL} = ${V_VERTEX_NORMAL_MATRIX} * vec3(${L_SURFACE_NORMAL}.xy, sqrt(1. - pow(length(${L_SURFACE_NORMAL}), 2.)));
  ${PRECISION} float ${L_LIGHTING} = 0.5 + 0.5 * max(dot(${L_SURFACE_NORMAL}.xyz, normalize(vec3(1., 0., 1.))),0.);
  gl_FragColor = vec4(vec3(${L_SURFACE}.a*${L_LIGHTING}), ${L_SURFACE}.a);
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
gl.clearColor(0, 0, 0, 1);
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
const textureCoordinates = textureCanvasBounds.flat(); // TODO probably will need rotating or something
const textureCoordinatesBuffer = gl.createBuffer();
gl.bindBuffer(CONST_GL_ARRAY_BUFFER, textureCoordinatesBuffer);
gl.bufferData(
    CONST_GL_ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    CONST_GL_STATIC_DRAW,
);

// normals
const normals: number[] = CARDINAL_VECTORS.map(
    v => new Array<Vector3>(4).fill(v),
).flat(2);

const normalBuffer = gl.createBuffer();
gl.bindBuffer(CONST_GL_ARRAY_BUFFER, normalBuffer);
gl.bufferData(
    CONST_GL_ARRAY_BUFFER,
    new Float32Array(normals),
    CONST_GL_STATIC_DRAW,
);

let rot = 0;

const aspect = 1;
const zNear = .1;
const perspectiveMatrix = matrix4InfinitePerspective(CONST_DEFAULT_TAN_FOV_ON_2, aspect, zNear);

const f = () => {

  rot += 0.01;

  gl.clear(CONST_GL_COLOR_BUFFER_BIT | CONST_GL_DEPTH_BUFFER_BIT);

  const projectionMatrix = matrix4Multiply(
      perspectiveMatrix,
      matrix4Translate(0, 0, 0)
  );
  const modelMatrix = matrix4MultiplyStack([matrix4Translate(0, 0, -50), matrix4Rotate(rot, 0, 0, 1), matrix4Rotate(0, 1, 0, 0)]);

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

  // surface texture
  gl.activeTexture(CONST_GL_TEXTURE0);
  gl.bindTexture(CONST_GL_TEXTURE_2D, surfaceTexture)
  gl.uniform1i(uniforms[U_SURFACE_TEXTURE_SAMPLER_INDEX], 0);

  // normals
  gl.bindBuffer(CONST_GL_ARRAY_BUFFER, normalBuffer);
  gl.vertexAttribPointer(
      attributes[A_VERTEX_NORMAL_INDEX],
      3,
      CONST_GL_FLOAT,
      false,
      0,
      0,
  );
  gl.enableVertexAttribArray(attributes[A_VERTEX_NORMAL_INDEX]);

  gl.uniformMatrix4fv(
      uniforms[U_PROJECTION_MATRIX_INDEX],
      false,
      projectionMatrix,
  );
  gl.uniformMatrix4fv(
      uniforms[U_MODEL_VIEW_MATRIX_INDEX],
      false,
      modelMatrix,
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
