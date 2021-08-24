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
    const wallRenderable = walls[(position[1]/2|0)%walls.length];
    return {
      parties: [{
        orientation: ORIENTATION_EAST,
        position,
        type: PARTY_TYPE_OBSTACLE,
        yRotation: Math.PI/2 * (Math.random()*4|0),
        members: [{
          animationQueue: undefined,
          entity: {
            renderables: wallRenderable,
            type: ENTITY_TYPE_WALL,
          }
        }],
      }],
    };
  });
  const dig = (x: number, y: number, z: number, dx: number, dz: number) => {
    (tiles[z][y][x] as Tile).parties = [];
    let validTiles: Vector2[];
    do {
      validTiles = ([[x+1, z], [x-1, z], [x, z+1], [x, z-1], ...new Array(y).fill([x+dx, z+dz])] as Vector2[])
        .filter(([tx, tz]) => {
          return tx>0
              && tz>0
              && tx<LEVEL_DIMENSION-1
              && tz<LEVEL_DIMENSION-1
              && (tiles[tz][y][tx] as Tile).parties.length
              && TILE_DELTAS.every(dx => (
                  TILE_DELTAS.every(dz => (!dx && !dz)
                      || (tx+dx == x || tz+dz == z)
                      || (tiles[tz+dz][y][tx+dx] as Tile).parties.length
                  )
              ));
      });
      if (validTiles.length) {
        const [tx, tz] = validTiles[validTiles.length*Math.random()|0];
        dig(tx, y, tz, tx-x, tz-z);
      }
    } while(validTiles.length);
  };

  dig(LEVEL_DIMENSION/2 | 0, 1, 1, 0, 1);

  volumeMap(tiles, (t: Tile, position: Vector3) => {
    if (!t.parties.length) {
      if (Math.random()>.9) {
        t.parties.push({
          position,
          type: PARTY_TYPE_ITEM,
          orientation: ORIENTATION_EAST,
          yRotation: 0,
          members: [{
            animationQueue: undefined,
            entity: {
              renderables: entityRenderables[ENTITY_TYPE_MARINE][0],
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
    for (let z=0; z<LEVEL_DIMENSION; z++) {
      for (let x=0; x<LEVEL_DIMENSION; x++) {
        const item = tiles[z][1][x];
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