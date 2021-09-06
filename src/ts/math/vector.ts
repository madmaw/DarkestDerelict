///<reference path="../hax.ts"/>

type Rect2 = [number, number, number, number];
type Vector2 = [number, number];

type Vector3 = [number, number, number];
type Vector4 = [number, number, number, number];

const vector2AngleAndDistance = ([x1, y1]: Vector2, [x2, y2]: Vector2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return [Mathatan2(dy, dx), Mathpow(dx*dx + dy*dy, .5)];
}

const vector2Rotate = (a: number, [x, y]: Vector2): Vector2 => {
  const sin = Mathsin(a);
  const cos = Mathcos(a);
  return [
    x * cos - y * sin,
    x * sin + y * cos,
  ];
}

const vector3TransformMatrix4 = (m: Matrix4, x: number, y: number, z: number): Vector3 => 
    vector4TransformMatrix4(m, x, y, z).slice(0, 3) as Vector3;

const vector4TransformMatrix4 = (m: Matrix4, x: number, y: number, z: number): Vector4 => {
  let w = (m[3] * x + m[7] * y + m[11] * z + m[15]) || 1.;
  return [
      (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
      (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
      (m[2] * x + m[6] * y + m[10] * z + m[14]) / w,
      w,
  ];
}

const vector3CrossProduct = (v1: Vector3, v2: Vector3): Vector3 => {
    return [
        v1[1] * v2[2] - v1[2]*v2[1],
        v1[2] * v2[0] - v1[0]*v2[2],
        v1[0] * v2[1] - v1[1]*v2[0]
    ];
}

const vector3GetNorma = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
    return vector3CrossProduct(
        vectorNNormalize([x1, y1, z1]) as Vector3,
        vectorNNormalize([x2, y2, z2]) as Vector3
    );
}

const vectorNDotProduct = <T extends number[]>(v1: T, v2: T): number => {
    return v1.reduce<number>((r, v, i) => r + v * v2[i], 0);
    //return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

const vectorNLength = <T extends number[]>(v: T): number => {
    return Mathpow(vectorNDotProduct(v, v), .5);
}

const vectorNMix = <T extends number[]>(v1: T, v2: T, amt: number): T => {
    return v1.map((v, i) => v * amt + v2[i] * (1 - amt)) as any;
}

const vectorNNormalize = <T extends number[]>(v: T): T => {
    return vectorNDivide(v, vectorNLength(v)) as any;
}

const vectorNSubtract = <T extends number[]>(v1: T, v2: T): T => {
    //return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
    return v1.map((v, i) => v - v2[i]) as any;
}

const vectorNDivide = <T extends number[]>(v: T, d: number): T => {
    return v.map(v => v/d) as any;
}

// Closure compiler should strip out Z param (also, we don't use this method)
const vector2PolyContains = (poly: Vector2[], x: number, y: number, ignoredZ?: number): boolean => {
    // from https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon

    let inside: boolean;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        let xi = poly[i][0], yi = poly[i][1];
        let xj = poly[j][0], yj = poly[j][1];

        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
    }

    return inside;
}

const vector2SquaredDistance = (v: Vector2, w: Vector2) => {
    const dx = v[0] - w[0], dy = v[1] - w[1];
    return dx * dx + dy * dy;
}