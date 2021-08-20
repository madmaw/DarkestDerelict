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
  renderables: EntityRenderables,
  position: Vector3,
  animationQueue: EventQueue<EntityAnimation, void>,
}