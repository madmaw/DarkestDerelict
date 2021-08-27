const LEVEL_DIMENSION = 9;
const TILE_DELTAS = [-1, 0, 1];

type Tile = {
  parties: Party[],
};

type Level = {
  tiles: Volume<Tile>,
};

const generateLevel = (entityRenderables: EntityRenderables[][]): Level => {
  const walls = entityRenderables[ENTITY_TYPE_WALL];
  const tiles = createEmptyVolume<Tile>(LEVEL_DIMENSION);
  volumeMap(tiles, (t, position) => {
    const wallRenderables = walls[(position[2])%walls.length];
    return {
      parties: [{
        orientation: ORIENTATION_EAST,
        position,
        type: PARTY_TYPE_OBSTACLE,
        zRotation: Math.PI/2 * (Math.random()*4|0),
        members: [{
          staticTransform: matrix4Identity(),
          animationQueue: undefined,
          entity: {
            renderables: wallRenderables,
            type: ENTITY_TYPE_WALL,
          }
        }],
      }],
    };
  });
  const dig = (tiles: Tile[][], x: number, y: number, dx: number, dy: number) => {
    (tiles[y][x] as Tile).parties = [];
    let validTiles: Vector2[];
    do {
      validTiles = ([[x+1, y], [x-1, y], [x, y+1], [x, y-1], ...new Array(y).fill([x+dx, y+dy])] as Vector2[])
        .filter(([tx, ty]) => {
          return tx>0
              && ty>0
              && tx<LEVEL_DIMENSION-1
              && ty<LEVEL_DIMENSION-1
              && (tiles[ty][tx] as Tile).parties.length
              && TILE_DELTAS.every(dx => (
                  TILE_DELTAS.every(dy => (!dx && !dy)
                      || (tx+dx == x || ty+dy == y)
                      || (tiles[ty+dy][tx+dx] as Tile).parties.length
                  )
              ));
      });
      if (validTiles.length) {
        const [tx, ty] = validTiles[validTiles.length*Math.random()|0];
        dig(tiles, tx, ty, tx-x, ty-y);
      }
    } while(validTiles.length);
  };

  dig(tiles[1] as Tile[][], LEVEL_DIMENSION/2 | 0, 1, 0, 1);

  volumeMap(tiles, (t: Tile, position: Vector3) => {
    const floors = entityRenderables[ENTITY_TYPE_FLOOR];
    if (!t.parties.length) {
      t.parties.push({
        orientation: ORIENTATION_EAST,
        position,
        type: PARTY_TYPE_FLOOR,
        zRotation: 0,
        members: [{
          staticTransform: matrix4Identity(),
          animationQueue: undefined,
          entity: {
            renderables: floors[position[2]%floors.length],
            type: ENTITY_TYPE_FLOOR,
          }
        }],
      });
      if (Math.random()>.5) {
        const index = ENTITY_TYPE_MARINE + Math.random() * 2 | 0;
        const thingRenderables = entityRenderables[index];

        t.parties.push({
          position: [position[0], position[1], position[2] + FLOOR_DEPTH/WALL_DIMENSION],
          type: PARTY_TYPE_ITEM,
          orientation: ORIENTATION_EAST,
          zRotation: Math.random() * Math.PI*2,
          members: [{
            staticTransform: matrix4Scale(index === ENTITY_TYPE_PISTOL ? .2 : .5),
            animationQueue: undefined,
            entity: {
              renderables: thingRenderables[Math.random() * thingRenderables.length | 0],
              type: ENTITY_TYPE_MARINE,
            }
          }]
        })
      }
    }
    return t;
  });

  if (FLAG_DEBUG_LEVEL_GENERATION) {
    const s = [];
    for (let y=LEVEL_DIMENSION; y;) {
      y--;
      for (let x=0; x<LEVEL_DIMENSION; x++) {
        const item = tiles[1][y][x];
        s.push(!item || item.parties.length == 0 ? ' ' : item.parties[0].type === PARTY_TYPE_OBSTACLE ? '#' : '*');
      }
      s.push('\n');
    }
    console.log(s.join(''));
  }

  return {
    tiles,
  };
}