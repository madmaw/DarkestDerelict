///<reference path="math/matrix.ts"/>
///<reference path="math/vector.ts"/>
///<reference path="math/base64.ts"/>

// shapes
const TYPE_SHAPE_SPHERE = 'S';
const TYPE_SHAPE_BOX = 'B';
const TYPE_SHAPE_CAPSULE = 'C';
const TYPE_SHAPE_CYLINDER = 'D';
const TYPE_SHAPE_EMOJI = 'E';
// rounding used in all subsequent shapes
const TYPE_SHAPE_ROUNDING = 'R';

// translate
const TYPE_TRANSLATE_X = 'x';
const TYPE_TRANSLATE_Y = 'y';
const TYPE_TRANSLATE_Z = 'z';

// rotate
const TYPE_ROTATE_X = 'X';
const TYPE_ROTATE_Y = 'Y';
const TYPE_ROTATE_Z = 'Z';

// scale
const TYPE_SCALE_X = 'w';
const TYPE_SCALE_Y = 'h';
const TYPE_SCALE_Z = 'd';

// union/subtraction
const TYPE_CONTEXT_START = '.';
const TYPE_CONTEXT_END_UNION = '+';
const TYPE_CONTEXT_END_SUBTRACTION = '-';
const TYPE_CONTEXT_END_INTERSECTION = '&';
const TYPE_CONTEXT_END_REMATERIAL = '%';

// load/save
const TYPE_SAVE_CONTEXT = '!';
const TYPE_RESTORE_CONTEXT = '^';

// material
const TYPE_MATERIAL_ID = '#';
const TYPE_MATERIAL_OUT_OF_BOUNDS = '?';


const UNSCALED_VOLUME_DIMENSION = 32;
const UNSCALED_VOLUME_MIDPOINT = UNSCALED_VOLUME_DIMENSION/2;

const VOLUME_DIMENSION = FLAG_CONFIGURABLE_QUALITY ? parseInt(window.location.hash?.substr(1) || '32') : 32;
const VOLUME_MIDPOINT = VOLUME_DIMENSION/2;
const OFFSET_VOLUME_MIDPOINT = (VOLUME_DIMENSION-1)/2;
const VOLUME_DEPTH_OFFSET = 4;
const VOLUME_DEPTH_PROPORTION = VOLUME_DEPTH_OFFSET/256;

//const VOLUME_SCALE = VOLUME_DIMENSION/256;
const VOLUME_SCALE = VOLUME_DIMENSION/UNSCALED_VOLUME_DIMENSION;
// should be at least (VOLUME_DIMENSION+TEXTURE_PADDING*2) * 6 in area and a power-of-two
const TEXTURE_DIMENSION = 256 * VOLUME_SCALE * (FLAG_NO_WRAP_TEXTURES ? 2 : 1);
// it appears that, without a 1 pixel gap, you can get textures interfering with eachother at the
// boundaries
const TEXTURE_PADDING = 1;
const VOLUME_MIDPOINT_VECTOR: Vector3 = [OFFSET_VOLUME_MIDPOINT, OFFSET_VOLUME_MIDPOINT, OFFSET_VOLUME_MIDPOINT];
const NEGATIVE_VOLUME_MIDPOINT_VECTOR = vectorNDivide(VOLUME_MIDPOINT_VECTOR, -1);
const VOLUME_MIDPOINT_MATRIX = matrix4Translate(...VOLUME_MIDPOINT_VECTOR);
const NEGATIVE_VOLUME_MIDPOINT_MATRIX = matrix4Translate(...NEGATIVE_VOLUME_MIDPOINT_VECTOR);

type Rect3 = [Vector3, Vector3];

const CARDINAL_PROJECTIONS: Matrix4[] = [
  // front
  matrix4Multiply(matrix4Rotate(Math.PI/2, 0, 1, 0), matrix4Rotate(-Math.PI/2, 0, 0, 1)),
  // back
  matrix4Rotate(-Math.PI/2, 0, 1, 0),
  // right
  matrix4Rotate(-Math.PI/2, 1, 0, 0),
  // left
  matrix4Rotate(Math.PI/2, 1, 0, 0),
  // top
  matrix4Identity(),
  // bottom
  matrix4Rotate(Math.PI, 0, 1, 0),
];
const INVERSE_CARDINAL_PROJECTIONS = CARDINAL_PROJECTIONS.map(matrix4Invert);
const CARDINAL_NORMALS: Vector3[] = CARDINAL_PROJECTIONS.map(
    rotation => vector3TransformMatrix4(rotation, 0, 0, 1).map(Math.round) as Vector3,
);

type VolumetricDrawCommand = [
  'S', // TYPE_SHAPE_SPHERE
  Value<'positive-integer'>, // diameter
] | [
  'B', // TYPE_SHAPE_BOX
  Value<'positive-integer'>, // width: 
  Value<'positive-integer'>, // height: 
  Value<'positive-integer'>, // depth: 
] | [
  'C', // TYPE_SHAPE_CAPSULE
  Value<'positive-integer'>, // width: 
  Value<'positive-integer'>, // diameterRight: 
  Value<'positive-integer'>, // diameterLeft:
] | [
  'D', // TYPE_SHAPE_CYLINDER
  Value<'positive-integer'>, // width: 
  Value<'positive-integer'>, // diameterRight: 
  Value<'positive-integer'>, // diameterLeft:
  Value<'positive-integer'>, // steps:
] | [
  'E', // TYPE_SHAPE_EMOJI
  CharValue | RefValue,  // symbol (can be multi-byte)
  Value<'positive-integer'>, // letter height
  Value<'positive-integer'>, // depth
] | [
  'R', // TYPE_SHAPE_ROUNDING
  Value<'positive-float'>,
] | [
  'x', // TYPE_TRANSLATE_X,
  Value<'integer'>, // amount: 
] | [
  'y', // TYPE_TRANSLATE_Y,
  Value<'integer'>, // amount: 
] | [
  'z', // TYPE_TRANSLATE_Z,
  Value<'integer'>, // amount: 
] | [
  'X', // TYPE_ROTATE_X,
  Value<'angle'>, // amount: 
] | [
  'Y', // TYPE_ROTATE_Y,
  Value<'angle'>, // amount: 
] | [
  'Z', // TYPE_ROTATE_Z,
  Value<'angle'>, // amount: 
] | [
  'w', // TYPE_SCALE_X,
  Value<'positive-float'>, // amount: 
] | [
  'h', // TYPE_SCALE_Y,
  Value<'positive-float'>, // amount: 
] | [
  'd', // TYPE_SCALE_Z,
  Value<'positive-float'>, // amount: 
] | [
  '.', // TYPE_CONTEXT_START
] | [
  '+', // TYPE_CONTEXT_END_UNION
] | [
  '-', // TYPE_CONTEXT_END_SUBTRACTION
] | [
  '&', // TYPE_CONTEXT_END_INTERSECTION
] | [
  '!', // TYPE_CONTEXT_END_SAVE
] | [
  '%', // TYPE_CONTEXT_END_REMATERIAL
] | [
  '^', //TYPE_LOAD_SAVED_VOLUME
] | [
  '#', // TYPE_MATERIAL_ID
  Value<'positive-integer'>,
] | [
  '?', // TYPE_MATERIAL_OUT_OF_BOUNDS
];

// material index and normal (x, y, z )
type Voxel = readonly [number] | readonly [number, number, number, number];
// rgb + shininess
type Texel = readonly [number, number, number, number];

type Volume<T> = (T | Falseish)[][][];

type TransformFactory = (v: Vector3) => Matrix4;

const identityTransformFactory = (m: Matrix4) => () => m;

const convertVolumetricDrawCommands = (commands: readonly VolumetricDrawCommand[]) => {

  const trimmedCommands = [...commands];
  while (trimmedCommands[trimmedCommands.length - 1][0] == TYPE_CONTEXT_END_UNION) {
    trimmedCommands.pop();
  }

  const commandTemplate = trimmedCommands.map(
      (command: [string, ...Value<ValueRange>[]]) => (
          [
            command[0], 
            ...command.slice(1).map(
                (v: Value<ValueRange>) => v.type == 'ref'
                    ? v.index.toString() // numeric values sit outside base64
                    : numericOrCharValueToBase64(v)
            ),
          ]
      ),
  ).flat().join('');
  return commandTemplate;
}

const processVolumetricDrawCommandString = (
    commandString: string,
    params: string = '',
    transform: Matrix4 = matrix4Multiply(VOLUME_MIDPOINT_MATRIX, matrix4Scale(VOLUME_SCALE)), 
) => {
  const ps = [...params];
  const commands: string[] = [...commandString].map(s => ps[s]?ps[s]:s);

  const contexts: {
    volume: Volume<Voxel>,
    transforms: Matrix4[],
    materialIndex: number,
    commands: string[],
    rounding?: number | undefined,
  }[] = [{
    volume: createEmptyVolume(VOLUME_DIMENSION),
    transforms: [
      transform,
    ],
    materialIndex: 0,
    commands: [],
  }];

  let savedCommands: string[] | undefined;

  const nextContext = () => {
    const context = contexts.shift();
    contexts[0].commands.push(...context.commands);
  };

  while (commands.length) {
    const context = contexts[0];
    const nextCommand = () => {
      const command = commands.shift();
      context.commands.push(command);
      return command;
    };
    const { volume, transforms, materialIndex, rounding} = context;
    const effectiveRounding = rounding || 1/VOLUME_SCALE;
    const transform = matrix4Multiply(...contexts.map(c => c.transforms).reverse().flat());
    const command = nextCommand();
    switch (command) {
      case TYPE_SHAPE_SPHERE:
        const r = positiveIntegerFromBase64(nextCommand())/2;
        renderShape(
            volume,
            (test: Vector3, force?: Booleanish) => (force || vectorNLength(test) <= r) && vectorNNormalize(test),
            transform,
            materialIndex,
        );
        break;
      case TYPE_SHAPE_BOX:
        // NOTE: we're measuring from the center of the voxel, so we need to remove the voxel height from the
        // proportional height
        {
          const w = positiveIntegerFromBase64(nextCommand())/2;
          const h = positiveIntegerFromBase64(nextCommand())/2;
          const d = positiveIntegerFromBase64(nextCommand())/2;
          const dims = [w, h, d];
          renderShape(
              volume,
              (test: Vector3, force?: Booleanish) => {
                if (force || test.every((v, i) => Math.abs(v) <= dims[i])) {
                  const p = test.map((v, i) => v/(dims[i]-.5*effectiveRounding));
                  const maxIndex = p.reduce(
                      (maxIndex, v, i) => Math.abs(p[maxIndex]) < Math.abs(v)
                          ? i
                          : maxIndex,
                      0,
                  );
                  const v = test.map((v, i) => i == maxIndex || Math.abs(v) > dims[i] - effectiveRounding ? v/Math.abs(v) : 0);
                  return vectorNNormalize(v as Vector3);
                } 
              },
              transform,
              materialIndex,
          );
        }
        break;
      case TYPE_SHAPE_CAPSULE:
        {
          const width = positiveIntegerFromBase64(nextCommand());
          const widthDiv2 = width/2;
          const rightRadius = positiveIntegerFromBase64(nextCommand())/2;
          const leftRadius = positiveIntegerFromBase64(nextCommand())/2;

          const angle = Math.PI/2 + Math.asin((rightRadius - leftRadius)/width);
          //const angle = Math.atan2(rightRadius - leftRadius, width);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);
          const leftX = cos * leftRadius - widthDiv2;
          const leftY = sin * leftRadius;
          const rightX = cos * rightRadius + widthDiv2;
          const rightY = sin * rightRadius;
          
          renderShape(
              volume,
              (test: Vector3, force?: Booleanish) => {
                const [x, y, z] = test;
                if (x > rightX) {
                  // right sphere
                  const v: Vector3 = vectorNSubtract(test, [widthDiv2, 0, 0]);
                  return (force || vectorNLength(v) < rightRadius) && vectorNNormalize(v);
                }
                if (x < leftX) {
                  // left sphere
                  const v: Vector3 = vectorNSubtract(test, [-widthDiv2, 0, 0]);
                  return (force || vectorNLength(v) < leftRadius) && vectorNNormalize(v);
                }
                // cylinder
                const r = leftY + (rightY - leftY) * (x - leftX)/width;
                const a = Math.atan2(y, z);
                const ny = Math.sin(a) * sin;
                const nz = Math.cos(a) * sin;
                return (force || r*r > y*y + z*z) && [cos, ny, nz];
              },
              transform,
              materialIndex,
          )
        }
        break;
      case TYPE_SHAPE_CYLINDER:
        {
          const width = positiveIntegerFromBase64(nextCommand());
          const widthDiv2 = width/2;
          const widthMinux1Px = width-effectiveRounding;
          const widthMinus1pxDiv2 = widthMinux1Px/2;
          const leftRadius = positiveIntegerFromBase64(nextCommand())/2;
          const rightRadius = positiveIntegerFromBase64(nextCommand())/2;
          //const angle = Math.PI/2 + Math.asin((rightRadius - leftRadius)/width);
          const angle = Math.atan2(rightRadius - leftRadius, width);
          const sin = Math.sin(angle + Math.PI/2);
          const cos = Math.cos(angle + Math.PI/2);
          const steps = positiveIntegerFromBase64(nextCommand());
          const stepAngle = Math.PI*2/steps;
          const cosStepAngleDiv2 = Math.cos(stepAngle/2)
          const sinStepAngleDiv2 = Math.sin(stepAngle/2)

          renderShape(
              volume,
              (test: Vector3, force?: Booleanish): Vector3 => {
                const [x, y, z] = test;
                let a = Math.atan2(y, z);
                if (a < 0) { 
                  a += Math.PI*2;
                }
                const sector = a / stepAngle | 0;
                const sectorAngle = sector * stepAngle + stepAngle/2;
                const rOuter = widthMinux1Px > 0
                    ? leftRadius + ((x + widthMinus1pxDiv2) / widthMinux1Px) * (rightRadius - leftRadius)
                    // only one entry
                    : leftRadius;
                const rInner = rOuter - effectiveRounding;
                const [rz, ry] = vector2Rotate(-sectorAngle, [z, y]);
                const inPoly = cosStepAngleDiv2*rOuter>rz;
                const inPolySurface = cosStepAngleDiv2*rInner<rz
                
                if (Math.abs(x) <= widthDiv2 && inPoly || force) {
                  return inPolySurface
                      ? Math.abs(ry) - rInner * sinStepAngleDiv2 > 0
                          ? ry > 0
                              ? [cos, Math.sin(sectorAngle+stepAngle/2)*sin, Math.cos(sectorAngle+stepAngle/2)*sin]
                              : [cos, Math.sin(sectorAngle-stepAngle/2)*sin, Math.cos(sectorAngle-stepAngle/2)*sin]
                          : [cos, Math.sin(sectorAngle)*sin, Math.cos(sectorAngle)*sin] as Vector3
                      : vectorNNormalize([x, 0, 0]);
                }
              },
              transform,
              materialIndex,
          );
        }
        break;
      case TYPE_SHAPE_EMOJI:
        const symbol = nextCommand();
        const letterHeight = positiveIntegerFromBase64(nextCommand()) * VOLUME_SCALE;
        const widthDiv2 = positiveIntegerFromBase64(nextCommand())/2;
        const canvas = document.createElement('canvas');
        const canvasDimension = VOLUME_DIMENSION;
        canvas.width = canvasDimension;
        canvas.height = canvasDimension;
        const ctx = canvas.getContext('2d');
        // center to maximise chance of not overflowing
        const baseline = (VOLUME_DIMENSION + letterHeight)/2;
        ctx.font = `${letterHeight}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(symbol, VOLUME_MIDPOINT, baseline);
        const pixels = ctx.getImageData(0, 0, canvasDimension, canvasDimension);
        renderShape(
            volume, 
            (test: Vector3, force?: Booleanish): Vector3 => {
              const [x, y, z] = test;
              // need to scale back up to pixel size
              const px = Math.round(y*VOLUME_SCALE + VOLUME_MIDPOINT);
              const py = Math.round(-z*VOLUME_SCALE + VOLUME_MIDPOINT);
              const a = pixels.data[py*VOLUME_DIMENSION*4+px*4+3];
              if (a > 128 && Math.abs(x)<=widthDiv2 || force) {
                return vectorNNormalize(
                    Math.abs(x) >= widthDiv2 - effectiveRounding
                        ? [x, 0, 0]
                        : test
                );
              }
            },
            transform,
            materialIndex,
        );
        break;
      case TYPE_SHAPE_ROUNDING:
        context.rounding = positiveFloatFromBase64(nextCommand());
        break;
      case TYPE_TRANSLATE_X:
        transforms.push(matrix4Translate(integerFromBase64(nextCommand()), 0, 0));
        break;
      case TYPE_TRANSLATE_Y:
        transforms.push(matrix4Translate(0, integerFromBase64(nextCommand()), 0));
        break;
      case TYPE_TRANSLATE_Z:
        transforms.push(matrix4Translate(0, 0, integerFromBase64(nextCommand())));
        break;
      case TYPE_SCALE_X:
        transforms.push(matrix4Scale(positiveFloatFromBase64(nextCommand()), 1, 1));
        break;
      case TYPE_SCALE_Y:
        transforms.push(matrix4Scale(1, positiveFloatFromBase64(nextCommand()), 1));
        break;
      case TYPE_SCALE_Z:
        transforms.push(matrix4Scale(1, 1, positiveFloatFromBase64(nextCommand())));
        break;
      case TYPE_ROTATE_X:
        transforms.push(matrix4Rotate(angleFromBase64(nextCommand()), 1, 0, 0));
        break;
      case TYPE_ROTATE_Y:
        transforms.push(matrix4Rotate(angleFromBase64(nextCommand()), 0, 1, 0));
        break;
      case TYPE_ROTATE_Z:
        transforms.push(matrix4Rotate(angleFromBase64(nextCommand()), 0, 0, 1));
        break;
      case TYPE_CONTEXT_START:
        contexts.unshift({
          volume: createEmptyVolume(VOLUME_DIMENSION),
          transforms: [],
          materialIndex,
          commands: [],
          rounding,
        });
        break;
      case TYPE_CONTEXT_END_UNION:
        nextContext();
        fixNormals(
            volumeMap(
                contexts[0].volume,
                (v, [x, y, z]) => v || volume[z][y][x],
            ),
        );
        break;
      case TYPE_CONTEXT_END_SUBTRACTION:
        nextContext();
        fixNormals(
            volumeMap(
                contexts[0].volume,
                (v, [x, y, z]) => !volume[z][y][x] && v,
            ),
            ([x, y, z]: Vector3) => {
              const a = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]]
                  .map(([dx, dy, dz]) => volume[z+dz | 0][y+dy | 0][x+dx | 0])
                  .filter(v => v && v.length>1);
              const n = a
                  .reduce((acc, n, _, a) => acc.map((v, i) =>  v - n[i+1]/a.length), [0, 0, 0]) as Vector3;
              //console.log(a, n);
              return n;
            },
            matrix4Identity(),
        );
        break;
      case TYPE_CONTEXT_END_REMATERIAL:
        nextContext();
        volumeMap(
            contexts[0].volume,
            (v, [x, y, z]) => {
              const s = volume[z][y][x];
              return v && s
                  ? [s[0], ...v.slice(1)] as any as Voxel
                  : v;
            },
        );
        break;
      case TYPE_SAVE_CONTEXT:
        // don't want the save command to be saved!
        savedCommands = context.commands.slice(0, -1);
        break;  
      case TYPE_RESTORE_CONTEXT:
        const savedVolume = processVolumetricDrawCommandString(savedCommands.join(''), params, transform).volume;
        fixNormals(
            volumeMap(
                volume,
                (v, [x, y, z]) => v || savedVolume[z][y][x],
            ),
        );
        break;
      case TYPE_MATERIAL_ID:
        context.materialIndex = positiveIntegerFromBase64(nextCommand());
        break;
      case TYPE_MATERIAL_OUT_OF_BOUNDS:
        context.materialIndex = -(context.materialIndex||1);
        break;
  
    }
  }

  while (contexts.length > 1) {
    const { volume } = contexts.shift();
    volumeMap(
        contexts[0].volume,
        (v, [x, y, z]) => v || volume[z][y][x],
    );
  }

  return contexts[0];
};

// obtains the normal for the point if it is inside the shape
// always return a normal if force is true
type Shape = (test: Vector3, force?: Booleanish) => Vector3 | Falseish;

const createEmptyVolume = <T>(d: number): Volume<T> => (
    new Array(d).fill(0).map(_ =>
        new Array(d).fill(0).map(_ =>
            new Array(d).fill(0)
        )
    )
);

const volumeMap = <T>(volume: Volume<T>, f: (t: T | Falseish, position: Vector3) => T | Falseish | void): Volume<T> => {
  if (FLAG_FAST_VOLUME_ITERATION) {
    for (let z=volume.length; z; ) {
      z--;
      const az = volume[z];
      for (let y=az.length; y; ) {
        y--;
        const ay = az[y];
        for (let x=ay.length; x; ) {
          x--;
          const r = f(ay[x], [x, y, z]);
          if (r != null) {
            ay[x] = r as T;
          }
        }
      }
    }  
  } else {
    volume.forEach((az, z) => {
      az.forEach((ay, y) => {
        ay.forEach((v, x) => {
          const r = f(v, [x, y, z]);
          if (r != null) {
            ay[x] = r as T;
          }
        });
      })
    })
  }
  return volume;
};

const renderShape = (volume: Volume<Voxel>, shape: Shape, transform: Matrix4, materialIndex: number) => {
  const sourceTransform = matrix4Invert(transform);
  fixNormals(
      volumeMap(
          volume,
          (voxel, position) => {
            const sourcePosition = vector3TransformMatrix4(sourceTransform, ...position);
            return shape(sourcePosition)
                ? [materialIndex]
                : voxel;
          }
      ),
      shape,
      transform,
  );
};

const fixNormals = (volume: Volume<Voxel>, shape?: Shape, transform?: Matrix4, invert?: boolean) => {
  const sourceTransform = transform && matrix4Invert(transform);

  volumeMap(volume, (voxel, position): Voxel | Falseish => {
    const exposed = CARDINAL_NORMALS.some(d => {
      const [x, y, z] = vectorNSubtract(position, d);
      return x >= 0
          && x < VOLUME_DIMENSION
          && y >= 0
          && y < VOLUME_DIMENSION
          && z >= 0
          && z < VOLUME_DIMENSION
          && !volume[z][y][x];
    }); 

    if (exposed) {
      if (voxel && voxel.length == 1 && shape) {
        const voxelCenter = position as Vector3;
        const sourcePosition = vector3TransformMatrix4(sourceTransform, ...voxelCenter);
        const sourceNormal = shape(sourcePosition, TRUE) as Vector3;
        const origin = vector3TransformMatrix4(transform, 0, 0, 0);
        const normal = vectorNNormalize(
            vectorNSubtract(
                vector3TransformMatrix4(transform, ...sourceNormal),
                origin,
            ),
        );
        return [
          voxel[0],
          ...(invert
              ? vectorNDivide(normal, -1)
              : normal),
        ];
      }
      return voxel;  
    }
    if (!exposed && voxel) {
      return [voxel[0]];
    }
  });
};

const calculateVolumeBounds = <T>(volume: Volume<T>): Rect3 => {
  let max: Vector3 = [0, 0, 0];
  let min: Vector3 = [VOLUME_DIMENSION, VOLUME_DIMENSION, VOLUME_DIMENSION];
  volumeMap(volume, (t, position) => {
    if (t && t[0]>=0) {
      max = max.map((v, i) => Math.max(position[i], v)) as Vector3;
      min = min.map((v, i) => Math.min(position[i], v)) as Vector3;
    }
  });
  return [min, max];
}

const volumeToDepthTexture = (volume: Volume<Voxel>, bounds: Rect3) => {
  return volumeToTexture(volume, bounds, (voxel, x, y, transformedBounds, minz, maxz, inverse) => {
    // if the normal is on the edge, assume that we actually just want the surface normal
    const isOnEdge = !minz && [x, y].some((v, i) => transformedBounds.some(bound => bound[i] == v));
    const normal = isOnEdge
        ? [0, 0, 1]
        : vector3TransformMatrix4(inverse, ...voxel.slice(1) as Vector3);
    return [
      ((normal[0]+1)*127)|0,
      ((normal[1]+1)*127)|0,
      Math.min(minz + VOLUME_DEPTH_OFFSET, 255),
      Math.min(maxz + 1, 255),
    ];
  });
}

const volumeToRenderTexture = (volume: Volume<Voxel>, bounds: Rect3, renderTextures: readonly Volume<Texel>[]) => {
  return volumeToTexture(volume, bounds, (voxel, x, y, _, z) => {
    const materialIndex = Math.abs(voxel[0]);
    const renderTexture = renderTextures[materialIndex%renderTextures.length];
    const col = renderTexture[x%renderTexture.length];
    const row = col[y%col.length];
    const texel = row[z%row.length];
    return texel as Texel;
  });
}

const volumeToTexture = (
    volume: Volume<Voxel>,
    [omin, omax]: Rect3,
    f: (voxel: Voxel, x: number, y: number, transformedBounds: Rect3, minz: number, maxz: number, inverse: Matrix4) => readonly number[],
) => {
  const data = new Uint8Array(TEXTURE_DIMENSION*TEXTURE_DIMENSION*4);

  let rowHeight = 0;
  let x = 0;
  let y = 0;

  const bounds = CARDINAL_PROJECTIONS.map((rotation) => {
    const inverse = matrix4Invert(rotation);
    const transform = matrix4Multiply(
      VOLUME_MIDPOINT_MATRIX,
      rotation,
      NEGATIVE_VOLUME_MIDPOINT_MATRIX,
    );
    const inverseTransform = matrix4Invert(transform);
    const extents1 = vector3TransformMatrix4(inverseTransform, ...omin);
    const extents2 = vector3TransformMatrix4(inverseTransform, ...omax);
    const min = extents1.map((v, i) => Math.round(Math.min(v, extents2[i]))) as Vector3;
    const [minx, miny, minz] = min;
    const max = extents1.map((v, i) => Math.round(Math.max(v, extents2[i]))) as Vector3;
    const [maxx, maxy, maxz] = max;
    const transformedBounds: Rect3 = [min, max];
    const width = maxx - minx + 1;
    const height = maxy - miny + 1;
    if (FLAG_WARN_VOLUME_BOUNDS && (minx<0 || miny < 0 || minz < 0 || maxx >= VOLUME_DIMENSION || maxy >= VOLUME_DIMENSION || maxz >= VOLUME_DIMENSION)) {
      console.log(`[${minx},${miny},${minz}][${maxx},${maxy},${maxz}] out of bounds`);
    }
    if (!FLAG_NO_WRAP_TEXTURES && x + width + TEXTURE_PADDING > TEXTURE_DIMENSION) {
      y += rowHeight;
      x = 0;
      rowHeight = 0;
    }
    for (let vy=miny; vy<=maxy; vy++) {
      for (let vx=minx; vx<=maxx; vx++) {
        let firstZ = 0;
        let firstVoxel: Voxel | undefined
        let lastZ = 0;
        for (let vz=VOLUME_DIMENSION; vz>0; ) {
          vz--;
          const v = vector3TransformMatrix4(transform, vx, vy, vz).map(Math.round);
          if (!FLAG_CHECK_VOLUME_BOUNDS || v[2] >=0 && v[2] < VOLUME_DIMENSION && v[1] >= 0 && v[1] < VOLUME_DIMENSION && v[0] >= 0 && v[0] < VOLUME_DIMENSION) {
            const voxel = volume[v[2]][v[1]][v[0]];
            if (voxel) {
              if (!firstVoxel) {
                firstVoxel = voxel;
                firstZ = vz;
              }
              lastZ = vz;
            } else if (firstVoxel) {
              break;
            }  
          }
        } 
        let index = (y+vy-miny) * TEXTURE_DIMENSION * 4 + (x+vx-minx) * 4;
        if (firstVoxel) {
          const bytes = f(firstVoxel, vx, vy, transformedBounds, maxz - firstZ, maxz - lastZ, inverse);
          data.set(bytes, index);
        } else {
          data.set([0, 0, 0, 0], index);
        }
        index+=4;
      }
    }
    
    const sx1 = x/TEXTURE_DIMENSION;
    const sy1 = y/TEXTURE_DIMENSION;
    const sx2 = (x + width)/TEXTURE_DIMENSION;
    const sy2 = (y + height)/TEXTURE_DIMENSION;
    rowHeight = Math.max(height, rowHeight);
    x += width + TEXTURE_PADDING;
    return [sx1, sy1, sx2, sy2] as Rect2;
  });

  return [data, bounds] as const;
};
