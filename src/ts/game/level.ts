const LEVEL_DIMENSION = 9;
const TILE_DELTAS = [-1, 0, 1];
// in order of orientation
const CARDINAL_XY_DELTAS: Vector2[] = [[1, 0], [0, 1], [-1, 0], [0, -1]];

type Tile = {
  parties: Party[],
};

type Level = Volume<Tile>;

const generateLevel = (timeHolder: TimeHolder, entityRenderables: EntityRenderables[][]): Level => {
  const walls = entityRenderables[ENTITY_TYPE_WALL];
  const tiles = createEmptyVolume<Tile>(LEVEL_DIMENSION);
  volumeMap(tiles, (t, position) => {
    if (position[2] > 2) {
      return {
        parties: [],
      }
    } 
    const wallRenderables = walls[(position[2])%walls.length];
    return {
      parties: [{
        orientation: ORIENTATION_EAST,
        type: PARTY_TYPE_OBSTACLE,
        tile: position,
        anims: [],
        animationQueue: createAnimationEventQueue(timeHolder),
        members: [{
          ...BASE_PARTY_MEMBER,
          staticTransform: matrix4Identity(),
          animationQueue: createAnimationEventQueue(timeHolder),
          entity: {
            renderables: wallRenderables,
            type: ENTITY_TYPE_WALL,
            purpose: ENTITY_PURPOSE_USELESS,
          }
        }],
      }],
    };
  });
  const dig = (tiles: Tile[][], x: number, y: number, previousDx: number, previousDy: number) => {
    (tiles[y][x] as Tile).parties = [];
    let validDeltas: Vector2[];
    do {
      validDeltas = ([...CARDINAL_XY_DELTAS, ...new Array(y).fill([previousDx, previousDy])] as Vector2[])
        .filter(([dx, dy]) => {
          const tx = x + dx;
          const ty = y + dy;
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
      if (validDeltas.length) {
        const [dx, dy] = validDeltas[validDeltas.length*Math.random()|0];
        dig(tiles, x + dx, y + dy, dx, dy);
      }
    } while(validDeltas.length);
  };

  dig(tiles[1] as Tile[][], LEVEL_DIMENSION/2 | 0, 1, 0, 1);

  let c = 0;

  volumeMap(tiles, (t: Tile, position: Vector3) => {
    const floors = entityRenderables[ENTITY_TYPE_FLOOR];
    if (position[2] > 2) {
      return t;
    }
    if (!t.parties.length) {
      t.parties.push({
        orientation: ORIENTATION_EAST,
        type: PARTY_TYPE_FLOOR,
        tile: position,
        anims: [],
        animationQueue: createAnimationEventQueue(timeHolder),
        members: [{
          ...BASE_PARTY_MEMBER,
          animationQueue: createAnimationEventQueue(timeHolder),
          entity: {
            renderables: floors[position[2]%floors.length],
            type: ENTITY_TYPE_FLOOR,
            purpose: ENTITY_PURPOSE_USELESS,
          }
        }],
      });
      if (Math.random()>.5) {
        const type = (ENTITY_TYPE_MARINE + c%4) as EntityType;
        if (c < 12) {
          c++;
        } else {
          return t;
        }
        const thingRenderables = entityRenderables[type];
        let entity: Entity;
        let purpose: EntityPurposeWeapon | EntityPurposeUseless = ENTITY_PURPOSE_USELESS;
        switch (type) {
          case ENTITY_TYPE_PISTOL:
            purpose = ENTITY_PURPOSE_WEAPON;
          case ENTITY_TYPE_SYMBOL:
            entity = {
              renderables: thingRenderables[Math.random() * thingRenderables.length | 0],
              type,
              purpose,
            };
            break;
          case ENTITY_TYPE_SPIDER:
            entity = {
              resources: [
                {
                  quantity: 2,
                  maximum: 2,
                }, {
                  quantity: 0,
                  maximum: 2,
                },
              ],
              purpose: ENTITY_PURPOSE_ACTOR,
              side: 1,
              renderables: thingRenderables[Math.random() * thingRenderables.length | 0],
              type,
            };
            break;
          case ENTITY_TYPE_MARINE:
            entity = {
              resources: [
                {
                  quantity: 3,
                  maximum: 3,
                  temporary: 1,
                }, {
                  quantity: 0,
                  maximum: 2,
                },
              ],
              purpose: ENTITY_PURPOSE_ACTOR,
              side: 0,
              renderables: thingRenderables[Math.random() * thingRenderables.length | 0],
              type,
            };
            break;
        }

        if (entity) {
          t.parties.push({
            type: type == ENTITY_TYPE_SPIDER ? PARTY_TYPE_HOSTILE : PARTY_TYPE_ITEM,
            tile: position,
            anims: [],
            animationQueue: createAnimationEventQueue(timeHolder),
            members: [{
              ...BASE_PARTY_MEMBER,
              animationQueue: createAnimationEventQueue(timeHolder),
              entity
            }]
          });  
        }
      }
    }
    return t;
  });
  // set orientations
  volumeMap(tiles, (t: Tile) => {
    t.parties.forEach(p => {
      const orientation = getFavorableOrientation(p, tiles);
      p.orientation = orientation;
      p.members.forEach((m, i) => {
        if (m) {
          const [position, rotation] = getTargetPositionAndRotations(p, i);
          m['zr'] = rotation;
          m.position = position as Vector3;
        }
      })
    });
  });

  if (FLAG_DEBUG_LEVEL_GENERATION) {
    const s = [];
    for (let y=LEVEL_DIMENSION; y;) {
      y--;
      for (let x=0; x<LEVEL_DIMENSION; x++) {
        const item = tiles[1][y][x];
        s.push(!item || item.parties.some(p => p.type == PARTY_TYPE_OBSTACLE) ? '#' : item.parties.some(p => p.type === PARTY_TYPE_ITEM) ? '!' : ' ');
      }
      s.push('\n');
    }
    console.log(s.join(''));
  }

  return tiles;
}

const getFavorableOrientation = (party: Party, level: Level): Orientation | undefined => {
  const [x, y, tz]  = party.tile;

  // look around
  const options = CARDINAL_XY_DELTAS.map<[number, Orientation]>(([dx, dy], orientation: Orientation) => {
    const tx = x + dx;
    const ty = y + dy;
    if(tx>=0
        && ty>=0
        && tx<LEVEL_DIMENSION
        && ty<LEVEL_DIMENSION
        && (party.type == PARTY_TYPE_HOSTILE || party.type == PARTY_TYPE_ITEM) 
    ) {
      const comparisonTile = level[tz][ty][tx];
      // lower appeal is higher
      const appeal = comparisonTile && comparisonTile.parties.reduce(
          (a, p) => a + (
              p.members.some(m => !!m)
                  ? p.type == party.type
                      ? 1 // slightly avoid looking at like
                      : p.type
                  : 0
          ),
          0,
      ); 
      return [
        appeal,
        orientation,
      ];
    }
    return [9, orientation];
  }).sort(([appeal1], [appeal2]) => appeal1 - appeal2);
  if (options.length && (options[0][0] < PARTY_TYPE_ITEM || party.orientation == null)) {
    let orientation = options[0][1];
    return orientation;
  } else {
    return party.orientation || ORIENTATION_EAST;
  }
}