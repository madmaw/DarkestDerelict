///<reference path="./flags.ts"/>
///<reference path="./constants.ts"/>
///<reference path="./volumetric.ts"/>
///<reference path="./gl.ts"/>
///<reference path="./volumes/wall_inset.ts"/>
///<reference path="./volumes/marine.ts"/>
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

const U_STATUS_TEXTURE_SAMPLER_INDEX = 6;
const U_STATUS_TEXTURE_SAMPLER = FLAG_LONG_SHADER_NAMES ? 'uStatusTextureSampler' : 'G';

const U_LIGHTS_INDEX = 7;
const U_LIGHTS = FLAG_LONG_SHADER_NAMES ? 'uLights' : 'H';

const U_LIGHT_TRANSFORMS_INDEX = 8;
const U_LIGHT_TRANSFORMS = FLAG_LONG_SHADER_NAMES ? 'uLightTransforms': 'I';

// const U_AMBIENT_LIGHT_INDEX = 9;
// const U_AMBIENT_LIGHT = FLAG_LONG_SHADER_NAMES ? 'uAmbientLight' : 'J';

const UNIFORM_NAMES = FLAG_LONG_SHADER_NAMES
    ? [
      U_MODEL_VIEW_MATRIX,
      U_MODEL_ROTATION_MATRIX,
      U_PROJECTION_MATRIX,
      U_CAMERA_POSITION,
      U_DEPTH_TEXTURE_SAMPLER,
      U_RENDER_TEXTURE_SAMPLER,
      U_STATUS_TEXTURE_SAMPLER,
      U_LIGHTS,
      U_LIGHT_TRANSFORMS,
      // U_AMBIENT_LIGHT,
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
  uniform vec4 ${U_CAMERA_POSITION};

  varying vec2 ${V_SURFACE_TEXTURE_COORD};
  varying vec4 ${V_SURFACE_TEXTURE_BOUNDS};
  varying mat3 ${V_SURFACE_ROTATION};
  varying vec4 ${V_WORLD_POSITION};

  void main() {
    ${V_WORLD_POSITION} = ${U_MODEL_VIEW_MATRIX} * vec4(${A_VERTEX_POSITION}, 1.);
    gl_Position = ${U_PROJECTION_MATRIX} * vec4(${V_WORLD_POSITION}.xyz-${U_CAMERA_POSITION}.xyz, 1.);
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
  const L_CAMERA_NORMAL = FLAG_LONG_SHADER_NAMES ? 'lCameraNormal' : 'v';
  const L_SURFACE_POSITION = FLAG_LONG_SHADER_NAMES ? 'lSurfacePosition' : 'u';
  const L_TEMP_SURFACE_POSITION = FLAG_LONG_SHADER_NAMES ? 'lTempSurfacePosition' : 't';
  const L_TEMP_TEXTURE = FLAG_LONG_SHADER_NAMES ? 'lTempTexture' : 's';
  const L_COLOR = FLAG_LONG_SHADER_NAMES ? 'lColor' : 'r';
  const L_PIXEL_POSITION = FLAG_LONG_SHADER_NAMES ? 'lPixelPosition' : 'q';
  const L_PIXEL_DEPTH = FLAG_LONG_SHADER_NAMES ? 'lPixelDepth' : 'p';
  const L_DEPTH = FLAG_LONG_SHADER_NAMES ? 'lDepth' : 'o';
  const L_STEP_DEPTH = FLAG_LONG_SHADER_NAMES ? 'lStepDepth' : 'n';
  //const L_FOG = FLAG_LONG_SHADER_NAMES ? 'lFog' : 'm';
  const L_LIGHT = FLAG_LONG_SHADER_NAMES ? 'lLight' : 'l';
  const L_BRIGHTNESS = FLAG_LONG_SHADER_NAMES ? 'lBrightness' : 'k';
  // i, j reserved for loops
  const L_LIGHT_POSITION = FLAG_LONG_SHADER_NAMES ? 'lLightPosition' : 'h';
  const L_REACH = FLAG_LONG_SHADER_NAMES ? 'lReach' : 'g';
  const L_LIGHT_DELTA = FLAG_LONG_SHADER_NAMES ? 'lLightDelta' : 'f';
  
  const CONST_MAX_NUM_STEPS = 64;
  const CONST_TARGET_NUM_STEPS = 32;
  const MAX_DEPTH = VOLUME_DIMENSION/TEXTURE_DIMENSION;
  const C_MAX_DEPTH = `${MAX_DEPTH}`;
  const BASE_STEP_DEPTH = FLAG_USE_HAND_ROLLED_GLSL_CONSTANTS ? .0022 : MAX_DEPTH/CONST_TARGET_NUM_STEPS;
  const MIN_STEP_DEPTH = FLAG_USE_HAND_ROLLED_GLSL_CONSTANTS ? .0011 : MAX_DEPTH/CONST_MAX_NUM_STEPS;
  const DEPTH_SCALE = 256/VOLUME_DIMENSION*MAX_DEPTH;
  const C_DEPTH_SCALE = `${DEPTH_SCALE}`;
  const C_MAX_NUM_LIGHTS = 4;
  const C_MAX_LIGHT_REACH = `6.`;
  // need to ensure that we will actually have enough space on the texture
  const STATUS_SCALE = TEXTURE_DIMENSION/(VOLUME_DIMENSION*2); 
  const C_STATUS_SCALE = `${STATUS_SCALE}.`;

  const FRAGMENT_SHADER = `
  precision ${PRECISION}  float;

  uniform sampler2D ${U_DEPTH_TEXTURE_SAMPLER};
  uniform sampler2D ${U_RENDER_TEXTURE_SAMPLER};
  uniform sampler2D ${U_STATUS_TEXTURE_SAMPLER};
  uniform vec4 ${U_CAMERA_POSITION};

  uniform vec4 ${U_LIGHTS}[${C_MAX_NUM_LIGHTS}];
  uniform mat4 ${U_LIGHT_TRANSFORMS}[${C_MAX_NUM_LIGHTS}];

  varying vec2 ${V_SURFACE_TEXTURE_COORD};
  varying vec4 ${V_SURFACE_TEXTURE_BOUNDS};
  varying mat3 ${V_SURFACE_ROTATION};
  varying vec4 ${V_WORLD_POSITION};

  void main() {
    vec3 ${L_CAMERA_NORMAL} = normalize(${V_WORLD_POSITION}.xyz - ${U_CAMERA_POSITION}.xyz);
    vec3 ${L_CAMERA_DIRECTION} = ${V_SURFACE_ROTATION} * ${L_CAMERA_NORMAL};
    vec2 ${L_SURFACE_POSITION} = ${V_SURFACE_TEXTURE_COORD};
    // trick CC into maintaining the quote style here so our post-compilation regex don't munge everything
    vec4 ${L_DEPTH_TEXTURE} = vec4(${FLAG_PRODUCTION_MINIMAL ? Math.random()/999 : '0.'});
    
    float ${L_PIXEL_DEPTH}=0.;
    float ${L_DEPTH}=0.;
    float ${L_STEP_DEPTH}=max(${BASE_STEP_DEPTH}*dot(vec3(0., 0., -1.), ${L_CAMERA_DIRECTION}), ${MIN_STEP_DEPTH});
    for (int i=0; i<${CONST_MAX_NUM_STEPS}; i++) {
      ${L_DEPTH}+=${L_STEP_DEPTH};
      vec2 ${L_TEMP_SURFACE_POSITION} = ${V_SURFACE_TEXTURE_COORD}-${L_DEPTH}*${L_CAMERA_DIRECTION}.xy/(${L_CAMERA_DIRECTION}.z);
      if (all(lessThanEqual(${V_SURFACE_TEXTURE_BOUNDS}.xy, ${L_TEMP_SURFACE_POSITION})) && all(lessThan(${L_TEMP_SURFACE_POSITION}, ${V_SURFACE_TEXTURE_BOUNDS}.zw))) {
        vec4 ${L_TEMP_TEXTURE} = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, ${L_TEMP_SURFACE_POSITION});

        if (${L_TEMP_TEXTURE}.b*${C_DEPTH_SCALE}<=${L_DEPTH} && ${L_TEMP_TEXTURE}.a>0. && ${L_TEMP_TEXTURE}.a*${C_DEPTH_SCALE}>${L_DEPTH}) {
          ${L_DEPTH_TEXTURE} = ${L_TEMP_TEXTURE};
          ${L_SURFACE_POSITION} = ${L_TEMP_SURFACE_POSITION};
          ${L_PIXEL_DEPTH}=${L_DEPTH};
          ${L_DEPTH}-=${L_STEP_DEPTH};
          ${L_STEP_DEPTH}/=2.;
        }
      } else {
        ${L_DEPTH}-=${L_STEP_DEPTH};
        ${L_STEP_DEPTH}/=2.;
      }
    }
    //${L_DEPTH_TEXTURE} = texture2D(${U_DEPTH_TEXTURE_SAMPLER}, ${V_SURFACE_TEXTURE_COORD});
    //${L_SURFACE_POSITION} = ${V_SURFACE_TEXTURE_COORD};
    //${L_PIXEL_DEPTH} = 0.;
    //vec4 ${L_TEMP_TEXTURE} = all(equal(${V_SURFACE_TEXTURE_BOUNDS}.xy, vec2(0.))) ? texture2D(${U_STATUS_TEXTURE_SAMPLER}, ${V_SURFACE_TEXTURE_COORD}*${C_STATUS_SCALE}) : vec4(0.);
    vec4 ${L_TEMP_TEXTURE} = dot(${L_CAMERA_DIRECTION}, vec3(0.,0.,-1.))>.7 ? texture2D(${U_STATUS_TEXTURE_SAMPLER}, (${V_SURFACE_TEXTURE_COORD}-${V_SURFACE_TEXTURE_BOUNDS}.xy)*${C_STATUS_SCALE}) : vec4(0.);
    if (${L_DEPTH_TEXTURE}.a>0.) {
      vec4 ${L_COLOR} = texture2D(${U_RENDER_TEXTURE_SAMPLER}, ${L_SURFACE_POSITION});
      //vec2 v = ${V_SURFACE_TEXTURE_COORD}/${V_SURFACE_TEXTURE_BOUNDS}.zw;
      //vec4 ${L_TEMP_TEXTURE} = all(equal(${V_SURFACE_TEXTURE_BOUNDS}.xy, vec2(0.))) ? vec4(v.x, v.y, 0., 1.) : vec4(0.);
      vec3 ${L_SURFACE_NORMAL} = vec3(${L_DEPTH_TEXTURE}.x, ${L_DEPTH_TEXTURE}.y, .5)*2.-1.;
      ${L_SURFACE_NORMAL} = vec3(${L_SURFACE_NORMAL}.xy, sqrt(1. - pow(length(${L_SURFACE_NORMAL}), 2.)));
      //${L_SURFACE_NORMAL} = ${V_SURFACE_ROTATION} * vec3(0., 0., 1.);
      vec3 ${L_PIXEL_POSITION} = ${V_WORLD_POSITION}.xyz + ${L_PIXEL_DEPTH} * ${L_CAMERA_NORMAL};
      vec3 ${L_LIGHTING} = vec3(0.);
      for(int i=0;i<${C_MAX_NUM_LIGHTS};i++){
        if (float(i)<${U_CAMERA_POSITION}.w) {
          vec4 ${L_LIGHT} = ${U_LIGHTS}[i];
          float ${L_BRIGHTNESS} = length(${L_LIGHT}.xyz)/2.;
          vec4 ${L_LIGHT_POSITION} = ${U_LIGHT_TRANSFORMS}[i]*vec4(0., 0., 0., 1.);
          float ${L_REACH} = ${L_BRIGHTNESS}*${C_MAX_LIGHT_REACH};
          vec3 ${L_LIGHT_DELTA} = ${L_LIGHT_POSITION}.xyz - ${L_PIXEL_POSITION};
          for (float j=0.; j<2.; j++) {
            if (${L_REACH} > length(${L_LIGHT_DELTA})) {
              ${L_LIGHTING} += ${L_LIGHT}.xyz
                  // distance 
                  * (pow(1.-length(${L_LIGHT_DELTA})/${L_REACH}, 4.))*${L_REACH}
                  // angle 
                  * pow(max(dot(${L_SURFACE_NORMAL}, ${V_SURFACE_ROTATION} * normalize(normalize(${L_LIGHT_DELTA})-j*${L_CAMERA_NORMAL})), 0.),.1/${L_COLOR}.a) * (j>0.?1.-${L_COLOR}.a:${L_COLOR}.a)
                  // cone
                  * max(pow(max(dot(normalize((${U_LIGHT_TRANSFORMS}[i]*vec4(1., 0., 0., 1.)-${L_LIGHT_POSITION}).xyz), normalize(${L_LIGHT_DELTA})), 0.), ${L_LIGHT}.w), pow(clamp((${L_BRIGHTNESS}-length(${L_LIGHT_DELTA}))/${L_BRIGHTNESS}, 0., 1.), 2.));
            }
          }
        }
      }
      gl_FragColor = vec4(mix(${L_COLOR}.xyz*(${L_COLOR}.a<1.?${L_LIGHTING}:vec3(1.)), ${L_TEMP_TEXTURE}.xyz, ${L_TEMP_TEXTURE}.w), 1.);
    } else if (${L_TEMP_TEXTURE}.w > .1) {
      gl_FragColor = vec4(${L_TEMP_TEXTURE}.xyz * ${L_TEMP_TEXTURE}.w, 1.);
    } else {
      discard;
    }
  }
  `;

onload = async () => {
  const canvas = Z;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const gl = shortenMethods(canvas.getContext('webgl'), 'gl');

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

  type LoadingEvent = [VolumetricDrawCommand[] | string, Matrix4, [(Vector4 | string)[], ((NumericValue<ValueRange> | CharValue)[] | string)?][], number?];

  const surfaceColors: [(Vector4 | string)[], ((NumericValue<ValueRange> | CharValue)[] | string)?][] = [COLOR_DULLMETAL, COLOR_GOLD]
      .map(wallMaterial => [COLOR_PURPLE_CARPET, COLOR_BLUE_CARPET, COLOR_DULLMETAL]
          .map(carpetMaterial => [COLOR_BLUE_SHINY, COLOR_GREEN_SHINY, COLOR_RED_SHINY, COLOR_SILVER_SHINY]
              .map<(Vector4 | string)[]>(pipeMaterial => 
                  [wallMaterial, carpetMaterial, pipeMaterial]
              ) as [(Vector4 | string)[], ((NumericValue<ValueRange> | CharValue)[] | string)?]
          )
      ).flat(1);
      // TODO randomise
  const SURFACE_COLORS: [(Vector4 | string)[], ((NumericValue<ValueRange> | CharValue)[] | string)?][] = [
    [[COLOR_SILVER_SHINY]],
    ...surfaceColors,
  ];

  // slightly scale up to hide wall-gaps
  const MODEL_SCALE = 1.01/(VOLUME_SCALE*WALL_DIMENSION);
  const MODEL_SCALE_MATRIX = matrix4Scale(MODEL_SCALE);
  
  const COMMANDS: readonly LoadingEvent[] = [
    // wall inset
    [VOLUMETRIC_WALL_INSET, MODEL_SCALE_MATRIX, SURFACE_COLORS],
    // wall pipes
    [VOLUMETRIC_WALL_PIPES, MODEL_SCALE_MATRIX, SURFACE_COLORS],
    // floor
    [VOLUMETRIC_FLOOR,  MODEL_SCALE_MATRIX, SURFACE_COLORS],
    // door
    [VOLUMETRIC_DOOR, MODEL_SCALE_MATRIX, [
      [[COLOR_BLUE_SHINY, COLOR_BLUE_GLOWING]],
      [[COLOR_GREEN_SHINY, COLOR_GREEN_GLOWING]],
      [[COLOR_YELLOW_SHUNY, COLOR_YELLOW_GLOWING]],
    ]],
    // symbols
    [VOLUMETRIC_SYMBOL, matrix4Identity(), VOLUMETRIC_PARAMS_SYMBOL],   
    // resources
    [VOLUMETRIC_RESOURCE, matrix4Identity(), VOLUMETRIC_PARAMS_RESOURCE],
    // marine
    [VOLUMETRIC_MARINE, matrix4Scale(MODEL_SCALE * .5), [
      [[COLOR_CHITIN, COLOR_RED_CARPET, COLOR_RED_GLOWING]],
      [[COLOR_GREEN_SHINY, COLOR_WHITE_SHINY, COLOR_WHITE_GLOWING]],
      [[COLOR_RED_SHINY, COLOR_WHITE_SHINY, COLOR_WHITE_GLOWING]],
      [[COLOR_YELLOW_SHUNY, COLOR_BLACK, COLOR_WHITE_GLOWING]],
      [[COLOR_BLUE_SHINY, COLOR_WHITE_SHINY, COLOR_WHITE_GLOWING]],
    ], 8], 
    // spider
    [VOLUMETRIC_SPIDER, matrix4Scale(MODEL_SCALE * .5), [
      [[COLOR_CHITIN, COLOR_RED_GLOWING, COLOR_RED_SHINY]],
    ], 8],
    // pistol
    [VOLUMETRIC_PISTOL, matrix4Scale(MODEL_SCALE * .2), VOLUMETRIC_PARAMS_PISTOL],
    // shotgun
    [VOLUMETRIC_SHOTGUN, matrix4Scale(MODEL_SCALE * .4), VOLUMETRIC_PARAMS_SHOTGUN],
    // food
    [VOLUMETRIC_FOOD, matrix4Scale(MODEL_SCALE * .2), VOLUMETRIC_PARAMS_FOOD],
    // battery
    [VOLUMETRIC_BATTERY, matrix4Scale(MODEL_SCALE * .1), VOLUMETRIC_PARAMS_BATTERY],
    // bayonet
    [VOLUMETRIC_BAYONET, matrix4Scale(MODEL_SCALE * .2), VOLUMETRIC_PARAMS_BAYONET],
    // torch
    [VOLUMETRIC_TORCH, matrix4Scale(MODEL_SCALE * .2), VOLUMETRIC_PARAMS_TORCH],
    // key
    [VOLUMETRIC_KEY, matrix4Scale(MODEL_SCALE * .2), [
      [[COLOR_BLUE_GLOWING]],
      [[COLOR_GREEN_GLOWING]],
      [[COLOR_YELLOW_GLOWING]],
    ]],
  ];

  const loadingEventQueue: EventQueue<LoadingEvent, EntityRenderables[]> = {
    handler: async (c, events) => {
      const [commands, staticTransform, variations, entityZPadding] = c;
      P.style.width = `${(COMMANDS.length-events.length)/COMMANDS.length*99 | 0}%`
      // allow rendering of progress
      await delay();

      return variations.map(([renderColors, params], i) => {
        let volumeAndCanvas: {
          volum: Volume<Voxel>,
        };
        const entityType = ENTITY_NAMES.length - events.length - 1;
        if (FLAG_USE_VOLUME_COMMANDS) {
          const name = ENTITY_NAMES[entityType];
          const volumeTemplate = convertVolumetricDrawCommands(commands as any as VolumetricDrawCommand[]);
          console.log(`volume for ${name}`, `"${volumeTemplate}"`);
          const paramsString = (params as (NumericValue<ValueRange> | CharValue)[] || []).map(numericOrCharValueToBase64).join('');
          console.log('params', i, `"${paramsString}"`);
          volumeAndCanvas = processVolumetricDrawCommandString(volumeTemplate, paramsString);
        } else {
          volumeAndCanvas = processVolumetricDrawCommandString(commands as string, params as string);
        }
        const { volum: volume } = volumeAndCanvas;

        const bounds = calculateVolumeBounds(volume);
        // add on some depth to the bounds so we have somewhere to display status information
        bounds[1][2] += (entityZPadding || 0) * VOLUME_SCALE;
        // make have equal width on all sides so status display not truncated
        if (FLAG_SQUARE_SIDES && entityZPadding) {
          // only things with statuses need to be square
          const minXOrY = Mathmin(bounds[0][0], bounds[0][1]);
          const maxXOrY = Mathmax(bounds[1][0], bounds[1][1]);
          bounds[0][0] = bounds[0][1] = minXOrY;
          bounds[1][0] = bounds[1][1] = maxXOrY;  
        }
        
        // render/depth bounds should be the same
        const [depthTextureData, depthTextureBounds] = volumeToDepthTexture(volume, bounds);
        const [renderTextureData] = volumeToRenderTexture(volume, bounds, renderColors);

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

        // status canvas and texture
        const statusCanvas = document.createElement('canvas');
        statusCanvas.width = TEXTURE_DIMENSION;
        statusCanvas.height = TEXTURE_DIMENSION;
        
        const statusTexture = gl.createTexture();
        gl.bindTexture(CONST_GL_TEXTURE_2D, statusTexture);
        gl.texImage2D(
            CONST_GL_TEXTURE_2D,
            0,
            CONST_GL_RGBA,
            CONST_GL_RGBA,
            CONST_GL_UNSIGNED_BYTE,
            statusCanvas,
        );
        gl.generateMipmap(CONST_GL_TEXTURE_2D);

        // thumbnail
        const thumbnailCanvas = document.createElement('canvas');
        // because the model faces down the x axis, the image is laying on its side
        const w = bounds[1][1] - bounds[0][1]+1;
        const h = bounds[1][2] - bounds[0][2]+1;
        thumbnailCanvas.width = w;
        thumbnailCanvas.height = h;

        const stx = shortenMethods(thumbnailCanvas.getContext('2d'), 'stx');
        const imageData = stx.createImageData(w, h);
        for (let x=0; x<w; x++) {
          for (let y=0; y<h; y++) {
            const sx = w - x - 1;
            const sy = y;
            const sourceOffset = sy*TEXTURE_DIMENSION*4 + sx*4;
            const c = renderTextureData.slice(sourceOffset, sourceOffset+4);
            const a = c[3];
            const n = a == 255 || !renderColors?.length
                ? 1
                : 1 - (depthTextureData[sourceOffset] + depthTextureData[sourceOffset+1])/510;
            imageData.data.set(c.map((c, i) => (i+1)%4 ? c * n : c ? 255 : 0), y*w*4+x*4);
          }
        }
        stx.putImageData(imageData, 0, 0);

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
          const [minx, miny] = extents1.map((v, i) => Mathmin(v, extents2[i])) as Vector3;
          const [maxx, maxy, maxz] = extents1.map((v, i) => Mathmax(v, extents2[i])) as Vector3;

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
          statusCanvas,
          statusTexture,
          bounds,
          vertexPositionBuffer,
          vertexIndexBuffer,
          surfaceRotationsBuffer,
          textureBoundsBuffer,
          textureCoordinatesBuffer,
          staticTransform,
        };
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
  gl.clearColor(0, 0, 0, 1);
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
      matrix4Rotate(-CONST_PI_ON_2_1DP, 1, 0, 0),
      matrix4Rotate(CONST_PI_ON_2_2DP, 0, 0, 1),
      matrix4Rotate(-CONST_PI_ON_6_1DP, 0, 1, 0),
  );

  const entityRenderables = await addEvents(loadingEventQueue, ...COMMANDS);
  // add in poison
  entityRenderables[ENTITY_TYPE_RESOURCE][ACTOR_ENTITY_RESOURCE_TYPE_POISON*2]=entityRenderables[ENTITY_TYPE_SYMBOL][ATTACK_POISON];
  
  X.innerHTML = new Array(4).fill(X.innerHTML).join('');
  P.hidden = true;

  const equipmentSlots: Element[] = new Array(X.children.length).fill(0).map((_, i) => X.children.item(i));
  const gameEventQueueHandler = async (e: GameEvent) => {
    const party = e.party;
    let turnPassed: Booleanish;

    if (e.eventType != GAME_EVENT_TYPE_CONFIRM_ATTACK) {
      // clear all outstanding attacks
      iterateLevelMembers(game.level, m => {
        m.attackAnimations = [];
      });
    }

    if (
        (party.partyType == PARTY_TYPE_HOSTILE || party.partyType == PARTY_TYPE_PLAYER)
        &&
        (e.eventType == GAME_EVENT_TYPE_CHANGE_LOADOUT || e.eventType == GAME_EVENT_TYPE_TURN || e.eventType == GAME_EVENT_TYPE_PROPOSE_ATTACK)
    ) {
      party.members.forEach((partyMember, i) => {
        if (partyMember && !(e.eventType == GAME_EVENT_TYPE_CHANGE_LOADOUT && e.entity == partyMember.entity || e.eventType == GAME_EVENT_TYPE_PROPOSE_ATTACK && i == e.slot)) {
          // everyone not acting should gain 1 power 
          partyMember.attackAnimations = [{
            attackType: ATTACK_POWER_GAIN,
            ['s']: 0,
          }];
        }
      });
    }


    switch (e.eventType) {
      case GAME_EVENT_TYPE_MOVE:
        {
          // assumes only the player ever moves
          const { unrotatedDeltaPosition } = e;
          const a = party.orientated * CONST_PI_ON_2_1DP;

          const deltaPosition = vector2Rotate(a, unrotatedDeltaPosition.slice(0, 2) as Vector2).concat(unrotatedDeltaPosition[2]);
          const from = party.tile;
          const to = from.map((v, i) => Mathround(v + deltaPosition[i])) as Vector2;
          const toTile = game.level[to[1]]?.[to[0]] as Tile;
          if (!toTile || toTile.parties.some(p => p.partyType == PARTY_TYPE_DOOR || p.partyType == PARTY_TYPE_OBSTACLE || p.partyType == PARTY_TYPE_HOSTILE)) {
            // just animate the camera in and out
            const toCameraPosition = [...from.map((v, i) => v + deltaPosition[i]/6), 0] as Vector3;
            const toAnimationFactory = createTweenAnimationFactory(party, party, 'cpos', toCameraPosition, easeInQuad, 99);
            const returnAnimationFactory = createTweenAnimationFactory(party, party, 'cpos', party['cpos'], easeOutQuad, 99);
            await addEvents(party.animationQueue, toAnimationFactory, returnAnimationFactory); 
          } else {
            const fromTile = game.level[from[1]][from[0]] as Tile;
            fromTile.parties.splice(fromTile.parties.indexOf(party), 1);
            toTile.parties.push(party);
            turnPassed = party.tile = to;
            let cameraMovePromise: Promise<any>;
            // move the camera too
            const toCameraPosition = [...to, 0] as Vector3;
            const animationFactory = createTweenAnimationFactory(party, party, 'cpos', toCameraPosition, easeInQuad, 299);
            cameraMovePromise = addEvents(party.animationQueue, animationFactory); 
            // animate and update resources
            await Promise.all(party.members.map(async (partyMember, i) => {
              if (partyMember) {
                const actor = partyMember.entity as ActorEntity;
                // retain some power if we have the battery
                actor.res[ACTOR_ENTITY_RESOURCE_TYPE_POWER].quantity = Mathmin(
                    actor.res[ACTOR_ENTITY_RESOURCE_TYPE_POWER].quantity,
                    partyMember.secondary && partyMember.secondary.entityType == ENTITY_TYPE_BATTERY ? 1: 0,
                );
                // clear poison status
                actor.res[ACTOR_ENTITY_RESOURCE_TYPE_POISON].quantity = 0;
                return await moveNaturallyToSlotPosition(party, partyMember, i);
              }
            }).concat(cameraMovePromise));  
            // did we move to the next level?
            if (to[1] >= LEVEL_DIMENSION + LEVEL_SPACING - 1 && to[0] == (LEVEL_DIMENSION/2 | 0)) {
              goToNextLevel();
            }
          }
        }
        break;
      case GAME_EVENT_TYPE_TURN:
        {
          const { deltaOrientation } = e;
          const toOrientation = (party.orientated + deltaOrientation + 4)%4;
          party.orientated = toOrientation as Orientation;
          let cameraRotationPromise: Promise<any>;        
          turnPassed = 1;
          // note: probably will produce a bunch of NaNs for non-player turning, but no big deal I guess
          const cameraAnimationFactory = createTweenAnimationFactory(party, party, 'czr', party['czr'] + deltaOrientation * CONST_PI_ON_2_2DP, easeInQuad, 299);
          cameraRotationPromise = addEvents(party.animationQueue, cameraAnimationFactory);

          await Promise.all(party.members.map(async (member, i) => {
            return member && moveNaturallyToSlotPosition(party, member, i);
          }).concat(cameraRotationPromise));
        }
        break;
      case GAME_EVENT_TYPE_CHANGE_LOADOUT:
        {
          const toSlot = e.to.party.members[e.to.slot];
          const fromSlot = party.members[e.slot] as PartyMember;
          let reciprocalMoveEntity: Entity | Falseish = 0;
          let moveMember: PartyMember | Falseish = 0;
          let reciprocalMoveMember: PartyMember | Falseish = 0;
          let itemDestroyed: Booleanish = 0;
          let fromSlotPromise: Promise<any>;
          let toSlotPromise: Promise<any>;
          const purpose = e.entity.purpose;
          
          if (toSlot) {
            const toSlotPurpose = toSlot.entity.purpose;
            switch (purpose) {
              case ENTITY_PURPOSE_ACTOR:
                reciprocalMoveMember = toSlot;
                turnPassed = e.to.party.members[e.to.slot] = fromSlot;
                break;
              case ENTITY_PURPOSE_WEAPON:
                if (toSlotPurpose == ENTITY_PURPOSE_ACTOR) {
                  reciprocalMoveEntity = toSlot.weapon;
                  turnPassed = toSlot.weapon = e.entity as WeaponEntity;
                }
                break;
              case ENTITY_PURPOSE_SECONDARY:
                if (toSlotPurpose == ENTITY_PURPOSE_ACTOR) {
                  const actor = toSlot.entity as ActorEntity;
                  const food = e.entity as SecondaryEntity;
                  if (e.entity.entityType == ENTITY_TYPE_FOOD && (actor.res[ACTOR_ENTITY_RESOURCE_TYPE_HEALTH].quantity < actor.res[ACTOR_ENTITY_RESOURCE_TYPE_HEALTH].max || food.variation)) {
                    if (food.variation) {
                      // increase max energy/health and set to maximum
                      actor.res[food.variation-1].quantity = (actor.res[food.variation-1].max++) + 1;
                    } else {
                      actor.res[ACTOR_ENTITY_RESOURCE_TYPE_HEALTH].quantity++;
                    }
                    turnPassed = itemDestroyed = 1;
                  } else {
                    reciprocalMoveEntity = toSlot.secondary;
                    turnPassed = toSlot.secondary = e.entity;
                  }
                } else if (toSlotPurpose == ENTITY_PURPOSE_DOOR && (e.entity as SecondaryEntity).variation == (toSlot.entity as SecondaryEntity).variation) {
                  const [x, y, z] = toSlot['pos'];
                  // destroy the key
                  turnPassed = itemDestroyed = 1;
                  fromSlotPromise = addEvents(toSlot.animationQueue, createTweenAnimationFactory(toSlot, toSlot, 'pos', [x, y, z+1], easeInQuad, 399)).then(() => {
                    // remove the door entirely
                    e.to.party.members[e.to.slot] = 0;
                    e.to.party.partyType = PARTY_TYPE_FLOOR;
                  });
                }
                break;
              }
          } else {
            if (e.to.party.partyType == PARTY_TYPE_ITEM || purpose == ENTITY_PURPOSE_ACTOR) {
              turnPassed = moveMember = e.to.party.members[e.to.slot] = fromSlot.entity == e.entity
                  ? fromSlot
                  : {
                    ...BASE_PARTY_MEMBER,
                    animationQueue: createAnimationEventQueue(game),
                    entity: e.entity,
                    ['pos']: fromSlot['pos'],
                    ['zr']: party.orientated * CONST_PI_ON_2_2DP,
                  };  
            }
          }

          if (turnPassed) {
            if (itemDestroyed) {
              if (fromSlot.entity == e.entity) {
                e.party.members[e.slot] = 0;
              } else {
                fromSlot.secondary = 0;
                // TODO: do we ever destroy a weapon?
              }
            } else {
              if (fromSlot.entity == e.entity) {
                if (reciprocalMoveEntity) {
                  fromSlot.entity = reciprocalMoveEntity;
                } else {
                  party.members[e.slot] = reciprocalMoveMember;
                }
              } else if (fromSlot.weapon == e.entity){
                fromSlot.weapon = reciprocalMoveEntity as WeaponEntity;
              } else if (fromSlot.secondary == e.entity) {
                fromSlot.secondary = reciprocalMoveEntity;
              }
  
              if (reciprocalMoveMember) {
                toSlotPromise = moveNaturallyToSlotPosition(party, reciprocalMoveMember, e.slot);
              }
              if (moveMember) {
                fromSlotPromise = moveNaturallyToSlotPosition(e.to.party, moveMember, e.to.slot);
              }
            }

            await Promise.all([toSlotPromise, fromSlotPromise]);  
          }
        }
        break;
      case GAME_EVENT_TYPE_PROPOSE_ATTACK:
        {
          const { slot } = e;

          const lookingAtX = party.tile[0] + CARDINAL_XY_DELTAS[party.orientated][0];
          const lookingAtY = party.tile[1] + CARDINAL_XY_DELTAS[party.orientated][1];
          const victimParty = (game.level[lookingAtY][lookingAtX] as Tile).parties.find(p => p.partyType == PARTY_TYPE_HOSTILE || p.partyType == PARTY_TYPE_PLAYER);
          if (victimParty && victimParty.members.some(m => m)) {
            // find attacker
            const attacker = party.members[slot] as PartyMember;
            const attackerEntity = attacker.entity as ActorEntity;
            game.pendingMember = attacker;
            const allAttacks = attacker.weapon && attacker.weapon.attacks || attackerEntity.attacks;
            
            // find best attack
            const power = attackerEntity.res[ACTOR_ENTITY_RESOURCE_TYPE_POWER].quantity;
            const attackerRow = (slot / 2) | 0;
            const attackerColumn = slot % 2;
            const allSlotIds: [[number, number, number, number], [number, number, number, number]] = [
              [0, 1, 2, 3],
              [1, 0 ,3, 2],
            ];
            const slotIds = allSlotIds[attackerColumn];

            // find the best attack for the power level and position (higher is better)
            const attackIndex = allAttacks.slice(0, power+1).reduce<number>(
                (a, v, i) => {
                  if (v && v[attackerRow]) {
                    return i;
                  }
                  return a;
                },
                0,
            );

            const attacks: Attack[][] = [...allAttacks[attackIndex][attackerRow]];
            // drain power from self equal to attackIndex
            attacks[slotIds[slot]] = (attacks[slotIds[slot]] || []).concat(new Array(attackIndex).fill(ATTACK_POWER_DRAIN));
            
            // add in stabbing attack if we have the bayonet and are in the front row
            if (!attackerRow && attacker.secondary && attacker.secondary.entityType == ENTITY_TYPE_BAYONET) {
              attacks[4] = (attacks[4]||[]).concat(ATTACK_PIERCING);
            }
            if (FLAG_MARINE_DIMORPHISM && attacker.entity.entityType == ENTITY_TYPE_MARINE
                  && (!attackerRow && (attacker.entity as ActorEntity).variation == MARINE_VARIATION_YELLOW
                      || attackerRow && (attacker.entity as ActorEntity).variation == MARINE_VARIATION_RED
                  )
                  && !attacks[attackerRow * 2].some(attack => attack == ATTACK_MOVE_MEDIAL)
            ) {
              attacks[attackerRow * 2] = (attacks[attackerRow*2] || []).concat(ATTACK_MOVE_MEDIAL);
            }
            
            // add attacks
            attacks.forEach((targetAttacks, position) => {
              const targetsVictim = position / 4 | 0
              const targetParty = targetsVictim
                  ? victimParty
                  : party;
              const targetSlotIds = allSlotIds[(attackerColumn + targetsVictim) % 2];              
              const targetPartyIndex = position % 4;
              const targetSlotId = targetSlotIds[targetPartyIndex]
              const targetColumn = targetSlotId % 2;
              const targetRow = targetSlotId/2 | 0;
              let rowMask = 0;
              let colMask = 0;

              targetParty.members.forEach((m, i) => {
                if(m) {
                  const row = i / 2 | 0;
                  const column = i % 2;
                  rowMask |= 1 << row;
                  colMask |= 1 << column;
                }
              });
              
              // TODO party rotation
              const filledTargetPartyIndex = targetSlotIds.reduce(
                  (bestIndex, slotId, index) => {
                    const row = slotId / 2 | 0;
                    const column = slotId % 2;
                    const dRow = row - targetRow;
                    const dColumn = column - targetColumn;
                    return targetParty.members[slotId]
                      && dRow >= 0
                      // is the target
                      && (
                          !targetsVictim ||
                          // has enemies in both columns, or our attack is the first column attack
                          (colMask == 3 || !(targetPartyIndex % 2))
                              // and
                              // has enemies in both rows, or our attack is the first row attack
                              && (rowMask == 3 || targetPartyIndex < 2)
                      )
                      && (bestIndex < 0
                          // it's closer
                          || Mathabs(dColumn) * 2 + dRow < Mathabs((targetSlotIds[bestIndex]%2) - targetColumn) * 2 + ((targetSlotIds[bestIndex]/2 | 0) - targetRow)
                      )
                          ? index
                          : bestIndex
                  },
                  -1,
              );
              if (filledTargetPartyIndex >= 0) {
                const targetPartySlot = targetSlotIds[filledTargetPartyIndex];
                const targetPartyMember = targetParty.members[targetPartySlot] as PartyMember;
                if (!targetPartyMember.activeAttackStartTime) {
                  targetPartyMember.activeAttackStartTime = game.timeMillis;
                }
                const attackAnimations = (targetAttacks || []).map((attack) => {
                  return {
                    attackType: attack,
                    ['s']: 0,
                  };
                });
                targetPartyMember.attackAnimations.push(...attackAnimations);  
              }
            });
            // for all the parties involved, animate the attack animations
            const attackAnimationPromises: Promise<any>[] = [];
            iterateLevelMembers(game.level, (partyMember) => {
              const attackAnimations = partyMember.attackAnimations;
              partyMember.attackAnimations?.forEach((attackAnimation, i) => {
                const a = Mathrandom() * CONST_PI_0DP;
                const r = i * .5/attackAnimations.length;
                attackAnimation.x = .5 + Mathcos(a) * r;
                attackAnimation.y = .5 + Mathsin(a) * r;
                addEvents(
                  partyMember.animationQueue,
                  createTweenAnimationFactory(
                      partyMember,
                      attackAnimation, 
                      's',
                      1 + 1 - i/attackAnimations.length,
                      easeOutBack,
                      CONST_ATTACK_DURATION,
                  ),
                )
              });
            })
            await Promise.all(attackAnimationPromises);
          }
        }
        break;
      case GAME_EVENT_TYPE_CONFIRM_ATTACK:
        {
          const { slot } = e;
          turnPassed = 1;
          const attacker = party.members[slot] as PartyMember;
          const originalPosition = attacker['pos'];
          FLAG_ATTACK_ANIMATION && await addEvents(
              attacker.animationQueue,
              createParallelAnimationFactory(
                  createTweenAnimationFactory(attacker, attacker, 'yr', -CONST_PI_ON_4_1DP, easeOutQuad, 199, 0),
                  createTweenAnimationFactory(attacker, attacker, 'pos', [originalPosition[0], originalPosition[1], originalPosition[2] + .3], easeOutQuad, 199),
              ),
              createParallelAnimationFactory(
                  createTweenAnimationFactory(attacker, attacker, 'yr', CONST_PI_ON_6_1DP, easeInQuad, 199),
                  createTweenAnimationFactory(attacker, attacker, 'pos', originalPosition, easeInQuad, 199),
              ),
              createTweenAnimationFactory(attacker, attacker, 'yr', 0, easeOutQuad, 99),
          );
        }
        break;
      case GAME_EVENT_TYPE_WAIT:
        turnPassed = 1;
        break;
    }
    if (turnPassed) {
      const promises: Promise<any>[] = [];
      iterateLevelMembers(game.level, (partyMember, party, slot) => {
        if(partyMember.attackAnimations?.length) {
          const [resources, toSlot] = applyAttacks(party, slot);
          
          const actor = partyMember.entity as ActorEntity;
          const damaged = actor.res[ACTOR_ENTITY_RESOURCE_TYPE_HEALTH].quantity > resources[ACTOR_ENTITY_RESOURCE_TYPE_HEALTH].quantity;
          const dead = resources[ACTOR_ENTITY_RESOURCE_TYPE_HEALTH].quantity <= 0;
          let promise: Promise<any> = Promise.all(partyMember.attackAnimations.map(attackAnimation => addEvents(
              partyMember.animationQueue,
              createTweenAnimationFactory(
                  partyMember,
                  attackAnimation,
                  's',
                  0,
                  easeInQuad,
                  CONST_ATTACK_DURATION,
              ),
          ))).then(async () => {
            if (damaged) {
              FLAG_DAMAGE_ANIMATION && await addEvents(
                  partyMember.animationQueue,
                  createTweenAnimationFactory(
                      partyMember,
                      partyMember,
                      'yr',
                      -CONST_PI_ON_5_1DP,
                      easeInOutExp4BackToStart,
                      299,
                      0,
                  ),
              );
              FLAG_SCREEN_SHAKE && party == playerParty && !playerParty.anims.length && await addEvents(
                  playerParty.animationQueue,
                  ...new Array(4).fill(0).map(() => 
                      createTweenAnimationFactory(
                          playerParty,
                          playerParty,
                          'cpos',
                          playerParty['cpos'].map(v => v + (Mathrandom()-.5)*partyMember.attackAnimations.length/9) as Vector3,
                          easeInOutExp4BackToStart,
                          99,
                      )
                  ),
              );
            }
            // clear attacks and move
            partyMember.activeAttackStartTime = 0;
            partyMember.attackAnimations = [];
            actor.res = resources;
            if (toSlot != slot) {
              const replacedPartyMember = party.members[toSlot];
              party.members[slot] = replacedPartyMember;
              party.members[toSlot] = partyMember;  
              await Promise.all([
                moveNaturallyToSlotPosition(party, partyMember, toSlot),
                replacedPartyMember && moveNaturallyToSlotPosition(party, replacedPartyMember, slot),
              ]);
            }
            // is it dead?
            if (dead) {
              FLAG_DEATH_ANIMATION && await addEvents(
                partyMember.animationQueue,
                createParallelAnimationFactory(
                    createTweenAnimationFactory(
                        partyMember,
                        partyMember,
                        'sds',
                        0,
                        easeInQuad,
                        99,
                    ),
                    createTweenAnimationFactory(
                        partyMember,
                        partyMember,
                        'zs',
                        0,
                        easeInQuad,
                        CONST_DEATH_DURATION,
                    ),
                    createTweenAnimationFactory(
                        partyMember,
                        partyMember,
                        'zr',
                        partyMember['zr'] + 9,
                        easeOutQuad,
                        CONST_DEATH_DURATION,
                    ),
                )
              );
              party.members[toSlot] = 0;
              // add in any items they were carrying
              const tile  = game.level[party.tile[1]][party.tile[0]] as Tile;
              let items: Party = tile.parties.find(p => p.partyType == PARTY_TYPE_ITEM);
              if (!items) {
                items = {
                  animationQueue: createAnimationEventQueue(game),
                  anims: [],
                  members: [],
                  partyType: PARTY_TYPE_ITEM,
                  tile: party.tile,
                  orientated: 0,
                };
                tile.parties.push(items);  
              }
              items.members.push(...[partyMember.secondary, partyMember.weapon]
                  .filter(v => !!v)
                  .map<PartyMember>((item: Entity) => ({
                    ...BASE_PARTY_MEMBER,
                    animationQueue: createAnimationEventQueue(game),
                    anims: [],
                    entity: item,
                    ['pos']: partyMember['pos'],
                  }))
              );
              // is the entire party dead?
              if (party.members.every(m => !m)) {
                tile.parties = tile.parties.filter(p => p != party);
              }
            } else if (party.partyType == PARTY_TYPE_HOSTILE){
              await delay(499);
            }
          });
          promises.push(promise);
        }
      });
      await Promise.all(promises);
      game.pendingMember = 0;

      if (party == playerParty) {
        // AI moves after player
        // volume map is not promise-friendly
        const otherParties: Party[] = [];
        iterateLevelParties(game.level, party => {
          if (party.partyType == PARTY_TYPE_HOSTILE || party.partyType == PARTY_TYPE_ITEM) {
            otherParties.push(party);
          }
        });
  
        for (let party of otherParties) {
          let moved: Booleanish;
          let orientation = getFavorableOrientation(party, game.level);
          let deltaOrientation = orientation - party.orientated;
          if (deltaOrientation) {
            switch (Mathabs(deltaOrientation)) {
              case 2: 
                deltaOrientation = 1;
                break;
              case 3:
                deltaOrientation = -deltaOrientation/3 | 0;
                break;
            }
            await gameEventQueueHandler({
              eventType: GAME_EVENT_TYPE_TURN,
              deltaOrientation,
              party,
            });
            moved = 1;
          }
          // check whether we should display the status graphic
          await Promise.all(party.members.map(async m => {
            if (m) {
              if (isLookingAt(playerParty, party)) {
                if (!m['sds']) {
                  await addEvents(m.animationQueue, createTweenAnimationFactory(m, m, 'sds', 1, easeInQuad, 99, 0));
                }
              } else if (m['sds']) {
                await addEvents(party.animationQueue, createTweenAnimationFactory(m, m, 'sds', 0, easeInQuad, 99));
              }  
            }
          }));
  
          if (!moved && isLookingAt(party, playerParty) && party.partyType == PARTY_TYPE_HOSTILE) {
            const validSlots = party.members.map((m, i) => m ? [i] : []).flat();
            if (validSlots.length) {
              const slot = validSlots[Mathrandom() * validSlots.length | 0];
              await gameEventQueueHandler({
                eventType: GAME_EVENT_TYPE_PROPOSE_ATTACK,
                party,
                slot,
              });
              await delay(699);
              await gameEventQueueHandler({
                eventType: GAME_EVENT_TYPE_CONFIRM_ATTACK,
                party,
                slot,
              });
              moved = 1;
            }
          }
          if (!moved) {
            // do nothing
            await gameEventQueueHandler({
              eventType: GAME_EVENT_TYPE_WAIT,
              party,
            });
          }
        }
      }
    }

  };
  const gameEventQueue: EventQueue<GameEvent, void> = {
    handler: gameEventQueueHandler,
  };

  const game: Game = {
    timeMillis: 0,
  };
  let depth = 0;
  const DEFAULT_PARTY_POSITION: Vector2 = [LEVEL_DIMENSION/2 | 0, 0];
  const playerParty: Party = {
    members: new Array(4).fill(0),
    orientated: ORIENTATION_NORTH,
    partyType: PARTY_TYPE_PLAYER,
    tile: DEFAULT_PARTY_POSITION,
    ['coff']: [.35, 0, -.7],
    ['czr']: CONST_PI_ON_2_2DP,
    anims: [],
    animationQueue: createAnimationEventQueue(game),
  };
  playerParty.members[0] = {
    ...BASE_PARTY_MEMBER,
    ['zr']: CONST_PI_ON_2_1DP,
    animationQueue: createAnimationEventQueue(game),
    entity: createMarine(entityRenderables[ENTITY_TYPE_MARINE], 1),
    weapon: createPistol(entityRenderables[ENTITY_TYPE_PISTOL], ATTACK_PIERCING),
    secondary: {
      entityType: ENTITY_TYPE_TORCH,
      purpose: ENTITY_PURPOSE_SECONDARY,
      renderables: entityRenderables[ENTITY_TYPE_TORCH][0],
      variation: 0,
    }
  };

  const goToNextLevel = () => {
    depth++;
    game.level = generateLevel(game, entityRenderables, depth);
    (game.level[DEFAULT_PARTY_POSITION[1]][DEFAULT_PARTY_POSITION[0]] as Tile).parties.push(playerParty);
    playerParty.tile = [...DEFAULT_PARTY_POSITION];
    playerParty['cpos'] = [...DEFAULT_PARTY_POSITION, 0];
    playerParty.members.forEach((m, i) => {
      if (m) {
        const [position] = getTargetPositionAndRotations(playerParty, i);
        m['pos'] = position as Vector3;
      }
    });
  };
  goToNextLevel();
  
  let slotsToEntities: Map<EventTarget, Entity> | undefined;

  let lastDragEnded: number | undefined;
  let dragContext: {
    entity?: Entity,
    fromLocation?: EntityLocation,
    dragImage?: HTMLElement,
    currTarget?: EventTarget,
    dragStartTime: number,
    startPosition: {
      clientX: number,
      clientY: number,
    },
    lastPosition?: {
      clientX: number,
      clientY: number,
    }
  } | Falseish;

  const getLocationAndMaybeEntity = (target: EventTarget, p: { clientX: number, clientY: number }): [EntityLocation, Entity?] | undefined => {
    const entity = slotsToEntities?.get(target);
    const equipmentIndex = equipmentSlots.findIndex(v => v == target || v == (target as HTMLElement)?.parentElement);
    const targetsWorld = target == Z;
    if (equipmentIndex >= 0) {
      return [{
        party: playerParty,
        slot: equipmentIndex,
      }, entity];
    }
    if (targetsWorld) {
      // attempt to find the entity in the world
      const projectionMatrix = matrix4Multiply(
          perspectiveMatrix,
          matrix4Translate(...playerParty['coff']),
          matrix4Rotate(-playerParty['czr'], 0, 0, 1),
          // NOTE: the shader usually does this for us
          matrix4Translate(...vectorNDivide(playerParty['cpos'], -1)),
      );
      let minParty: Party | undefined;
      let minSlot: number | undefined;
      let minEntity: Entity | undefined;
      let minDistance: number = 9;
      const sx = p.clientX*2/Z.clientWidth - 1;
      // flip y coordinates so screen coordinates = world coordinates
      const sy = 1 - p.clientY*2/Z.clientHeight;
      iterateLevelMembers(game.level, (partyMember, party, slot) => {
        if ((party.partyType == PARTY_TYPE_ITEM || party.partyType == PARTY_TYPE_HOSTILE || party.partyType == PARTY_TYPE_DOOR)
            && (isLookingAt(playerParty, party) || playerParty.tile[0] == party.tile[0] && playerParty.tile[1] == party.tile[1])
        ) {
          const { 
            staticTransform,
            bounds,
          } = partyMember.entity.renderables;
          const [min, max] = bounds;
          // note: because the screen coordinates are -1 to 1 we don't divide by 2 since the diameter will be the radius
          // for us in screen coordinates
          const midpoints = vector3TransformMatrix4(staticTransform, ...max.map((v, i) => v - min[i]) as Vector3);
          const midz = midpoints[2];
          
          const position = partyMember['pos'];
          const averageExtent = midpoints.reduce((a, v) => a + v/3, 0);
          const v = vector4TransformMatrix4(projectionMatrix, position[0], position[1], position[2]+midz/2);
          const [px, py, pz, pw] = v;
          // 1.05 because dropped items center points sit beneath the screen
          if (Mathabs(px) < 1 && Mathabs(py) < 1.05 && pz/pw > 0 && pw < minDistance) {
            const r = averageExtent/pw;
            if (vectorNLength(vectorNSubtract([sx, sy], v)) < r) {
              minParty = party;
              minSlot = slot;
              minEntity = partyMember.entity;
              minDistance = pw;
            }
          }
        }
      });
      if (minParty) {
        return [{
          party: minParty,
          slot: minSlot,
        }, minEntity];  
      } else {
        // return some reference to an empty slot in the current tile
        const currentPosition = playerParty.tile;
        const tile = game.level[currentPosition[1]][currentPosition[0]] as Tile;
        let items = tile.parties.find(p => p.partyType == PARTY_TYPE_ITEM);
        if (!items) {
          items = {
            anims: [],
            members: [],
            orientated: ORIENTATION_EAST,
            animationQueue: createAnimationEventQueue(game),
            tile: currentPosition,
            partyType: PARTY_TYPE_ITEM,
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
    if (!dragContext && (!lastDragEnded || lastDragEnded < game.timeMillis - 99)) {
      const locationAndEntity = getLocationAndMaybeEntity(target, p);
      let fromLocation: EntityLocation;
      let entity: Entity;
      let dragImage: HTMLElement;
      if (locationAndEntity && locationAndEntity[1] && locationAndEntity[0].party.partyType != PARTY_TYPE_DOOR) {
        [fromLocation, entity] = locationAndEntity;
        if (locationAndEntity[0].party.partyType != PARTY_TYPE_HOSTILE) {
          dragImage = entity.renderables.thumbnail;
        }
      }
      dragContext = {
        dragStartTime: game.timeMillis,
        startPosition: p,
        fromLocation,
        entity,
        dragImage,
      };
      onDrag(p);  
    }
};
  onmousedown = (e: MouseEvent) => {
    onStartDrag(e.target, e);
  };
  if (FLAG_MOBILE_SUPPORT) {
    ontouchstart = (e: TouchEvent) => {
      onStartDrag(e.target, e.targetTouches[0]);
    }  
  }


  const onDrag = (p: { clientX: number, clientY: number }, moved?: Booleanish) => {
    const target = document.elementFromPoint(p.clientX, p.clientY);
    if (dragContext) {
      dragContext.currTarget = target;
      dragContext.lastPosition = p;
      const dragImage = dragContext.dragImage;
      if (dragImage) {
        if (dragContext.lastPosition != dragContext.startPosition) {
          O.appendChild(dragImage);
        }
        dragImage.style.left = p.clientX - dragImage.clientWidth/2 as any;
        dragImage.style.top = p.clientY - dragImage.clientHeight/2 as any;
      }
    }
    return target;
  };
  onmousemove = (e: MouseEvent) => {
    onDrag(e, 1);
  }
  if (FLAG_MOBILE_SUPPORT) {
    ontouchmove = (e: TouchEvent) => {
      onDrag(e.targetTouches[0], 1);
    }  
  }

  const onDragEnd = (p: { clientX: number, clientY: number }) => {
    const target = onDrag(p);
    const location = getLocationAndMaybeEntity(target, p);
    if (dragContext && location) {
      const { dragStartTime: startTime, startPosition, lastPosition, fromLocation, entity, dragImage } = dragContext;
      const dx = lastPosition.clientX - startPosition.clientX;
      const dy = lastPosition.clientY - startPosition.clientY;
      const l = Mathsqrt(dx*dx+dy*dy);

      const [toLocation] = location;
      if (l > 9) {
        if (entity && dragImage) {
          if (fromLocation.party != toLocation.party || fromLocation.slot != toLocation.slot || entity.entityType == ENTITY_TYPE_FOOD) {
            addEvents(gameEventQueue, {
              ...fromLocation,
              eventType: GAME_EVENT_TYPE_CHANGE_LOADOUT,
              entity,
              to: toLocation,
            });  
          }    
        } else if (game.timeMillis - startTime < CONST_DRAG_DURATION){
          if (l > Z.clientWidth/6) {
            // reversed coordinates
            const a = Mathatan2(-dy, dx) + CONST_PI_1DP * 2;
            const dir = ((a + CONST_PI_ON_4_1DP)*2/CONST_PI_1DP | 0)%4;
            switch (dir) {
              case 0: // right
              case 2: // left
                addEvents(gameEventQueue, {
                  eventType: GAME_EVENT_TYPE_TURN,
                  party: playerParty,
                  deltaOrientation: -(dir-1),
                });
                break;
              case 1: // forward
              case 3: // back
                addEvents(gameEventQueue, {
                  eventType: GAME_EVENT_TYPE_MOVE,
                  party: playerParty,
                  unrotatedDeltaPosition: [dir-2, 0, 0],
                });
            }
          }
        }
      } else if (game.timeMillis - startTime < CONST_CLICK_DURATION && fromLocation) {
        const attacker = fromLocation.party.members[fromLocation.slot]
        if (game.pendingMember == attacker && fromLocation.party == playerParty) {
          addEvents(gameEventQueue, {
            ...fromLocation,
            eventType: GAME_EVENT_TYPE_CONFIRM_ATTACK,
          });  
        } else if (attacker && attacker.entity.purpose == ENTITY_PURPOSE_ACTOR) {
          addEvents(gameEventQueue, {
            ...fromLocation,
            eventType: GAME_EVENT_TYPE_PROPOSE_ATTACK,
          });  
        }
      }
    }
    cleanUpDrag();
  }
  onmouseup = (e: MouseEvent) => {
    if (dragContext) {
      onDragEnd(e);
    }
  }
  if (FLAG_MOBILE_SUPPORT) {
    ontouchend = (e: TouchEvent) => {
      onDragEnd(e.targetTouches[0] || dragContext && dragContext.lastPosition);
    }  
  }

  const cleanUpDrag = () => {
    if (dragContext) {
      if (dragContext.startPosition != dragContext.lastPosition && dragContext.dragImage) {
        O.removeChild(dragContext.dragImage);
      }
      lastDragEnded = game.timeMillis;  
      dragContext = 0;
    }
  }

  if (!FLAG_IGNORE_DRAG_CANCEL) {
    if (FLAG_MOBILE_SUPPORT) {
      ontouchcancel = cleanUpDrag;
    }
    onmouseleave = cleanUpDrag;  
  }

  const renderEntityToContext = (entity: Entity, stx: CanvasRenderingContext2D, width: number, height: number, party?: Party, slot?: number) => {
    // render status
    if (entity.purpose == ENTITY_PURPOSE_ACTOR && party) {
      const member = party.members[slot] as PartyMember;
      const symbolDimension = width/5.7;
      const startingY = symbolDimension/6;
      let y = startingY + symbolDimension/6;
      stx.save();
      if (FLAG_ROTATE_COLORS && member == game.pendingMember) {
        stx.filter = `hue-rotate(${Mathmin((game.timeMillis - member.activeAttackStartTime) | 0, 180)}deg)`;
      }
      stx.lineWidth = symbolDimension/15;
      const symbolScale = symbolDimension / VOLUME_DIMENSION;

      const resources = member.activeAttackStartTime && ((game.timeMillis - member.activeAttackStartTime)/CONST_EFFECT_INTERVAL | 0)%2
          ? applyAttacks(party, slot)[0]
          : entity.res;

      let h = 0;
      resources.forEach((v, i) => {
        let {
          quantity,
          max: maximum = quantity,
        } = v;
        const symbols = entityRenderables[ENTITY_TYPE_RESOURCE].slice(i * 2);
        let x = symbolDimension/2;
        
        let missing = maximum - quantity;

        [quantity, missing].forEach((value, i) => {
          new Array(Mathmax(value, 0)).fill(symbols[i]).forEach((symbol: EntityRenderables) => {
            const thumbnail = symbol.thumbnail;
            const w = thumbnail.width * symbolScale;
            const h = thumbnail.height * symbolScale;
            stx.drawImage(symbol.thumbnail, x + (symbolDimension - w)/2, y + (symbolDimension - h)/2, w, h);
            
            x += symbolDimension;
          });
        });
        if (quantity || maximum) {
          y += symbolDimension;
          h += symbolDimension;
        }
      });

      stx.strokeStyle = stx.fillStyle = `hsl(${FLAG_ROTATE_COLORS || member != game.pendingMember ? 180 : 180 - Mathmin((game.timeMillis - member.activeAttackStartTime) | 0, 180)},50%,${50 + (member == game.pendingMember ? Mathsin((game.timeMillis - member.activeAttackStartTime)/99)*30 | 0 : 0)}%)`;
      stx.globalCompositeOperation = 'destination-over';
      stx.beginPath(); // required to prevent weirdness with clearRect
      stx.rect(symbolDimension/3, startingY + symbolDimension/6, width - symbolDimension/3, h);
      //ctx.closePath();
      stx.stroke();
      stx.globalAlpha = .3;
      stx.fill();
      stx.restore();

      member.attackAnimations?.forEach(({ attackType: attack, x, y, ['s']: scale }) => {
        if (scale) {
          const thumbnail = entityRenderables[ENTITY_TYPE_SYMBOL][attack].thumbnail;
          stx.save();
          const sx = width * x;
          const sy = height * y;
          stx.translate(sx, sy);
          stx.scale(scale, scale);
          const w = thumbnail.width * symbolScale;
          const h = thumbnail.height * symbolScale;
          stx.drawImage(thumbnail, -w/2, -h/2, w, h);
          stx.restore();  
        }
      });
    }
  }

  const renderEntityToCanvas = (entity: Entity | Falseish, canvas: HTMLCanvasElement, party?: Party, slot?: number) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;  
    const stx = canvas['stx'] || (canvas['stx'] = shortenMethods(canvas.getContext('2d')));
    
    stx.clearRect(0, 0, canvas.width, canvas.height);

    if (entity) {
      if ((!dragContext || dragContext.startPosition == dragContext.lastPosition || entity != dragContext?.entity)) {
        slotsToEntities.set(canvas, entity);
        const thumbnail = entity.renderables.thumbnail;
        const scale = Mathmin(canvas.width*.9/thumbnail.width, canvas.height*.8/thumbnail.height);
        stx.drawImage(
            thumbnail,
            (canvas.width - thumbnail.width*scale)/2,
            (canvas.height - thumbnail.height*scale),
            thumbnail.width*scale,
            thumbnail.height*scale,
        );
      }

      renderEntityToContext(entity, stx, canvas.width, canvas.height, party, slot);
    }
  }

  onkeydown = (e: KeyboardEvent) => {
    let positionMultiplier = 1;
    switch (e.keyCode) {
      case 37: // left
      case 39: // right
        addEvents(gameEventQueue, {
          eventType: GAME_EVENT_TYPE_TURN,
          party: playerParty,
          deltaOrientation: 38 - e.keyCode,
        })
        break;
      case 40: // down
        positionMultiplier = -1;
      case 38: // up
        addEvents(gameEventQueue, {
          eventType: GAME_EVENT_TYPE_MOVE,
          party: playerParty,
          unrotatedDeltaPosition: [positionMultiplier, 0, 0],
        })
        break;
    }
  }

  const f = (now: number) => {
    requestAnimationFrame(f);

    gl.clear(CONST_GL_COLOR_BUFFER_BIT | CONST_GL_DEPTH_BUFFER_BIT);
    
    game.timeMillis = now;
    

    const cameraRotationMatrix = matrix4Rotate(playerParty['czr'], 0, 0, 1);
    const negatedCameraRotationMatrix = matrix4Rotate(-playerParty['czr'], 0, 0, 1);
    const rotatedNegatedOffsetMatrix = vector3TransformMatrix4(cameraRotationMatrix, ...playerParty['coff']);
    
    const cameraPosition = vectorNSubtract(playerParty['cpos'], rotatedNegatedOffsetMatrix);

    const projectionMatrix = matrix4Multiply(
        perspectiveMatrix,
        negatedCameraRotationMatrix,
    );

    const usableLights = (game.previousLights || []).sort((a, b) => {
      return vectorNLength(vectorNSubtract(a['pos'], cameraPosition)) - vectorNLength(vectorNSubtract(b['pos'], cameraPosition));
    });
    const lights = usableLights.map(l => l.light).slice(0, C_MAX_NUM_LIGHTS).flat();
    const lightTransforms = usableLights.map(l => l.lightTransform).flat();
    game.previousLights = [];

    gl.uniformMatrix4fv(
        uniforms[U_PROJECTION_MATRIX_INDEX],
        false,
        projectionMatrix,
    );
    gl.uniform4fv(
        uniforms[U_CAMERA_POSITIION_INDEX],
        [...cameraPosition, usableLights.length],
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
    // display the hourglass
    T.hidden = !gameEventQueue.requestDepth;
    // update the inventory/UI
    slotsToEntities = new Map();
    playerParty.members.forEach((m, i) => {
      const el = X.children.item(i) as HTMLElement;
      const entityElement: HTMLCanvasElement = el.querySelector('.a');
      const weaponElement: HTMLCanvasElement = el.querySelector('.b');
      const secondaryElement: HTMLCanvasElement = el.querySelector('.c');
      
      el.className = dragContext
          && dragContext.fromLocation
          && [entityElement, weaponElement, secondaryElement, el].some(e => dragContext && e == dragContext.currTarget)
          ? 'x o'
          : 'x';
      renderEntityToCanvas(m && m.entity, entityElement, playerParty, i);
      renderEntityToCanvas(m && m.weapon, weaponElement);
      renderEntityToCanvas(m && m.secondary, secondaryElement);
    });
    
    iterateLevelParties(game.level, party => {
      party.anims = party.anims.filter(a => !a(now));
      let bestLight: Light | undefined;

      party.members.forEach((partyMember, i) => {
        if (!partyMember) {
          return;
        }
        partyMember.anims = partyMember.anims.filter(a => !a(now));
        let light: Light | undefined;
        // torch
        if (partyMember.secondary && partyMember.secondary?.entityType == ENTITY_TYPE_TORCH) {
          game.previousLights.push({
            ['pos']: partyMember['pos'],
            light: [.9, .9, .8, 4],
            lightTransform: matrix4Multiply(
                matrix4Translate(...partyMember['pos']),
                matrix4Rotate(party['czr'] + CONST_PI_1DP, 0, 0, 1),
                matrix4Translate(.2, 0, .5),
                matrix4Rotate(-CONST_PI_ON_9_1DP, 0, 1, 0),
            )
          });
        }
        if (party.partyType == PARTY_TYPE_PLAYER || party.partyType == PARTY_TYPE_HOSTILE || partyMember.entity.entityType == ENTITY_TYPE_MARINE) {
          light = {
            ['pos']: partyMember['pos'],
            light: party.partyType == PARTY_TYPE_HOSTILE ? [.6, .2, .2, 0] : [.6, .6, .6, 0],
            lightTransform: matrix4Multiply(
                matrix4Translate(...partyMember['pos']),
                matrix4Rotate((party['czr'] || partyMember['zr']) + CONST_PI_1DP, 0, 0, 1),
                matrix4Translate(-.2, 0, .3),
                //matrix4Rotate(-CONST_PI_ON_4_1DP, 0, 1, 0),
            )
          };
        }
        bestLight = !light || bestLight && bestLight.light[1] > light.light[1] ? bestLight : light;
        if (dragContext
            && dragContext.startPosition != dragContext.lastPosition
            && dragContext.entity == partyMember.entity
            && dragContext.dragImage || party == playerParty
        ) {
          return;
        }

        const {
          bounds,
          depthTexture,
          renderTexture,
          statusTexture,
          statusCanvas,
          surfaceRotationsBuffer,
          textureBoundsBuffer,
          textureCoordinatesBuffer,
          vertexIndexBuffer,
          vertexPositionBuffer,
          staticTransform,
        } = partyMember.entity.renderables;

        // update animations
        if (partyMember.entity.purpose == ENTITY_PURPOSE_ACTOR) {
          if (!partyMember.anims.length) {
            if (Mathrandom() > .1) {
              partyMember.anims.push(createTweenEntityAnimation(now, partyMember, 'zs', partyMember.entity.side ? 1.05 : .97, easeSinBackToStart, 3000));
            } else {
              partyMember.anims.push(createTweenEntityAnimation(now, partyMember, 'zr2', (partyMember['zr2'] || 0) + (Mathrandom() - .5) * CONST_PI_ON_3_1DP, easeSquareBackToStart, 2000, 0));
            }
          }
          const stx: CanvasRenderingContext2D = statusCanvas['stx'] || (statusCanvas['stx'] = shortenMethods(statusCanvas.getContext('2d')));
          // note reversed because we actually are facing to the right
          const w = (bounds[1][1] - bounds[0][1] + 1) * STATUS_SCALE;
          const h = (bounds[1][2] - bounds[0][2] + 1) * STATUS_SCALE;
          stx.clearRect(0, 0, w, h);
          if (partyMember['sds'] > 0) {
            // const g = ctx.createLinearGradient(0, 0, w, h);
            // g.addColorStop(0, '#f00');
            // g.addColorStop(1, '#00f');
            // ctx.fillStyle = g;
            //ctx.fillRect(0, 0, w, h);
            stx.save();
            stx.translate(w/2, 0);
            stx.scale(-partyMember['sds'], partyMember['sds']/partyMember['zs']);
            stx.translate(-w/2, 0);
            renderEntityToContext(partyMember.entity, stx, w, h, party, i);
            stx.restore();
          }
          // update status texture
          gl.bindTexture(CONST_GL_TEXTURE_2D, statusTexture);
          gl.texImage2D(CONST_GL_TEXTURE_2D, 0, CONST_GL_RGBA, CONST_GL_RGBA, CONST_GL_UNSIGNED_BYTE, statusCanvas);
        }
        if (FLAG_ROTATING_ITEMS && (partyMember.entity.purpose == ENTITY_PURPOSE_WEAPON || partyMember.entity.purpose == ENTITY_PURPOSE_SECONDARY)) {
          if (!partyMember.anims.length) {
            partyMember.anims.push(createTweenEntityAnimation(now, partyMember, 'zr', partyMember['zr'] + CONST_2_PI_0DP, easeLinear, 4000));
          }
        }

        const position = partyMember['pos'];
        const modelPositionMatrix = matrix4Translate(...position);
        const yRotation = partyMember['yr'] || 0;
        const zRotation = (partyMember['zr'] || 0) + (partyMember['zr2'] || 0);
        const modelZRotationMatrix = matrix4Rotate(zRotation, 0, 0, 1);
        const modelYRotationMatrix = matrix4Rotate(yRotation, 0, 1, 0);
        const modelRotationMatrix = matrix4Multiply(
            modelZRotationMatrix,
            modelYRotationMatrix,
        );  
        const modelScaleMatrix = matrix4Scale(1, 1, partyMember['zs']);
        const modelViewMatrix = matrix4Multiply(
            modelPositionMatrix,
            modelRotationMatrix,
            modelScaleMatrix,
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

        // status texture
        gl.uniform1i(uniforms[U_STATUS_TEXTURE_SAMPLER_INDEX], 2);
        gl.activeTexture(CONST_GL_TEXTURE2);
        gl.bindTexture(CONST_GL_TEXTURE_2D, statusTexture)
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
      bestLight && game.previousLights.push(bestLight);
    });
  }
  f(0);
};







