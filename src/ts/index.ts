///<reference path="./flags.ts"/>
///<reference path="./constants.ts"/>
///<reference path="./volumetric.ts"/>
///<reference path="./gl.ts"/>
///<reference path="./volumes/wall.ts"/>
///<reference path="./volumes/marine.ts"/>
///<reference path="./sprite.ts"/>
///<reference path="./events.ts"/>

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

const U_LIGHTS_INDEX = 6;
const U_LIGHTS = FLAG_LONG_SHADER_NAMES ? 'uLights' : 'G';

const U_LIGHT_TRANSFORMS_INDEX = 7;
const U_LIGHT_TRANSFORMS = FLAG_LONG_SHADER_NAMES ? 'uLightTransforms': 'H';

const U_AMBIENT_LIGHT_INDEX = 8;
const U_AMBIENT_LIGHT = FLAG_LONG_SHADER_NAMES ? 'uAmbientLight' : 'I';

const UNIFORM_NAMES = FLAG_LONG_SHADER_NAMES
    ? [
      U_MODEL_VIEW_MATRIX,
      U_MODEL_ROTATION_MATRIX,
      U_PROJECTION_MATRIX,
      U_CAMERA_POSITION,
      U_DEPTH_TEXTURE_SAMPLER,
      U_RENDER_TEXTURE_SAMPLER,
      U_LIGHTS,
      U_LIGHT_TRANSFORMS,
      U_AMBIENT_LIGHT,
    ]
    : 'ABCDEFGHI'.split('');

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

  const CONST_NUM_STEPS = 256;
  const MAX_DEPTH = VOLUME_DIMENSION/TEXTURE_DIMENSION;
  const C_MAX_DEPTH = `${MAX_DEPTH}`;
  const C_MIN_DEPTH = -VOLUME_DEPTH_OFFSET/TEXTURE_DIMENSION;
  const STEP_DEPTH = (MAX_DEPTH-C_MIN_DEPTH)/CONST_NUM_STEPS;
  const C_STEP_DEPTH = `${STEP_DEPTH}`;
  const DEPTH_SCALE = 256/VOLUME_DIMENSION*MAX_DEPTH;
  const C_DEPTH_SCALE = `${DEPTH_SCALE}${DEPTH_SCALE==Math.round(DEPTH_SCALE)?'.':''}`;
  const C_MAX_NUM_LIGHTS = 4;
  const C_MAX_LIGHT_REACH = `10.`;

  const FRAGMENT_SHADER = `
  precision ${PRECISION}  float;

  uniform sampler2D ${U_DEPTH_TEXTURE_SAMPLER};
  uniform sampler2D ${U_RENDER_TEXTURE_SAMPLER};
  uniform vec3 ${U_CAMERA_POSITION};

  uniform vec4 ${U_AMBIENT_LIGHT};
  uniform vec4 ${U_LIGHTS}[${C_MAX_NUM_LIGHTS}];
  uniform mat4 ${U_LIGHT_TRANSFORMS}[${C_MAX_NUM_LIGHTS}];

  varying vec2 ${V_SURFACE_TEXTURE_COORD};
  varying vec4 ${V_SURFACE_TEXTURE_BOUNDS};
  varying mat3 ${V_SURFACE_ROTATION};
  varying vec4 ${V_WORLD_POSITION};

  void main() {
    vec3 cameraNormal = normalize(${V_WORLD_POSITION}.xyz - ${U_CAMERA_POSITION});
    vec3 ${L_CAMERA_DIRECTION} = ${V_SURFACE_ROTATION} * cameraNormal;
    vec2 surfacePosition = ${V_SURFACE_TEXTURE_COORD}+${C_MIN_DEPTH}*${L_CAMERA_DIRECTION}.xy/(${L_CAMERA_DIRECTION}.z);
    vec4 ${L_DEPTH_TEXTURE} = vec4(0.);
    
    float pixelDepth=0.;
    /* TODO : make this a while */
    for (float depth=${C_MIN_DEPTH+STEP_DEPTH}; depth<${C_MAX_DEPTH}; depth+=${C_STEP_DEPTH}) {
      vec2 previousSurfacePosition = surfacePosition;
      surfacePosition = ${V_SURFACE_TEXTURE_COORD}-depth*${L_CAMERA_DIRECTION}.xy/(${L_CAMERA_DIRECTION}.z);
      if (all(lessThanEqual(${V_SURFACE_TEXTURE_BOUNDS}.xy, surfacePosition)) && all(lessThan(surfacePosition, ${V_SURFACE_TEXTURE_BOUNDS}.zw))) {
        ${L_DEPTH_TEXTURE} = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, surfacePosition);
        float y1 = (${L_DEPTH_TEXTURE}.b-${VOLUME_DEPTH_PROPORTION})*${C_DEPTH_SCALE}-depth;
        float y0 = ${C_STEP_DEPTH};
        float y2 = (texture2D(${U_DEPTH_TEXTURE_SAMPLER}, previousSurfacePosition).b-${VOLUME_DEPTH_PROPORTION})*${C_DEPTH_SCALE}-depth;
        float scale = 1./(1.-y1/(y0-y2));

        if ((${L_DEPTH_TEXTURE}.b-${VOLUME_DEPTH_PROPORTION})*${C_DEPTH_SCALE}<=depth && ${L_DEPTH_TEXTURE}.a>0. && ${L_DEPTH_TEXTURE}.a*${C_DEPTH_SCALE} > depth && scale>=0. && scale<=1.) {
          vec4 previousSurface = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, previousSurfacePosition);
          if (previousSurface.a>0.) {
            pixelDepth=mix(depth, depth-${C_STEP_DEPTH}, scale);
            surfacePosition = mix(surfacePosition, previousSurfacePosition, scale);
          }
          ${L_DEPTH_TEXTURE} = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, surfacePosition);
          break;
        }
      } else if (depth < 0.) {
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
      //float ${L_LIGHTING} = 0.5 + 0.5 * pow(max(dot(${L_SURFACE_NORMAL}, ${V_SURFACE_ROTATION} * normalize(vec3(1., 1., 1.))), -0.),color.a*4.);
      vec3 ${L_LIGHTING} = ${U_AMBIENT_LIGHT}.xyz;
      vec3 pixelPosition = ${V_WORLD_POSITION}.xyz + pixelDepth * cameraNormal;
      for(${PRECISION} int i=0;i<${C_MAX_NUM_LIGHTS};i++){
        if (float(i)<${U_AMBIENT_LIGHT}.w) {
          vec4 light = ${U_LIGHTS}[i];
          mat4 transform = ${U_LIGHT_TRANSFORMS}[i];
          float brightness = length(light.xyz)/sqrt(3.);
          vec4 lightPosition = transform*vec4(0., 0., 0., 1.);
          vec4 lightDirection = transform*vec4(1., 0., 0., 1.)-lightPosition;
          float reach = brightness * ${C_MAX_LIGHT_REACH};
          if (light.w>=0.) {
            vec3 lightDelta = lightPosition.xyz - pixelPosition;
            if (reach > length(lightDelta)) {
              ${L_LIGHTING} += light.xyz
                  * (1.-pow(length(lightDelta)/reach, 2.))*reach
                  * max(dot(${L_SURFACE_NORMAL}, ${V_SURFACE_ROTATION} * normalize(lightDelta)), 0.)
                  * max(pow(dot(normalize(lightDirection.xyz), normalize(lightDelta)), light.w), 0.)
                  * brightness;
            }
          } else {
            vec4 rotatedLight = transform * vec4(pixelPosition, 1.);
            if (reach > rotatedLight.x && rotatedLight.x > 0.) {
              float p = rotatedLight.x/reach;
              ${L_LIGHTING} += light.xyz
                  * (1.-pow(p, 2.))*reach
                  * max(dot(${L_SURFACE_NORMAL}, ${V_SURFACE_ROTATION} * normalize(lightDirection.xyz)), pow(1.-p, abs(light.w)))
                  * brightness;
            }
          }
        }
      }
      gl_FragColor = vec4(color.rgb*(${L_LIGHTING}), 1.);
    } else {
      discard;
    }
  }
  `;

onload = async () => {
  const canvas = c;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
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
  const CONST_GL_LEQUAL = FLAG_USE_GL_CONSTANTS ? gl.LEQUAL:0x0203;
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



  const TEXTURE_RED_SHINY: Texel[][][] = [[[[128, 92, 92, 255]]]];
  const TEXTURE_GREEN: Texel[][][] = [[[[92, 128, 92, 128]]]];
  const TEXTURE_BLUE_DULL: Texel[][][] = [[[[118, 118, 128, 32]]]];
  const TEXTURE_WHITE_SHINY: Texel[][][] = [[[[255, 255, 255, 255]]]];

  const TEXTURE_SPECKLED: Texel[][][] = [[
    [[0, 0, 0, 128], [255, 255, 255, 128]],
    [[255, 255, 255, 128], [0, 0, 0, 128]],
  ]];

  type LoadingEvent = [string, VolumetricDrawCommand[], [Volume<Texel>[], (SpriteAnimationSequence[])?][]];

  const COMMANDS: readonly LoadingEvent[] = [
    ['wall', VOLUMETRIC_COMMANDS_WALL, [
      [[TEXTURE_BLUE_DULL]],
      [[TEXTURE_WHITE_SHINY, TEXTURE_GREEN, TEXTURE_BLUE_DULL]],
    ]],
    ['marine', VOLUMETRIC_COMMANDS_MARINE, [
      [[TEXTURE_RED_SHINY, TEXTURE_WHITE_SHINY], ANIMATIONS_MARINE],
      [[TEXTURE_GREEN, TEXTURE_GREEN, TEXTURE_WHITE_SHINY, TEXTURE_GREEN], ANIMATIONS_MARINE],
    ]],
  ];

  const eventQueue: EventQueue<LoadingEvent, EntityRenderables[]> = {
    events: [],
    handler: async ([name, commands, variations]) => {
      return await Promise.all(variations.map(async ([renderTextures, animations], i, a) => {
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
              // rewrite the alpha
              debugData.data.set(texture, 0);
              debugData.data.forEach((v, i) => debugData.data[i] = (i+1) % 4 || !v ? v : 255);
              debugContext.putImageData(debugData, 0, 0);
              document.firstChild.appendChild(debugCanvas);  
            });
          }      

          return {
            depthTexture,
            renderTexture,
          }
        }));

        // positions
        const vertexPositions = CARDINAL_PROJECTIONS.map((rotation) => {
          const [omin, omax] = bounds;
          const min = omin as Vector3;
          const max = omax.map(v => v + 1) as Vector3;
          const inverse = matrix4Invert(rotation);
          const transform = matrix4Multiply(
              inverse,
              matrix4Translate(-VOLUME_MIDPOINT, -VOLUME_MIDPOINT, -omin[2]),
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

        d.innerText = `${((1-eventQueue.events.length)+((i+1)/a.length))/COMMANDS.length*100 | 0}%`
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
      }));
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
  gl.clearColor(0, .1, .1, 1);
  gl.clearDepth(1);
  gl.enable(CONST_GL_DEPTH_TEST); 
  gl.depthFunc(CONST_GL_LEQUAL);

  const attributes = ATTRIBUTE_NAMES.map(name => gl.getAttribLocation(shaderProgram, name));
  const uniforms = UNIFORM_NAMES.map(name => gl.getUniformLocation(shaderProgram, name)); 

  const aspect = canvas.width/canvas.height;
  const perspectiveMatrix = matrix4Multiply(
      matrix4InfinitePerspective(CONST_DEFAULT_TAN_FOV_ON_2, aspect, .4),
      //matrix4Perspective(CONST_DEFAULT_TAN_FOV_ON_2, aspect, .35, 10),
      matrix4Rotate(Math.PI/18, 1, 0, 0),
      matrix4Translate(0, 0, -.35),
      matrix4Rotate(-Math.PI/2, 1, 0, 0),
      matrix4Rotate(Math.PI/2, 0, 0, 1),
  );

  const entityRenderables = await addEvents(eventQueue, ...COMMANDS);

  const level = generateLevel(entityRenderables);

  let cameraRotation = 0;
  let targetRotation = cameraRotation;
  let cameraPosition: Vector3 = [LEVEL_DIMENSION/2 | 0, 1, 1.6];
  let targetPosition = [...cameraPosition];
  let numLights = 2;
  // slightly scale up to hide wall-gaps
  const scale = 1/(VOLUME_SCALE*WALL_DIMENSION);
  const modelScaleMatrix = matrix4Scale(scale, scale, scale);
  
  onkeydown = (e: KeyboardEvent) => {
    const actionMultiplier = e.shiftKey ? 0.125 : 1;
    let positionMultiplier = 1;
    switch (e.keyCode) {
      case 37: // left
        targetRotation += Math.PI/2 * actionMultiplier;
        break;
      case 39: // right
        targetRotation -= Math.PI/2 * actionMultiplier;
        break;
      case 40: // down
        positionMultiplier = -1;
      case 38: // up
        const cos = Math.cos(targetRotation) * actionMultiplier;
        const sin = Math.sin(targetRotation) * actionMultiplier;
        targetPosition[0] += cos * positionMultiplier;
        targetPosition[1] += sin * positionMultiplier;
        break;
      case 32: // space
        numLights = (numLights + 1)%4;
        break;
    } 
    //console.log(targetRotation, targetPosition);
  }
  
  let previous = 0;
  const f = (now: number) => {
    requestAnimationFrame(f);

    gl.clear(CONST_GL_COLOR_BUFFER_BIT | CONST_GL_DEPTH_BUFFER_BIT);
    
    let delta = now - previous;
    previous = now;

    cameraRotation += (targetRotation - cameraRotation)*delta/200;
    const deltaPosition = vectorNSubtract(targetPosition, cameraPosition);
    const deltaPositionLength = vectorNLength(deltaPosition);
    if (deltaPositionLength > 0) {
      const movementScale = Math.min(deltaPositionLength, 0.002*delta)/deltaPositionLength;
      cameraPosition = cameraPosition.map((v, i) => v + deltaPosition[i]*movementScale) as Vector3;
    }

    const projectionMatrix = matrix4Multiply(
        perspectiveMatrix,
        matrix4Rotate(-cameraRotation, 0, 0, 1),
    );

    const ambientLight = [.2, .2, .2, numLights];
    const lights = [
      .3, .3, .3, 0,
      .5, .5, .5, 3,
      .49, .49, .5, -9,
    ];
    const lightTransforms = [
      ...matrix4Translate(...cameraPosition), 
      ...matrix4Multiply(matrix4Translate(...cameraPosition), matrix4Rotate(cameraRotation, 0, 0, 1), matrix4Rotate(Math.PI/13, 0, 1, 0), matrix4Translate(.2, -.3, 0)),
      ...matrix4Multiply(matrix4Rotate(-Math.PI/2, 0, 1, 0), matrix4Translate(0, 0, -2)),
    ];

    gl.uniformMatrix4fv(
        uniforms[U_PROJECTION_MATRIX_INDEX],
        false,
        projectionMatrix,
    );
    gl.uniform3fv(
        uniforms[U_CAMERA_POSITIION_INDEX],
        cameraPosition,
    );
    gl.uniform4fv(
        uniforms[U_AMBIENT_LIGHT_INDEX],
        ambientLight,
    );
    gl.uniform4fv(
        uniforms[U_LIGHTS_INDEX],
        lights,
    );
    gl.uniformMatrix4fv(
        uniforms[U_LIGHT_TRANSFORMS_INDEX],
        false,
        lightTransforms,
    );


    volumeMap(level.tiles, (tile: Tile) => {

      tile.parties.forEach(party => {
        const position = party.position;
        const rotation = party.zRotation;
        party.members.forEach(partyMember => {

          const {
            frames,
            surfaceRotationsBuffer,
            textureBoundsBuffer,
            textureCoordinatesBuffer,
            vertexIndexBuffer,
            vertexPositionBuffer,
          } = partyMember.entity.renderables;
          const {
            depthTexture,
            renderTexture,
          } = frames[0][0];
        
          const modelPositionMatrix = matrix4Translate(...position);
          const modelRotationMatrix = matrix4Rotate(rotation, 0, 0, 1);
          const modelViewMatrix = matrix4Multiply(
              modelPositionMatrix,
              modelRotationMatrix,
              modelScaleMatrix,
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

        });
      })
    
      return tile;
    });
  }
  f(0);
};







