type EntityTypeWall = 0;
type EntityTypeMarine = 1;
type EntityType = EntityTypeWall | EntityTypeMarine;

const ENTITY_TYPE_WALL: EntityTypeWall = 0;
const ENTITY_TYPE_MARINE: EntityTypeMarine = 1;

type TextureFrame = {
  depthTexture: WebGLTexture,
  renderTexture: WebGLTexture,
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
