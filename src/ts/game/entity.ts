type EntityTypeWall = 0;
type EntityTypeFloor = 1;
type EntityTypeMarine = 2;
type EntityTypePistol = 3;
type EntityType = EntityTypeWall
    | EntityTypeFloor
    | EntityTypeMarine
    | EntityTypePistol;

const ENTITY_TYPE_WALL: EntityTypeWall = 0;
const ENTITY_TYPE_FLOOR: EntityTypeFloor = 1;
const ENTITY_TYPE_MARINE: EntityTypeMarine = 2;
const ENTITY_TYPE_PISTOL: EntityTypePistol = 3;

type TextureFrame = {
  depthTexture: WebGLTexture,
  renderTexture: WebGLTexture,
  thumbnail: HTMLCanvasElement,
};

type EntityRenderables = {
  frames: TextureFrame[][],
  vertexPositionBuffer: WebGLBuffer,
  vertexIndexBuffer: WebGLBuffer,
  textureCoordinatesBuffer: WebGLBuffer,
  textureBoundsBuffer: WebGLBuffer,
  surfaceRotationsBuffer: WebGLBuffer,
  bounds: Rect3,
};

type EntityAnimation = {
  animationId: number,
  easing: Easing,
  duration: number,
  onComplete: () => void,
}

type Entity = {
  type: EntityType,
  renderables: EntityRenderables,
}
