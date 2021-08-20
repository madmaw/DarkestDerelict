///<reference path="math/matrix.ts"/>
///<reference path="math/vector.ts"/>
///<reference path="math/base64.ts"/>

// shapes
const TYPE_SHAPE_SPHERE = 'S';
const TYPE_SHAPE_BOX = 'B';
const TYPE_SHAPE_CAPSULE = 'C';

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

// material
const TYPE_MATERIAL_ID = '#';

const VOLUME_DIMENSION = 32;
const VOLUME_MIDPOINT = VOLUME_DIMENSION/2;
//const VOLUME_SCALE = VOLUME_DIMENSION/256;
const VOLUME_SCALE = 1;
// should be at least (VOLUME_DIMENSION+TEXTURE_PADDING*2) * 6 in area and a power-of-two
const TEXTURE_DIMENSION = 256 * VOLUME_SCALE;
const VOLUME_MIDPOINT_VECTOR: Vector3 = [VOLUME_MIDPOINT, VOLUME_MIDPOINT, VOLUME_MIDPOINT];
const NEGATIVE_VOLUME_MIDPOINT_VECTOR = vectorNDivide(VOLUME_MIDPOINT_VECTOR, -1);
const VOLUME_MIDPOINT_MATRIX = matrix4Translate(...VOLUME_MIDPOINT_VECTOR);
const NEGATIVE_VOLUME_MIDPOINT_MATRIX = matrix4Translate(...NEGATIVE_VOLUME_MIDPOINT_VECTOR);

const TEXTURE_PADDING = 0;

type Rect3 = [Vector3, Vector3];

// const CARDINAL_VECTORS = new Array(6).fill(0).map((_, i) => {
//   const v = [0, 0, 0];
//   v[i%3] = (i/3 | 0)*2 - 1;
//   return v;
// })
const CARDINAL_PROJECTIONS: Matrix4[] = [
  // front
  matrix4Identity(),
  // back
  matrix4Rotate(Math.PI, 0, 1, 0),
  // right
  matrix4Rotate(Math.PI/2, 0, 1, 0),
  // left
  matrix4Rotate(-Math.PI/2, 0, 1, 0),
  // top
  matrix4Rotate(Math.PI/2, 1, 0, 0),
  // bottom
  matrix4Rotate(-Math.PI/2, 1, 0, 0),
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
  '+', // TYPE_CONTEXT_UNION_END
] | [
  '-', // TYPE_CONTEXT_SUBTRACTION_END
] | [
  '&', // TYPE_CONTEXT_INTERSECTION_END
] | [
  '#', // TYPE_MATERIAL_ID
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
                (v: Value<ValueRange>) => v.type == 'literal'
                    ? literalValueToBase64(v)
                    : v.index.toString() // numeric values sit outside base64
            ),
          ]
      ),
  ).flat().join('');
  return commandTemplate;
}

const processVolumetricDrawCommands = (name: string, commands: readonly VolumetricDrawCommand[]) => {
  const commandString = convertVolumetricDrawCommands(commands);
  console.log(`volume for ${name}`, commandString);
  return processVolumetricDrawCommandString(commandString, []);
}

const processVolumetricDrawCommandString = (commandString: string, p: string[]) => {
  const commands = commandString.split('').map(s => p[s]?p[s]:s);

  const contexts: {
    volume: Volume<Voxel>,
    factories: TransformFactory[],
    materialIndex: number, 
  }[] = [{
    volume: createEmptyVolume(),
    factories: [
      identityTransformFactory(VOLUME_MIDPOINT_MATRIX),
      identityTransformFactory(matrix4Scale(VOLUME_SCALE, VOLUME_SCALE, VOLUME_SCALE)),
    ],
    materialIndex: 0,
  }];
  let contextIndex = 0;

  while (commands.length) {
    const context = contexts[0];
    const { volume, factories, materialIndex } = context;
    const allFactories = contexts.map(c => c.factories).reverse().flat();
    const command = commands.shift();
    switch (command) {
      case TYPE_SHAPE_SPHERE:
        const r = positiveIntegerFromBase64(commands.shift())/2;
        renderShape(
            volume,
            (test: Vector3, force?: Booleanish) => (force || vectorNLength(test) <= r) && vectorNNormalize(test),
            allFactories,
            materialIndex,
        );
        break;
      case TYPE_SHAPE_BOX:
        const w = positiveIntegerFromBase64(commands.shift())/2;
        const h = positiveIntegerFromBase64(commands.shift())/2;
        const d = positiveIntegerFromBase64(commands.shift())/2;
        renderShape(
            volume,
            (test: Vector3, force?: Booleanish) => {
              const [x, y, z] = test;
              if (force || Math.abs(x) <= w && Math.abs(y) <= h && Math.abs(z) <= d) {
                const p = [x/w, y/h, z/d];
                const index = p.reduce(
                    (maxIndex, v, i, a) => Math.abs(a[maxIndex]) < Math.abs(v)
                        ? i
                        : maxIndex,
                    0,
                );
                const v = p.map(v => Math.abs(v) >= Math.abs(p[index]) - ERROR_MARGIN && v,
                );
                return vectorNNormalize(v) as Vector3;
              } 
            },
            allFactories,
            materialIndex,
        );
        break;
      case TYPE_SHAPE_CAPSULE:
        {
          const width = positiveIntegerFromBase64(commands.shift());
          const widthDiv2 = width/2;
          const rightRadius = positiveIntegerFromBase64(commands.shift())/2;
          const leftRadius = positiveIntegerFromBase64(commands.shift())/2;

          // const angle = Math.atan2(widthDiv2, rightRadius - leftRadius);

          const angle = Math.PI/2 + Math.asin((rightRadius - leftRadius)/width);
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
              allFactories,
              materialIndex,
          )
        }
        break;
      case TYPE_TRANSLATE_X:
        factories.push(identityTransformFactory(matrix4Translate(integerFromBase64(commands.shift()), 0, 0)));
        break;
      case TYPE_TRANSLATE_Y:
        factories.push(identityTransformFactory(matrix4Translate(0, integerFromBase64(commands.shift()), 0)));
        break;
      case TYPE_TRANSLATE_Z:
        factories.push(identityTransformFactory(matrix4Translate(0, 0, integerFromBase64(commands.shift()))));
        break;
      case TYPE_SCALE_X:
        factories.push(identityTransformFactory(matrix4Scale(positiveFloatFromBase64(commands.shift()), 1, 1)));
        break;
      case TYPE_SCALE_Y:
        factories.push(identityTransformFactory(matrix4Scale(1, positiveFloatFromBase64(commands.shift()), 1)));
        break;
      case TYPE_SCALE_Z:
        factories.push(identityTransformFactory(matrix4Scale(1, 1, positiveFloatFromBase64(commands.shift()))));
        break;
      case TYPE_ROTATE_X:
        factories.push(identityTransformFactory(matrix4Rotate(angleFromBase64(commands.shift()), 1, 0, 0)));
        break;
      case TYPE_ROTATE_Y:
        factories.push(identityTransformFactory(matrix4Rotate(angleFromBase64(commands.shift()), 0, 1, 0)));
        break;
      case TYPE_ROTATE_Z:
        factories.push(identityTransformFactory(matrix4Rotate(angleFromBase64(commands.shift()), 0, 0, 1)));
        break;
      case TYPE_CONTEXT_START:
        contextIndex++;
        contexts.unshift({
          volume: createEmptyVolume(),
          factories: [],
          materialIndex: contextIndex,
        });
        break;
      case TYPE_CONTEXT_END_UNION:
        contexts.shift();
        volumeMap(
            contexts[0].volume,
            (v, [x, y, z]) => v || volume[x][y][z],
        );
        break;
      case TYPE_MATERIAL_ID:
        context.materialIndex = positiveIntegerFromBase64(commands.shift());
        break;
    }
  }

  while (contexts.length > 1) {
    const { volume } = contexts.shift();
    volumeMap(
        contexts[0].volume,
        (v, [x, y, z]) => v || volume[x][y][z],
    );
  }

  return contexts[0];
};

// obtains the normal for the point if it is inside the shape
// always return a normal if force is true
type Shape = (test: Vector3, force?: Booleanish) => Vector3 | Falseish;

const createEmptyVolume = <T>(): Volume<T> => (
    new Array(VOLUME_DIMENSION).fill(0).map(_ =>
        new Array(VOLUME_DIMENSION).fill(0).map(_ =>
            new Array(VOLUME_DIMENSION).fill(0)
        )
    )
);

const volumeMap = <T>(volume: Volume<T>, f: (t: T | Falseish, position: Vector3) => T | Falseish): Volume<T> => {
  volume.forEach((ax, x) => {
    return ax.forEach((ay, y) =>
        ay.forEach((v, z) =>
            ay[z] = f(v, [x, y, z])
        ),
    );
  })
  return volume;
};

const renderShape = (volume: Volume<Voxel>, shape: Shape, transformFactories: TransformFactory[], materialIndex: number) => {
  const transformFactory = p => matrix4Multiply(...transformFactories.map(f => f(p)));
  fixNormals(
      volumeMap(
          volume,
          (voxel, position) => {
            if (voxel) {
              return voxel;
            }
            const transform = transformFactory(position);
            const sourceTransform = matrix4Invert(transform);
            const sourcePosition = vector3TransformMatrix4(sourceTransform, ...position);
            if (shape(sourcePosition)) {
              return [materialIndex];
            } 
          }
      ),
      shape,
      transformFactory,
  );
};

const fixNormals = (volume: Volume<Voxel>, shape: Shape, transformFactory: TransformFactory, invert?: boolean) => {
  volumeMap(volume, (voxel, position): Voxel | Falseish => {
    const exposed = CARDINAL_NORMALS.some(d => {
      const [x, y, z] = vectorNSubtract(position, d);
      return x >= 0
          && x < VOLUME_DIMENSION
          && y >= 0
          && y < VOLUME_DIMENSION
          && z >= 0
          && z < VOLUME_DIMENSION
          && !volume[x][y][z];
    }); 

    if (exposed) {
      if (voxel && voxel.length == 1) {
        const transform = transformFactory(position);
        const sourceTransform = matrix4Invert(transform);
        const sourcePosition = vector3TransformMatrix4(sourceTransform, ...position);
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
    if (t) {
      max = max.map((v, i) => Math.max(position[i], v)) as Vector3;
      min = min.map((v, i) => Math.min(position[i], v)) as Vector3;
    }
    return t;
  });
  return [min, max];
}

const volumeToDepthTexture = (volume: Volume<Voxel>, bounds: Rect3) => {
  return volumeToTexture(volume, bounds, (voxel, x, y, minz, maxz, inverse) => {
    const normal = vector3TransformMatrix4(inverse, ...(voxel.slice(1) as Vector3));
    return [
      ((normal[0]+1)*127)|0,
      ((normal[1]+1)*127)|0,
      Math.min(minz + TEXTURE_PADDING, 255),
      Math.min(maxz + 1 + TEXTURE_PADDING, 255),
    ];
  });
}

const volumeToRenderTexture = (volume: Volume<Voxel>, bounds: Rect3, renderTextures: readonly Volume<Texel>[]) => {
  return volumeToTexture(volume, bounds, (voxel, x, y, z) => {
    const materialIndex = voxel[0];
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
    f: (voxel: Voxel, x: number, y: number, minz: number, maxz: number, inverse: Matrix4) => readonly number[],
) => {
  const data = new Uint8Array(TEXTURE_DIMENSION*TEXTURE_DIMENSION*4);

  let rowHeight = 0;
  let x = TEXTURE_PADDING;
  let y = TEXTURE_PADDING;

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
    const min = extents1.map((v, i) => Math.min(v, extents2[i])) as Vector3;
    const [minx, miny, minz] = min.map(Math.round);
    const max = extents1.map((v, i) => Math.max(v, extents2[i])) as Vector3;
    const [maxx, maxy, maxz] = max.map(Math.round);
    const width = maxx - minx + 1 + TEXTURE_PADDING*2;
    const height = maxy - miny + 1 + TEXTURE_PADDING*2;
    if (FLAG_CHECK_VOLUME_BOUNDS && (minx<0 || miny < 0 || minz < 0 || maxx >= VOLUME_DIMENSION || maxy >= VOLUME_DIMENSION || maxz >= VOLUME_DIMENSION)) {
      console.log(`[${minx},${miny},${minz}][${maxx},${maxy},${maxz}] out of bounds`);
    }
    if (x + width > TEXTURE_DIMENSION) {
      y += rowHeight;
      x = 0;
      rowHeight = 0;
    }
    for (let vy=miny; vy<=maxy; vy++) {
      for (let vx=minx; vx<=maxx; vx++) {
        let firstZ = 0;
        let firstVoxel: Voxel | undefined
        let lastZ = 0;
        for (let vz=maxz; vz>=minz; vz--) {
          const v = vector3TransformMatrix4(transform, vx, vy, vz).map(Math.round);
          const voxel = volume[v[0]][v[1]][v[2]];
          if (voxel) {
            if (!firstVoxel) {
              firstVoxel = voxel;
              firstZ = vz;
            }
            lastZ = vz;
          }
        }
        let index = (y+vy+TEXTURE_PADDING-miny) * TEXTURE_DIMENSION * 4 + (x+vx+TEXTURE_PADDING-minx) * 4;
        if (firstVoxel) {
          const bytes = f(firstVoxel, x, y, maxz - firstZ, maxz - lastZ, inverse);
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
    x += width;
    return [sx1, sy1, sx2, sy2] as Rect2;
  });

  return [data, bounds] as const;
};
