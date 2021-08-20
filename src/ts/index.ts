///<reference path="./flags.ts"/>
///<reference path="./constants.ts"/>
///<reference path="./volumetric.ts"/>
///<reference path="./gl.ts"/>
///<reference path="./volumes/wall.ts"/>
///<reference path="./volumes/marine.ts"/>
///<reference path="./sprite.ts"/>
///<reference path="./events.ts"/>

const canvas = c;
canvas.width = 512;
canvas.height = 512;
const gl = canvas.getContext('webgl');

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

const U_DEPTH_TEXTURE_SAMPLER_INDEX = 4;
const U_DEPTH_TEXTURE_SAMPLER = FLAG_LONG_SHADER_NAMES ? 'uDepthTextureSampler' : 'E';

const U_RENDER_TEXTURE_SAMPLER_INDEX = 5;
const U_RENDER_TEXTURE_SAMPLER = FLAG_LONG_SHADER_NAMES ? 'uRenderTextureSampler' : 'F';

const UNIFORM_NAMES = FLAG_LONG_SHADER_NAMES
    ? [
      U_MODEL_VIEW_MATRIX,
      U_MODEL_ROTATION_MATRIX,
      U_PROJECTION_MATRIX,
      U_CAMERA_POSITION,
      U_DEPTH_TEXTURE_SAMPLER,
      U_RENDER_TEXTURE_SAMPLER,
    ]
    : 'ABCDEF'.split('');

const V_SURFACE_TEXTURE_COORD = FLAG_LONG_SHADER_NAMES ? 'vSurfaceTextureCoord' : 'Z';
const V_SURFACE_TEXTURE_BOUNDS = FLAG_LONG_SHADER_NAMES ? 'vSurfaceTextureBounds' : 'Y';
const V_VERTEX_NORMAL = FLAG_LONG_SHADER_NAMES ? 'vVertexNormal' : 'X';
const V_SURFACE_ROTATION = FLAG_LONG_SHADER_NAMES ? 'vSurfaceRotation' : 'W';
const V_WORLD_POSITION = FLAG_LONG_SHADER_NAMES ? 'vWorldPosition' : 'V';

const PRECISION = `lowp`;

const L_VERTEX_NORMAL = FLAG_LONG_SHADER_NAMES ? 'lVertexNormal' : 'z';

// VERTEX
const VERTEX_SHADER = `
attribute vec3 ${A_VERTEX_POSITION};
attribute vec2 ${A_SURFACE_TEXTURE_COORD};
attribute vec4 ${A_SURFACE_TEXTURE_BOUNDS};
attribute mat4 ${A_SURFACE_ROTATION};

uniform mat4 ${U_MODEL_VIEW_MATRIX};
uniform mat4 ${U_MODEL_ROTATION_MATRIX};
uniform mat4 ${U_PROJECTION_MATRIX};
uniform ${PRECISION} vec3 ${U_CAMERA_POSITION};

varying ${PRECISION} vec2 ${V_SURFACE_TEXTURE_COORD};
varying ${PRECISION} vec4 ${V_SURFACE_TEXTURE_BOUNDS};
varying ${PRECISION} mat3 ${V_SURFACE_ROTATION};
varying ${PRECISION} vec4 ${V_WORLD_POSITION};

void main() {
  ${V_WORLD_POSITION} = ${U_MODEL_VIEW_MATRIX} * vec4(${A_VERTEX_POSITION}, 1.);
  gl_Position = ${U_PROJECTION_MATRIX} * vec4(${V_WORLD_POSITION}.xyz-${U_CAMERA_POSITION}, 1.);
  ${V_SURFACE_TEXTURE_COORD} = ${A_SURFACE_TEXTURE_COORD};
  ${V_SURFACE_TEXTURE_BOUNDS} = ${A_SURFACE_TEXTURE_BOUNDS};
  ${V_SURFACE_ROTATION} = mat3(${A_SURFACE_ROTATION}*${U_MODEL_ROTATION_MATRIX});
}
`;


// FRAGMENT
const L_DEPTH_TEXTURE = FLAG_LONG_SHADER_NAMES ? 'lDepthTexture' : 'z';
const L_LIGHTING = FLAG_LONG_SHADER_NAMES ? 'lLighting' : 'y';
const L_SURFACE_NORMAL = FLAG_LONG_SHADER_NAMES ? 'lSurfaceNormal' : 'x';
const L_CAMERA_DIRECTION = FLAG_LONG_SHADER_NAMES ? 'lCameraDirection' : 'w';

const CONST_NUM_STEPS = 99;
const MAX_DEPTH = VOLUME_DIMENSION/TEXTURE_DIMENSION;
const C_MAX_DEPTH = `${MAX_DEPTH}`;
const C_STEP_DEPTH = `${MAX_DEPTH/CONST_NUM_STEPS}`;
const DEPTH_SCALE = 256/VOLUME_DIMENSION*MAX_DEPTH;
const C_DEPTH_SCALE = `${DEPTH_SCALE}${DEPTH_SCALE==Math.round(DEPTH_SCALE)?'.':''}`;

const FRAGMENT_SHADER = `
precision ${PRECISION}  float;

uniform sampler2D ${U_DEPTH_TEXTURE_SAMPLER};
uniform sampler2D ${U_RENDER_TEXTURE_SAMPLER};
uniform vec3 ${U_CAMERA_POSITION};

varying vec2 ${V_SURFACE_TEXTURE_COORD};
varying vec4 ${V_SURFACE_TEXTURE_BOUNDS};
varying mat3 ${V_SURFACE_ROTATION};
varying vec4 ${V_WORLD_POSITION};

void main() {
  vec3 ${L_CAMERA_DIRECTION} = ${V_SURFACE_ROTATION} * normalize(${V_WORLD_POSITION}.xyz - ${U_CAMERA_POSITION});
  vec2 surfacePosition = ${V_SURFACE_TEXTURE_COORD};
  vec4 ${L_DEPTH_TEXTURE} = vec4(0.);
  
  for (float depth=0.; depth<${MAX_DEPTH}; depth+=${C_STEP_DEPTH}) {
    vec2 previousSurfacePosition = surfacePosition;
    surfacePosition = ${V_SURFACE_TEXTURE_COORD}-depth*${L_CAMERA_DIRECTION}.xy/(${L_CAMERA_DIRECTION}.z);
    if (all(lessThan(${V_SURFACE_TEXTURE_BOUNDS}.xy, surfacePosition)) && all(lessThan(surfacePosition, ${V_SURFACE_TEXTURE_BOUNDS}.zw))) {
      ${L_DEPTH_TEXTURE} = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, surfacePosition);
      float y1 = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, surfacePosition).b*${C_DEPTH_SCALE}-depth;
      float y0 = ${C_STEP_DEPTH};
      float y2 = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, previousSurfacePosition).b*${C_DEPTH_SCALE}-depth;
      float scale = 1./(1.-y1/(y0-y2));

      if (${L_DEPTH_TEXTURE}.b*${C_DEPTH_SCALE}<=depth && ${L_DEPTH_TEXTURE}.a>0. && ${L_DEPTH_TEXTURE}.a*${C_DEPTH_SCALE} > depth && scale>=0. && scale<=1.) {
        vec4 previousSurface = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, previousSurfacePosition);
        if (previousSurface.a>0.) {

          surfacePosition = mix(surfacePosition, previousSurfacePosition, scale);
        }
        ${L_DEPTH_TEXTURE} = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, surfacePosition);
        break;
      }
    } else {
      break;
    }
    ${L_DEPTH_TEXTURE} = vec4(0.);
  }
  /*
  ${L_DEPTH_TEXTURE} = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, ${V_SURFACE_TEXTURE_COORD});
  surfacePosition = ${V_SURFACE_TEXTURE_COORD};
  */
  if (${L_DEPTH_TEXTURE}.a>0.) {
    vec4 color = texture2D(${U_RENDER_TEXTURE_SAMPLER}, surfacePosition);
    vec3 ${L_SURFACE_NORMAL} = vec3(${L_DEPTH_TEXTURE}.x, ${L_DEPTH_TEXTURE}.y, 0.5)*2.-1.;
    ${L_SURFACE_NORMAL} = vec3(${L_SURFACE_NORMAL}.xy, sqrt(1. - pow(length(${L_SURFACE_NORMAL}), 2.)));
    /*${L_SURFACE_NORMAL} = ${V_SURFACE_ROTATION} * vec3(0., 0., 1.);*/
    float ${L_LIGHTING} = 0.5 + 0.5 * pow(max(dot(${L_SURFACE_NORMAL}, ${V_SURFACE_ROTATION} * normalize(vec3(-1., 1., 1.))), -0.),color.a*4.);
    gl_FragColor = vec4(color.rgb*(${L_LIGHTING}), 1.);
    /*gl_FragColor = vec4(vec3(${L_DEPTH_TEXTURE}.b*128.*${L_LIGHTING}), 1.);*/
  } else {
    //gl_FragColor = vec4(0.);
    discard;
  }
}
`;

const TEXTURE_RED_SHINY: Texel[][][] = [[[[128, 92, 92, 255]]]];
const TEXTURE_GREEN: Texel[][][] = [[[[92, 128, 92, 128]]]];
const TEXTURE_BLUE_DULL: Texel[][][] = [[[[0, 0, 128, 0]]]];
const TEXTURE_WHITE_SHINY: Texel[][][] = [[[[255, 255, 255, 255]]]];

const TEXTURE_SPECKLED: Texel[][][] = [[
  [[0, 0, 0, 128], [255, 255, 255, 128]],
  [[255, 255, 255, 128], [0, 0, 0, 128]],
]];

const COMMANDS = [
  ['wall', VOLUMETRIC_COMMANDS_WALL, [TEXTURE_WHITE_SHINY]],
  //['marine', VOLUMETRIC_COMMANDS_MARINE, [TEXTURE_RED_SHINY, TEXTURE_RED_SHINY, TEXTURE_WHITE_SHINY, TEXTURE_RED_SHINY], ANIMATIONS_MARINE],
  ['marine', VOLUMETRIC_COMMANDS_MARINE, [TEXTURE_GREEN, TEXTURE_GREEN, TEXTURE_WHITE_SHINY, TEXTURE_GREEN], ANIMATIONS_MARINE],
] as const;

const eventQueue: EventQueue<readonly [string, VolumetricDrawCommand[], readonly Volume<Texel>[], SpriteAnimationSequence[]?], EntityRenderables> = {
  events: [],
  handler: async ([name, commands, renderTextures, animations]) => {
    const volumes = animations
        ? processSpriteCommands(name, commands, animations)
        : [[processVolumetricDrawCommands(name, commands).volume]];
    const bounds = volumes.flat().reduce<Rect3>(([min, max], volume: Volume<Voxel>) => {
      const [vmin, vmax] = calculateVolumeBounds(volume);
      return [
        min.map((v, i) => Math.min(v, vmin[i])) as Vector3,
        max.map((v, i) => Math.max(v, vmax[i])) as Vector3,
      ];
    }, [[VOLUME_DIMENSION, VOLUME_DIMENSION, VOLUME_DIMENSION], [0, 0, 0]]);

    let depthTextureBounds: Rect2[];
    const frames: TextureFrame[][] = volumes.map(volumes => volumes.map(volume => {
      const [depthTextureData, textureBounds] = volumeToDepthTexture(volume, bounds);
      // should all be the same
      depthTextureBounds = textureBounds;
      const [renderTextureData] = volumeToRenderTexture(volume, bounds, renderTextures);

      // depth texture
      const depthTexture = gl.createTexture();
      gl.bindTexture(CONST_GL_TEXTURE_2D, depthTexture);
      gl.texImage2D(
          CONST_GL_TEXTURE_2D,
          0,
          CONST_GL_RGBA,
          TEXTURE_DIMENSION,
          TEXTURE_DIMENSION,
          0,
          CONST_GL_RGBA,
          CONST_GL_UNSIGNED_BYTE,
          depthTextureData,
      );
      gl.generateMipmap(CONST_GL_TEXTURE_2D);

      // render texture
      const renderTexture = gl.createTexture();
      gl.bindTexture(CONST_GL_TEXTURE_2D, renderTexture);
      gl.texImage2D(
          CONST_GL_TEXTURE_2D,
          0,
          CONST_GL_RGBA,
          TEXTURE_DIMENSION,
          TEXTURE_DIMENSION,
          0,
          CONST_GL_RGBA,
          CONST_GL_UNSIGNED_BYTE,
          renderTextureData,
      );
      gl.generateMipmap(CONST_GL_TEXTURE_2D);

      if (FLAG_DEBUG_TEXTURES) {
        const textures = [depthTextureData, renderTextureData];
        textures.forEach(texture => {
          const debugCanvas = document.createElement('canvas');
          debugCanvas.width = TEXTURE_DIMENSION;
          debugCanvas.height = TEXTURE_DIMENSION;
          const debugContext = debugCanvas.getContext('2d');
          const debugData = debugContext.createImageData(TEXTURE_DIMENSION, TEXTURE_DIMENSION);
          debugData.data.set(texture, 0);
          debugContext.putImageData(debugData, 0, 0);
          document.firstChild.appendChild(debugCanvas);  
        })
      }      

      return {
        depthTexture,
        renderTexture,
      }
    }));

    // positions
    const vertexPositions = CARDINAL_PROJECTIONS.map((rotation, i) => {
      const [omin, omax] = bounds;
      const min = omin.map(v => v - TEXTURE_PADDING) as Vector3;
      const max = omax.map(v => v + TEXTURE_PADDING) as Vector3;
      const inverse = matrix4Invert(rotation);
      const transform = matrix4Multiply(
          inverse,
          matrix4Translate(-VOLUME_MIDPOINT, -omin[1], -VOLUME_MIDPOINT),
      );
      const extents1 = vector3TransformMatrix4(transform, ...min);
      const extents2 = vector3TransformMatrix4(transform, ...max);
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
    const vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(CONST_GL_ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(
        CONST_GL_ARRAY_BUFFER,
        new Float32Array(vertexPositions.flat(2)),
        CONST_GL_STATIC_DRAW,
    );

    // indices
    const vertexIndices = CARDINAL_PROJECTIONS.map((_, i) =>
        [i * 4, i*4+1, i*4+2, i*4, i*4+2, i*4+3]
    ).flat();

    const vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(CONST_GL_ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
    gl.bufferData(
        CONST_GL_ELEMENT_ARRAY_BUFFER,
        new Uint16Array(vertexIndices),
        CONST_GL_STATIC_DRAW,
    );

    // texture coordinates

    const textureCoordinates = depthTextureBounds
        .map(([x1, y1, x2, y2], i) => {
          return [
            x1, y1,
            x2, y1,
            x2, y2,
            x1, y2,
          ];
        })
        .flat();
    const textureCoordinatesBuffer = gl.createBuffer();
    gl.bindBuffer(CONST_GL_ARRAY_BUFFER, textureCoordinatesBuffer);
    gl.bufferData(
        CONST_GL_ARRAY_BUFFER,
        new Float32Array(textureCoordinates),
        CONST_GL_STATIC_DRAW,
    );

    // texture bounds
    const textureBounds = depthTextureBounds
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

    const surfaceRotationsBuffer = gl.createBuffer();
    gl.bindBuffer(CONST_GL_ARRAY_BUFFER, surfaceRotationsBuffer);
    gl.bufferData(
        CONST_GL_ARRAY_BUFFER,
        new Float32Array(surfaceRotations),
        CONST_GL_STATIC_DRAW,
    );

    d.innerText = `${(1-eventQueue.events.length/COMMANDS.length)*100 | 0}%`
    // allow rendering of progress
    await delay();
    return {
      bounds,
      frames,
      vertexPositionBuffer,
      vertexIndexBuffer,
      surfaceRotationsBuffer,
      textureBoundsBuffer,
      textureCoordinatesBuffer,
    };
  },
}

const vertexShader = loadShader(gl, CONST_GL_VERTEX_SHADER, VERTEX_SHADER);
const fragmentShader = loadShader(gl, CONST_GL_FRAGMENT_SHADER, FRAGMENT_SHADER);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);
if (FLAG_SHOW_GL_ERRORS && !gl.getProgramParameter(shaderProgram, CONST_GL_LINK_STATUS)) {
  console.error('Unable to initialize the shader program: ', gl.getProgramInfoLog(shaderProgram));
  console.log(VERTEX_SHADER);
  console.log(FRAGMENT_SHADER);
}

gl.enable(CONST_GL_CULL_FACE);
gl.cullFace(CONST_GL_BACK);
gl.enable(CONST_GL_BLEND);
gl.blendFunc(CONST_GL_SRC_ALPHA, CONST_GL_ONE_MINUS_SRC_ALPHA);
gl.clearColor(.8, .9, 1, 1);
gl.clearDepth(1);
gl.enable(CONST_GL_DEPTH_TEST); 
gl.depthFunc(CONST_GL_LESS);

const attributes = ATTRIBUTE_NAMES.map(name => gl.getAttribLocation(shaderProgram, name));
const uniforms = UNIFORM_NAMES.map(name => gl.getUniformLocation(shaderProgram, name)); 

onload = async () => {
  const entityRenderables = await addEvents(eventQueue, ...COMMANDS);

  let rotation = 0;
  let targetRotation = rotation;
  let position: Vector3 = [0, 0, 20];
  let cameraPosition: Vector3 = [-50, 20, 0];
  let targetPosition = [...position];
  
  onkeydown = (e: KeyboardEvent) => {
    const actionMultiplier = e.shiftKey ? 0.125 : 1;
    let positionMultiplier = 1;
    switch (e.keyCode) {
      case 39: // right
        targetRotation += Math.PI/2 * actionMultiplier;
        break;
      case 37: // left
        targetRotation -= Math.PI/2 * actionMultiplier;
        break;
      case 40: // down
        positionMultiplier = -1;
      case 38: // up
        const sin = Math.sin(rotation) * 10 * actionMultiplier;
        const cos = Math.cos(rotation) * 10 * actionMultiplier;
        targetPosition[0] += cos * positionMultiplier;
        targetPosition[2] += sin * positionMultiplier;
        break;
      case 32: // space
        if (targetPosition[1] == 0) {
          targetPosition[1] = 20;
        } else {
          targetPosition[1] = 0;
        }
        break;
    } 
  }
  
  const aspect = canvas.width/canvas.height;
  const perspectiveMatrix = matrix4InfinitePerspective(CONST_DEFAULT_TAN_FOV_ON_2, aspect, 1);
  //const perspectiveMatrix = matrix4Perspective(CONST_DEFAULT_TAN_FOV_ON_2, aspect, zNear, 1000);
  const scale = 1/VOLUME_SCALE

  let previous = 0;
  const f = (now: number) => {
    requestAnimationFrame(f);

    gl.clear(CONST_GL_COLOR_BUFFER_BIT | CONST_GL_DEPTH_BUFFER_BIT);
    
    let delta = now - previous;
    previous = now;
  
    rotation += (targetRotation - rotation)*delta/500;
    const deltaPosition = vectorNSubtract(targetPosition, position);
    const deltaPositionLength = vectorNLength(deltaPosition);
    if (deltaPositionLength > 0) {
      const movementScale = Math.min(deltaPositionLength, 0.02*delta)/deltaPositionLength;
      position = position.map((v, i) => v + deltaPosition[i]*movementScale) as Vector3;
    }

    const projectionMatrix = matrix4Multiply(
        perspectiveMatrix,
        matrix4Rotate(- Math.PI/2, 0, 1, 0),
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

    for (let i in entityRenderables) {
      const {
        frames,
        surfaceRotationsBuffer,
        textureBoundsBuffer,
        textureCoordinatesBuffer,
        vertexIndexBuffer,
        vertexPositionBuffer,
      } = entityRenderables[i];
    
      const walkFrames = frames[frames.length - 1];
      const {
        depthTexture,
        renderTexture,
      } = walkFrames[(now/100 | 0)%walkFrames.length];
    
      const modelPositionMatrix = i == '0'
          ? matrix4Translate(...position)
          : matrix4Identity();
      const modelRotationMatrix = i == '0'
          ? matrix4Rotate(rotation, 0, 1, 0)
          : matrix4Identity();
      //const modelRotationMatrix = matrix4Identity();
      //const modelRotationMatrix = matrix4Rotate(Math.PI/2, 0, 1, 0);
      const modelViewMatrix = matrix4Multiply(
          modelPositionMatrix,
          modelRotationMatrix,
          matrix4Scale(scale, scale, scale),
      );
    
      // vertexes
      gl.bindBuffer(CONST_GL_ARRAY_BUFFER, vertexPositionBuffer);
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
      gl.bindBuffer(CONST_GL_ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
    
      // texture coordinates
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
    
      // texture bounds
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
    
      // depth texture
      gl.uniform1i(uniforms[U_DEPTH_TEXTURE_SAMPLER_INDEX], 0);
      gl.activeTexture(CONST_GL_TEXTURE0);
      gl.bindTexture(CONST_GL_TEXTURE_2D, depthTexture)
      gl.texParameteri(CONST_GL_TEXTURE_2D, CONST_GL_TEXTURE_MAG_FILTER, CONST_GL_NEAREST);
      gl.texParameteri(CONST_GL_TEXTURE_2D, CONST_GL_TEXTURE_MIN_FILTER, CONST_GL_NEAREST);
    
      // render texture
      gl.uniform1i(uniforms[U_RENDER_TEXTURE_SAMPLER_INDEX], 1);
      gl.activeTexture(CONST_GL_TEXTURE1);
      gl.bindTexture(CONST_GL_TEXTURE_2D, renderTexture)
      gl.texParameteri(CONST_GL_TEXTURE_2D, CONST_GL_TEXTURE_MAG_FILTER, CONST_GL_NEAREST);
      gl.texParameteri(CONST_GL_TEXTURE_2D, CONST_GL_TEXTURE_MIN_FILTER, CONST_GL_NEAREST);
      
      // surface rotation
      gl.bindBuffer(CONST_GL_ARRAY_BUFFER, surfaceRotationsBuffer);
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
    
      gl.drawElements(
          CONST_GL_TRIANGLES,
          36, // everything is always a cube
          CONST_GL_UNSIGNED_SHORT,
          0
      );
    }
  }
  f(0);
};







