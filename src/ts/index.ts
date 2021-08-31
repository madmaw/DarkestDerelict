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
    : [...'abcd'];

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
    : [...'ABCDEFGHI'];

const V_SURFACE_TEXTURE_COORD = FLAG_LONG_SHADER_NAMES ? 'vSurfaceTextureCoord' : 'Z';
const V_SURFACE_TEXTURE_BOUNDS = FLAG_LONG_SHADER_NAMES ? 'vSurfaceTextureBounds' : 'Y';
const V_VERTEX_NORMAL = FLAG_LONG_SHADER_NAMES ? 'vVertexNormal' : 'X';
const V_SURFACE_ROTATION = FLAG_LONG_SHADER_NAMES ? 'vSurfaceRotation' : 'W';
const V_WORLD_POSITION = FLAG_LONG_SHADER_NAMES ? 'vWorldPosition' : 'V';

const PRECISION = `lowp`;

const L_VERTEX_NORMAL = FLAG_LONG_SHADER_NAMES ? 'lVertexNormal' : 'z';

// VERTEX
const VERTEX_SHADER = `
  precision ${PRECISION}  float;

  attribute vec3 ${A_VERTEX_POSITION};
  attribute vec2 ${A_SURFACE_TEXTURE_COORD};
  attribute vec4 ${A_SURFACE_TEXTURE_BOUNDS};
  attribute mat4 ${A_SURFACE_ROTATION};

  uniform mat4 ${U_MODEL_VIEW_MATRIX};
  uniform mat4 ${U_MODEL_ROTATION_MATRIX};
  uniform mat4 ${U_PROJECTION_MATRIX};
  uniform vec3 ${U_CAMERA_POSITION};

  varying vec2 ${V_SURFACE_TEXTURE_COORD};
  varying vec4 ${V_SURFACE_TEXTURE_BOUNDS};
  varying mat3 ${V_SURFACE_ROTATION};
  varying vec4 ${V_WORLD_POSITION};

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

  const CONST_NUM_STEPS = 32;
  const MAX_DEPTH = VOLUME_DIMENSION/TEXTURE_DIMENSION;
  const C_MAX_DEPTH = `${MAX_DEPTH}`;
  const C_MIN_DEPTH = -VOLUME_DEPTH_OFFSET/TEXTURE_DIMENSION;
  const STEP_DEPTH = (MAX_DEPTH-C_MIN_DEPTH)/CONST_NUM_STEPS;
  const C_STEP_DEPTH = `${STEP_DEPTH}`;
  const DEPTH_SCALE = 256/VOLUME_DIMENSION*MAX_DEPTH;
  const C_DEPTH_SCALE = `${DEPTH_SCALE}${DEPTH_SCALE==Math.round(DEPTH_SCALE)?'.':''}`;
  const C_MAX_NUM_LIGHTS = 4;
  const C_MAX_LIGHT_REACH = `6.`;

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
    float depth=${C_MIN_DEPTH};
    float stepDepth=${C_STEP_DEPTH};
    for (int i=0; i<${CONST_NUM_STEPS}; i++) {
      depth+=stepDepth;
      vec2 tempSurfacePosition = ${V_SURFACE_TEXTURE_COORD}-depth*${L_CAMERA_DIRECTION}.xy/(${L_CAMERA_DIRECTION}.z);
      if (all(lessThanEqual(${V_SURFACE_TEXTURE_BOUNDS}.xy, tempSurfacePosition)) && all(lessThan(tempSurfacePosition, ${V_SURFACE_TEXTURE_BOUNDS}.zw))) {
        vec4 tempTexture = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, tempSurfacePosition);

        if ((tempTexture.b-${VOLUME_DEPTH_PROPORTION})*${C_DEPTH_SCALE}<=depth && tempTexture.a>0. && tempTexture.a*${C_DEPTH_SCALE}>depth) {
          ${L_DEPTH_TEXTURE} = tempTexture;
          surfacePosition = tempSurfacePosition;
          pixelDepth=depth;
          depth-=stepDepth;
          stepDepth/=2.;
        }
      } else if (depth > 0.) {
        depth-=stepDepth;
        stepDepth/=2.;
      }
    }
    /*
    ${L_DEPTH_TEXTURE} = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, ${V_SURFACE_TEXTURE_COORD});
    surfacePosition = ${V_SURFACE_TEXTURE_COORD};
    pixelDepth = 0.;
    */
    if (${L_DEPTH_TEXTURE}.a>0.) {
      vec4 color = texture2D(${U_RENDER_TEXTURE_SAMPLER}, surfacePosition);
      vec3 ${L_SURFACE_NORMAL} = vec3(${L_DEPTH_TEXTURE}.x, ${L_DEPTH_TEXTURE}.y, .5)*2.-1.;
      ${L_SURFACE_NORMAL} = vec3(${L_SURFACE_NORMAL}.xy, sqrt(1. - pow(length(${L_SURFACE_NORMAL}), 2.)));
      /*${L_SURFACE_NORMAL} = ${V_SURFACE_ROTATION} * vec3(0., 0., 1.);*/
      //float ${L_LIGHTING} = .5 + .5 * pow(max(dot(${L_SURFACE_NORMAL}, ${V_SURFACE_ROTATION} * normalize(vec3(1., 1., 1.))), -0.),color.a*4.);
      vec3 pixelPosition = ${V_WORLD_POSITION}.xyz + pixelDepth * cameraNormal;
      float cameraDistance = length(pixelPosition-${U_CAMERA_POSITION});
      float fog = 1.-min(pow(cameraDistance/5., 2.), 1.);
      vec3 ${L_LIGHTING} = ${U_AMBIENT_LIGHT}.xyz;
      for(int i=0;i<${C_MAX_NUM_LIGHTS};i++){
        if (float(i)<${U_AMBIENT_LIGHT}.w) {
          vec4 light = ${U_LIGHTS}[i];
          mat4 transform = ${U_LIGHT_TRANSFORMS}[i];
          float brightness = length(light.xyz)/2.;
          vec4 lightPosition = transform*vec4(0., 0., 0., 1.);
          vec3 lightDirection = normalize((transform*vec4(1., 0., 0., 1.)-lightPosition).xyz);
          float reach = brightness*${C_MAX_LIGHT_REACH};
          vec3 lightDelta = lightPosition.xyz - pixelPosition;
          for (float i=0.; i<2.; i++) {
            if (light.w>=0.) {
              float ld = max(dot(lightDirection, normalize(lightDelta)), 0.);
              if (reach > length(lightDelta)) {
                ${L_LIGHTING} += light.xyz
                    /* distance */
                    * (pow(1.-length(lightDelta)/reach, 2.))*reach
                    /* angle */
                    * pow(max(dot(${L_SURFACE_NORMAL}, ${V_SURFACE_ROTATION} * normalize(normalize(lightDelta)-i*cameraNormal)), 0.),.1/color.a) * (i>0.?1.-color.a:color.a)
                    /* cone */
                    * max(pow(ld, light.w), pow(clamp((brightness-length(lightDelta))/brightness, 0., 1.), 2.));
              }
            } else {
              float dp = dot(${L_SURFACE_NORMAL}, normalize(${V_SURFACE_ROTATION} * (lightDirection-i*cameraNormal)));
              if (dp > 0.) {
                float d = (transform * vec4(pixelPosition, 1.)).x/dp;
                if (reach > d && d > 0.) {
                  float p = d/reach;
                  ${L_LIGHTING} += light.xyz * pow(pow(1.-p, 2.)*reach,0.1/color.a) * (i>0.?1.-color.a:color.a);
                }  
              }
              ${L_LIGHTING}+=light.xyz*i*abs(light.w);
            }
          }
        }
      }
      gl_FragColor = vec4(mix(vec3(fog), color.xyz, fog)*(color.a>=1.?vec3(1.):${L_LIGHTING}), 1.);
    } else {
      discard;
    }
  }
  `;

onload = async () => {
  const canvas = Z;
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



  const TEXTURE_RED_SHINY: Texel[][][] = [[[[92, 48, 48, 12]]]];
  const TEXTURE_RED_GLOWING: Texel[][][] = [[[[255, 32, 32, 255]]]];
  const TEXTURE_RED_CARPET: Texel[][][] = [[[[92, 48, 52, 99]]]];
  const TEXTURE_GREEN_SHINY: Texel[][][] = [[[[92, 128, 92, 12]]]];
  const TEXTURE_GREEN: Texel[][][] = [[[[92, 128, 92, 25]]]];
  const TEXTURE_BLUE_CARPET: Texel[][][] = [[[[44, 44, 66, 99]]]];
  const TEXTURE_GUNMETAL: Texel[][][] = [[[[118, 118, 128, 9]]]];
  const TEXTURE_DULLMETAL: Texel[][][] = [[[[118, 118, 128, 18]]]];
  const TEXTURE_GUNCARPET: Texel[][][] = [[[[118, 118, 128, 99]]]];
  const TEXTURE_WHITE_SHINY: Texel[][][] = [[[[255, 255, 255, 12]]]];
  const TEXTURE_WHITE_GLOWING: Texel[][][] = [[[[255, 255, 255, 255]]]];
  const TEXTURE_BLACK: Texel[][][] = [[[[0, 0, 0, 254]]]];
  const TEXTURE_YELLOW_SHUNY: Texel[][][] = [[[[128, 128, 64, 12]]]];
  const TEXTURE_PURPLE_SHINY: Texel[][][] = [[[[128, 64, 128, 12]]]];

  const TEXTURE_SPECKLED: Texel[][][] = [[
    [[0, 0, 0, 128], [255, 255, 255, 128]],
    [[255, 255, 255, 128], [0, 0, 0, 128]],
  ]];

  type LoadingEvent = [VolumetricDrawCommand[] | string, Matrix4, [Volume<Texel>[], ((NumericValue<ValueRange> | CharValue)[] | string)?][],  string];

  const SURFACE_TEXELS: [Volume<Texel>[]][] = [
    [[TEXTURE_GUNMETAL, TEXTURE_RED_CARPET]],
    [[TEXTURE_DULLMETAL, TEXTURE_BLUE_CARPET]],
  ];

  // slightly scale up to hide wall-gaps
  const MODEL_SCALE = 1.01/(VOLUME_SCALE*WALL_DIMENSION);
  const MODEL_SCALE_MATRIX = matrix4Scale(MODEL_SCALE);
  
  const COMMANDS: readonly LoadingEvent[] = [
    [VOLUMETRIC_WALL, MODEL_SCALE_MATRIX, SURFACE_TEXELS, 'wall'],
    [VOLUMETRIC_FLOOR,  MODEL_SCALE_MATRIX, SURFACE_TEXELS, 'floor'],
    [VOLUMETRIC_MARINE, matrix4Scale(MODEL_SCALE * .5), [
      [[TEXTURE_GREEN_SHINY, TEXTURE_WHITE_SHINY, TEXTURE_WHITE_GLOWING]],
      [[TEXTURE_RED_SHINY, TEXTURE_WHITE_SHINY, TEXTURE_WHITE_GLOWING]],
      [[TEXTURE_YELLOW_SHUNY, TEXTURE_BLACK, TEXTURE_WHITE_GLOWING]],
      [[TEXTURE_PURPLE_SHINY, TEXTURE_WHITE_SHINY, TEXTURE_WHITE_GLOWING]],
    ], 'marine'],
    [VOLUMETRIC_PISTOL, matrix4Scale(MODEL_SCALE * .2), [
      [[TEXTURE_GUNMETAL, TEXTURE_BLACK]],
    ], 'pistol'],
    [VOLUMETRIC_SYMBOL, matrix4Scale(MODEL_SCALE * .2), [
      [
        [TEXTURE_YELLOW_SHUNY], 
        FLAG_USE_VOLUME_COMMANDS 
            ? [{
              type: 'char',
              value: '🐱'
            }] : '🐱'
      ],
      [
        [TEXTURE_RED_GLOWING], 
        FLAG_USE_VOLUME_COMMANDS 
            ? [{
              type: 'char',
              value: '🔥'
            }]: '🔥'
      ],
    ], 'symbol'],
  ];

  const loadingEventQueue: EventQueue<LoadingEvent, EntityRenderables[]> = {
    events: [],
    handler: async (c) => {
      const [commands, staticTransform, variations, name] = c;
      Y.innerText = `${(COMMANDS.length-loadingEventQueue.events.length)/COMMANDS.length*100 | 0}%`
      // allow rendering of progress
      await delay();

      return variations.map(([renderTextures, params], i) => {
        let volume: Volume<Voxel>;
        if (FLAG_USE_VOLUME_COMMANDS) {
          volume = processSpriteCommands(name, i, commands as any as VolumetricDrawCommand[], params as (NumericValue<ValueRange> | CharValue)[]);
        } else {
          volume = processVolumetricDrawCommandString(commands as string, params as string).volume;
        }
        const bounds = calculateVolumeBounds(volume);

        
        // render/depth bounds should be the same
        const [depthTextureData, depthTextureBounds] = volumeToDepthTexture(volume, bounds);
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

        const thumbnailCanvas = document.createElement('canvas');
        // because the model faces down the x axis, the image is laying on its side
        const w = bounds[1][1] - bounds[0][1]+1;
        const h = bounds[1][2] - bounds[0][2]+1;
        thumbnailCanvas.width = w;
        thumbnailCanvas.height = h;

        const ctx = thumbnailCanvas.getContext('2d');
        const imageData = ctx.createImageData(w, h);
        for (let x=0; x<w; x++) {
          for (let y=0; y<h; y++) {
            const sy = x;
            const sx = y;
            const sourceOffset = sy*TEXTURE_DIMENSION*4 + sx*4;
            const c = renderTextureData.slice(sourceOffset, sourceOffset+4);
            const n = 1 - (depthTextureData[sourceOffset] + depthTextureData[sourceOffset+1])/510;
            imageData.data.set(c.map((c, i) => (i+1)%4 ? c * n : c ? 255 : 0), y*w*4+x*4);
          }
        }
        ctx.putImageData(imageData, 0, 0);

        // unfortunately, using a canvas doesn't seem to work for drag and drop as it has zero-width when not attached to the document
        let thumbnail: HTMLCanvasElement | HTMLImageElement;
        if (FLAG_CANVAS_THUMBNAILS) {
          thumbnail = thumbnailCanvas;
          // doesn't work either
          // thumbnail.style.width = w as any;
          // thumbnail.style.height = h as any;
        } else {
          thumbnail = document.createElement('img');
          thumbnail.src = thumbnailCanvas.toDataURL();  
        }

        if (FLAG_DEBUG_TEXTURES) {
          document.firstChild.appendChild(thumbnailCanvas);

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

        return {
          depthTexture,
          renderTexture,
          thumbnail,
          bounds,
          vertexPositionBuffer,
          vertexIndexBuffer,
          surfaceRotationsBuffer,
          textureBoundsBuffer,
          textureCoordinatesBuffer,
          staticTransform,
        } as EntityRenderables;
      });
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
  const zNear = .2;
  const perspectiveMatrix = matrix4Multiply(
      matrix4InfinitePerspective(CONST_DEFAULT_TAN_FOV_ON_2, aspect, zNear),
      //matrix4Perspective(CONST_DEFAULT_TAN_FOV_ON_2, aspect, .35, 10),
      matrix4Rotate(-Math.PI/2, 1, 0, 0),
      matrix4Rotate(Math.PI/2, 0, 0, 1),
      matrix4Rotate(-Math.PI/12, 0, 1, 0),
  );
  const negatedCameraOffsetPosition: Vector3 = [.4, 0, -.6];

  const entityRenderables = await addEvents(loadingEventQueue, ...COMMANDS);
  
  X.innerHTML = new Array(4).fill(X.innerHTML).join('');
  V.innerHTML = new Array(4).fill(V.innerHTML).join('');  
  Y.hidden = true;

  const equipmentSlots: Element[] = new Array(X.children.length).fill(0).map((_, i) => X.children.item(i));
  const inventorySlots: Element[] = new Array(V.children.length).fill(0).map((_, i) => V.children.item(i));
  const gameEventQueue: EventQueue<GameEvent, void> = {
    events: [],
    handler: async (e: GameEvent) => {
      switch (e.type) {
        case GAME_EVENT_TYPE_MOVE:
          {
            const { unrotatedDeltaPosition, party } = e;
            const a = party.orientation * Math.PI/2;

            const deltaPosition = vector2Rotate(a, unrotatedDeltaPosition.slice(0, 2) as Vector2).concat(unrotatedDeltaPosition[2]);
            const from = party.tile;
            const to = from.map((v, i) => Math.round(v + deltaPosition[i])) as Vector3;
            const toTile = game.level[to[2]][to[1]][to[0]] as Tile;
            if (toTile.parties.some(p => p.type == PARTY_TYPE_OBSTACLE)) {
              if (party == playerParty) {
                // just animate the camera in and out
                const toCameraPosition = from.map((v, i) => v + deltaPosition[i]/6) as Vector3;
                const toAnimationFactory = createTweenAnimationFactory(party, 'cameraPosition', toCameraPosition, easeInQuad, 99);
                const returnAnimationFactory = createTweenAnimationFactory(party, 'cameraPosition', party.cameraPosition, easeOutQuad, 99);
                await addEvents(party.cameraAnimationQueue, toAnimationFactory, returnAnimationFactory); 
              }
            } else {
              const fromTile = game.level[from[2]][from[1]][from[0]] as Tile;
              fromTile.parties.splice(fromTile.parties.indexOf(party), 1);
              toTile.parties.push(party);
              party.tile = to;
              let cameraMovePromise: Promise<any>;
              if (party == playerParty) {
                // move the camera too
                const toCameraPosition = [...to] as Vector3;
                const animationFactory = createTweenAnimationFactory(party, 'cameraPosition', toCameraPosition, easeInQuad, 300);
                cameraMovePromise = addEvents(party.cameraAnimationQueue, animationFactory); 
              }
              // animate
              await Promise.all(party.members.map(async (member, i) => {
                if (member) {
                  const [targetPosition] = getTargetPositionAndRotations(party, i);

                  const animationFactory = createTweenAnimationFactory(member, 'position', targetPosition, easeInQuad, 200);
                  await addEvents(member.animationQueue, animationFactory);
                }
              }).concat(cameraMovePromise));  
            }
          }
          break;
        case GAME_EVENT_TYPE_TURN:
          {
            const { deltaOrientation, party } = e;
            const toOrientation = (party.orientation + deltaOrientation + 4)%4;
            party.orientation = toOrientation as Orientation;
            let cameraRotationPromise: Promise<any>;
            if(party == playerParty) {
              const cameraAnimationFactory = createTweenAnimationFactory(party, 'cameraZRotation', party.cameraZRotation + deltaOrientation * Math.PI/2, easeInQuad, 300);
              cameraRotationPromise = addEvents(party.cameraAnimationQueue, cameraAnimationFactory);
            }

            await Promise.all(party.members.map(async (member, i) => {
              if (member) {
                const [targetPosition, walkAngle, toAngle] = getTargetPositionAndRotations(party, i);
                const turnAnimationFactory1 = createTweenAnimationFactory(member, 'zRotation', walkAngle, easeInQuad, 150);
                const moveAnimationFactory = createTweenAnimationFactory(member, 'position', targetPosition, easeInQuad, 200);
                const turnAnimationFactory2 = createTweenAnimationFactory(member, 'zRotation', toAngle, easeInQuad, 150);
                await addEvents(member.animationQueue, turnAnimationFactory1, moveAnimationFactory, turnAnimationFactory2);  
              }
            }).concat(cameraRotationPromise));
          }
          break;
        case GAME_EVENT_TYPE_CHANGE_LOADOUT:
          {
            let replacementEntity: Entity | Falseish;
            let replacementMember: PartyMember | Falseish;
            let success: Booleanish;
            const purpose = ENTITY_TYPES_TO_PURPOSES[e.entity.type];
            const toSlot = e.to.party.members[e.to.slot];
            const fromSlot = e.from.party.members[e.from.slot] as PartyMember;
            if (purpose == ENTITY_PURPOSE_CHARACTER) {
              replacementMember = toSlot;
              success = 1;
              e.to.party.members[e.to.slot] = e.from.party.members[e.from.slot];
            } else if (purpose == ENTITY_PURPOSE_WEAPON) {
              if (toSlot) {
                switch (ENTITY_TYPES_TO_PURPOSES[toSlot.entity.type]) {
                  case ENTITY_PURPOSE_CHARACTER:
                    replacementEntity = toSlot.weapon;
                    success = toSlot.weapon = e.entity;    
                    break;
                  case ENTITY_PURPOSE_WEAPON:
                    success = replacementEntity = toSlot.entity;
                    break;
                }
              } else {
                success = e.to.party.members[e.to.slot] = {
                  animationQueue: createAnimationEventQueue(game),
                  anims: [],
                  entity: e.entity,
                  position: e.to.party.tile,
                  zRotation: e.party.orientation * Math.PI/2,
                };
              }
            }
            if (success) {
              if (replacementMember || e.entity == fromSlot.entity) {
                e.from.party.members[e.from.slot] = replacementMember;
              } else {
                fromSlot.weapon = replacementEntity;
              }
            }
            updateInventory();
            // animate
            if (purpose == ENTITY_PURPOSE_CHARACTER) {
              let toSlotPromise: Promise<any>;
              if (replacementMember) {
                const [targetPosition, walkAngle, toAngle] = getTargetPositionAndRotations(e.from.party, e.from.slot);
                const turnAnimationFactory1 = createTweenAnimationFactory(replacementMember, 'zRotation', walkAngle, easeLinear, 99);
                const moveAnimationFactory = createTweenAnimationFactory(replacementMember, 'position', targetPosition, easeLinear, 99);
                const turnAnimationFactory2 = createTweenAnimationFactory(replacementMember, 'zRotation', toAngle, easeLinear, 99);
                toSlotPromise = addEvents(replacementMember.animationQueue, turnAnimationFactory1, moveAnimationFactory, turnAnimationFactory2);  
              }
              const [targetPosition, walkAngle, toAngle] = getTargetPositionAndRotations(e.to.party, e.to.slot);
              const turnAnimationFactory1 = createTweenAnimationFactory(fromSlot, 'zRotation', walkAngle, easeLinear, 99);
              const moveAnimationFactory = createTweenAnimationFactory(fromSlot, 'position', targetPosition, easeLinear, 99);
              const turnAnimationFactory2 = createTweenAnimationFactory(fromSlot, 'zRotation', toAngle, easeLinear, 99);
              await Promise.all([
                addEvents(fromSlot.animationQueue, turnAnimationFactory1, moveAnimationFactory, turnAnimationFactory2),
              ].concat(toSlotPromise));  
            }
          }
          break;
      }
    },
  };

  const game: Game = {
    time: 0,
  };
  game.level = generateLevel(game, entityRenderables);
  const partyPosition: Vector3 = [LEVEL_DIMENSION/2 | 0, 1, 1];
  const playerParty: Party = {
    members: new Array(4).fill(0),
    orientation: ORIENTATION_NORTH,
    type: PARTY_TYPE_PLAYER,
    tile: partyPosition,
    cameraPosition: [LEVEL_DIMENSION/2 | 0, 1, 1],
    cameraZRotation: Math.PI/2,
    anims: [],
  };
  playerParty.cameraAnimationQueue = createAnimationEventQueue(game);
  playerParty.members[0] = {
    position: partyPosition,
    zRotation: Math.PI/2,
    animationQueue: createAnimationEventQueue(game),
    anims: [],
    entity: {
      renderables: entityRenderables[ENTITY_TYPE_MARINE][0],
      type: ENTITY_TYPE_MARINE,
    },
    weapon: {
      renderables: entityRenderables[ENTITY_TYPE_PISTOL][0],
      type: ENTITY_TYPE_PISTOL,
    }
  };
  (game.level[partyPosition[2]][partyPosition[1]][partyPosition[0]] as Tile).parties.push(playerParty);

  let slotsToEntities: Map<EventTarget, Entity> | undefined;

  let dragContext: {
    entity: Entity,
    fromLocation: EntityLocation,
    dragImage: HTMLElement,
    currentTarget?: EventTarget,
    lastPosition?: {
      clientX: number,
      clientY: number,
    }
  } | undefined | null;

  const getLocationAndMaybeEntity = (target: EventTarget, p: { clientX: number, clientY: number }): [EntityLocation, Entity?] | undefined => {
    const entity = slotsToEntities?.get(target);
    const equipmentIndex = equipmentSlots.findIndex(v => v == target || v == (target as HTMLElement).parentElement);
    const inventoryIndex = inventorySlots.findIndex(v => v == target);
    const targetsWorld = target == Z;
    if (equipmentIndex >= 0) {
      return [{
        party: playerParty,
        slot: equipmentIndex,
      }, entity];
    }
    if (inventoryIndex >= 0) {
      return [{
        party: playerParty,
        slot: inventoryIndex,
      }, entity];
    }
    if (targetsWorld) {
      // attempt to find the entity in the world
      const projectionMatrix = matrix4Multiply(
          perspectiveMatrix,
          matrix4Translate(...negatedCameraOffsetPosition),
          matrix4Rotate(-playerParty.cameraZRotation, 0, 0, 1),
          // NOTE: the shader usually does this for us
          matrix4Translate(...vectorNDivide(playerParty.cameraPosition, -1)),
      );
      let minParty: Party | undefined;
      let minSlot: number | undefined;
      let minEntity: Entity | undefined;
      let minDistance: number = CONST_MAX_REACH;
      const sx = p.clientX*2/Z.clientWidth - 1;
      // flip y coordinates so screen coordinates = world coordinates
      const sy = 1 - p.clientY*2/Z.clientHeight;
      volumeMap(game.level, (t) => {
        // get screen position
        (t as Tile).parties.forEach(party => party.type == PARTY_TYPE_ITEM && party.members.forEach((partyMember, slot) => {
          if (partyMember) {
            const { 
              staticTransform,
              bounds,
            } = partyMember.entity.renderables;
            const [min, max] = bounds;
            // note: because the screen coordinates are -1 to 1 we don't divide by 2 since the diameter will be the radius
            // for us in screen coordinates
            const midpoints = vector3TransformMatrix4(staticTransform, ...max.map((v, i) => v - min[i]) as Vector3);
            const midz = midpoints[2];
            
            const position = partyMember.position;
            const averageExtent = midpoints.reduce((a, v) => a + v/3, 0);
            const v = vector4TransformMatrix4(projectionMatrix, position[0], position[1], position[2]+midz/2);
            const [px, py, pz, pw] = v;
            if (Math.abs(px) < 1 && Math.abs(py) < 1 && pz/pw > 0 && pw < minDistance) {
              const r = averageExtent/pw;
              if (vectorNLength(vectorNSubtract([sx, sy], v)) < r) {
                minParty = party;
                minSlot = slot;
                minEntity = partyMember.entity;
                minDistance = pw;
              }
            }
          }
        }))
        return t;
      });
      if (minParty) {
        return [{
          party: minParty,
          slot: minSlot,
        }, minEntity];  
      } else {
        // return some reference to an empty slot in the current tile
        const currentPosition = playerParty.tile;
        const tile = game.level[currentPosition[2]][currentPosition[1]][currentPosition[0]] as Tile;
        let items = tile.parties.find(p => p.type == PARTY_TYPE_ITEM);
        if (!items) {
          items = {
            anims: [],
            members: [],
            orientation: ORIENTATION_EAST,
            tile: currentPosition,
            type: PARTY_TYPE_ITEM,
          }
          tile.parties.push(items);
        }
        let index = items.members.findIndex(m => !m);
        if (index < 0) {
          index = items.members.length;
        }
        return [{
          party: items,
          slot: index,
        }];
      }
    }
  }

  const onStartDrag = (target: EventTarget, p: { clientX: number, clientY: number }) => {
    const locationAndEntity = getLocationAndMaybeEntity(target, p);
    if (locationAndEntity && locationAndEntity[1]) {
      const [fromLocation, entity] = locationAndEntity;
      const dragImage = entity.renderables.thumbnail;
      dragContext = {
        fromLocation,
        entity,
        dragImage,
      };
      O.appendChild(dragImage);
      onDrag(p);
    }
  };
  onmousedown = (e: MouseEvent) => {
    onStartDrag(e.target, e);
  };
  ontouchstart = (e: TouchEvent) => {
    onStartDrag(e.target, e.targetTouches[0]);
  }


  const onDrag = (p: { clientX: number, clientY: number }) => {
    const target = document.elementFromPoint(p.clientX, p.clientY);
    if (dragContext) {
      dragContext.currentTarget = target;
      dragContext.lastPosition = p;
      updateInventory();
      const dragImage = dragContext.dragImage;
      dragImage.style.left = p.clientX - dragImage.clientWidth/2 as any;
      dragImage.style.top = p.clientY - dragImage.clientHeight/2 as any;
    }
    return target;
  };
  onmousemove = (e: MouseEvent) => {
    onDrag(e);
  }
  ontouchmove = (e: TouchEvent) => {
    onDrag(e.targetTouches[0]);
  }

  const onDragEnd = (p: { clientX: number, clientY: number }) => {
    const target = onDrag(p);
    const location = getLocationAndMaybeEntity(target, p);
    if (dragContext && location) {
      const fromLocation = dragContext.fromLocation;
      const [toLocation] = location;
      if (fromLocation.party != toLocation.party || fromLocation.slot != toLocation.slot) {
        addEvents(gameEventQueue, {
          party: playerParty,
          type: GAME_EVENT_TYPE_CHANGE_LOADOUT,
          entity: dragContext.entity,
          from: dragContext.fromLocation,
          to: toLocation,
        });  
      }
    }
    cleanUpDrag();
  }
  onmouseup = (e: MouseEvent) => {
    if (dragContext) {
      onDragEnd(e);
    }
  }
  ontouchend = (e: TouchEvent) => {
    onDragEnd(e.targetTouches[0] || dragContext.lastPosition);
  }

  const cleanUpDrag = () => {
    if (dragContext) {
      O.removeChild(dragContext.dragImage);
      dragContext = null;  
      updateInventory();
    }
  }

  onmouseleave = ontouchcancel = cleanUpDrag;

  const renderEntityToCanvas = (entity: Entity | Falseish, canvas: HTMLCanvasElement) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (entity && entity != dragContext?.entity) {
      slotsToEntities.set(canvas, entity);
      const thumbnail = entity.renderables.thumbnail;
      const scale = Math.min(canvas.width*.6/thumbnail.width, canvas.height*.8/thumbnail.height);
      ctx.drawImage(
          thumbnail,
          (canvas.width - thumbnail.width*scale)/2,
          (canvas.height - thumbnail.height*scale)/2,
          thumbnail.width*scale,
          thumbnail.height*scale,
      );
    }
  }

  const updateInventory = () => {
    slotsToEntities = new Map();
    playerParty.members.forEach((m, i) => {
      const el = X.children.item(i) as HTMLElement;
      const entityElement: HTMLCanvasElement = el.querySelector('.a');
      const weaponElement: HTMLCanvasElement = el.querySelector('.b');
      el.className = [entityElement, weaponElement, el].some(e => e == dragContext?.currentTarget)
          ? 'x o'
          : 'x';
      renderEntityToCanvas(m && m.entity, entityElement);
      renderEntityToCanvas(m && m.weapon, weaponElement);
    });
  };
  updateInventory();

  onkeydown = (e: KeyboardEvent) => {
    const actionMultiplier = e.shiftKey ? 0.125 : 1;
    let positionMultiplier = 1;
    switch (e.keyCode) {
      case 37: // left
      case 39: // right
        addEvents(gameEventQueue, {
          type: GAME_EVENT_TYPE_TURN,
          party: playerParty,
          deltaOrientation: 38 - e.keyCode,
        })
        break;
      case 40: // down
        positionMultiplier = -1;
      case 38: // up
        addEvents(gameEventQueue, {
          type: GAME_EVENT_TYPE_MOVE,
          party: playerParty,
          unrotatedDeltaPosition: [positionMultiplier, 0, 0],
        })
        break;
    } 
    //console.log(targetRotation, targetPosition);
  }

  const f = (now: number) => {
    requestAnimationFrame(f);

    gl.clear(CONST_GL_COLOR_BUFFER_BIT | CONST_GL_DEPTH_BUFFER_BIT);
    
    game.time = now;


    const cameraRotationMatrix = matrix4Rotate(playerParty.cameraZRotation, 0, 0, 1);
    const negatedCameraRotationMatrix = matrix4Rotate(-playerParty.cameraZRotation, 0, 0, 1);
    const rotatedNegatedOffsetMatrix = vector3TransformMatrix4(cameraRotationMatrix, ...negatedCameraOffsetPosition);
    
    const cameraPosition = vectorNSubtract(playerParty.cameraPosition, rotatedNegatedOffsetMatrix);

    const projectionMatrix = matrix4Multiply(
        perspectiveMatrix,
        negatedCameraRotationMatrix,
    );

    const usableLights = (game.previousLights || []).sort((a, b) => {
      return vectorNLength(vectorNSubtract(a.position, cameraPosition)) - vectorNLength(vectorNSubtract(b.position, cameraPosition));
    }).slice(0, C_MAX_NUM_LIGHTS);
    const lights = usableLights.map(l => l.light).flat();
    const lightTransforms = usableLights.map(l => l.lightTransform).flat();
    game.previousLights = [];

    const ambientLight = [.1, .1, .1, usableLights.length];
    // global lighting
    // const lights = [
    //   [.45, .45, .5, -1],
    //   ,
    //   ,
    // ].slice(light, light+1).flat();;
    // const lightTransforms = [
    //   , 
    //   matrix4Multiply(
    //       matrix4Translate(
    //           torchBearer.position[0],
    //           torchBearer.position[1],
    //           torchBearer.position[2] + .5,
    //       ),
    //       cameraRotationMatrix,
    //   ),
    //   matrix4Multiply(matrix4Rotate(-Math.PI/2, 0, 1, 0), matrix4Translate(0, 0, -2)),
    // ].slice(light, light+1).flat();

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


    volumeMap(game.level, (tile: Tile) => {

      tile.parties.forEach(party => {
        party.anims = party.anims.filter(a => !a(now));

        party.members.forEach((partyMember, i) => {
          if (!partyMember) {
            return;
          }
          partyMember.anims = partyMember.anims.filter(a => !a(now));
          if (partyMember.entity.type == ENTITY_TYPE_MARINE) {
            if (!i && party.type == PARTY_TYPE_PLAYER) {
              game.previousLights.push({
                position: partyMember.position,
                light: [.8, .8, .75, 2],
                lightTransform: matrix4Multiply(
                    matrix4Translate(...partyMember.position),
                    matrix4Rotate(party.cameraZRotation + Math.PI, 0, 0, 1),
                    matrix4Translate(.2, 0, .5),
                    matrix4Rotate(-Math.PI/9, 0, 1, 0),
                )
              });
            } else {
              game.previousLights.push({
                position: partyMember.position,
                light: [.5, .5, .5, 1],
                lightTransform: matrix4Multiply(
                    matrix4Translate(...partyMember.position),
                    matrix4Rotate(partyMember.zRotation + Math.PI, 0, 0, 1),
                    matrix4Translate(-.2, 0, .3),
                    matrix4Rotate(-Math.PI/4, 0, 1, 0),
                )
              })
            }
          }

          if (dragContext && dragContext.entity == partyMember.entity || party == playerParty) {
            return;
          }

          const {
            depthTexture,
            renderTexture,
            surfaceRotationsBuffer,
            textureBoundsBuffer,
            textureCoordinatesBuffer,
            vertexIndexBuffer,
            vertexPositionBuffer,
            staticTransform,
          } = partyMember.entity.renderables;

          const position = partyMember.position;
          const rotation = partyMember.zRotation;
          const modelPositionMatrix = matrix4Translate(...position);
          const modelRotationMatrix = matrix4Rotate(rotation, 0, 0, 1);
          const modelViewMatrix = matrix4Multiply(
              modelPositionMatrix,
              modelRotationMatrix,
              staticTransform,
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







