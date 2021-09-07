///<reference path="../math/random.ts"/>

const LEVEL_DIMENSION = 9;
const TILE_DELTAS = [-1, 0, 1];
// in order of orientation
const CARDINAL_XY_DELTAS: Vector2[] = [[1, 0], [0, 1], [-1, 0], [0, -1]];

type Tile = {
  parties: Party[],
};

type Level = Tile[][];

const iterateLevel = (level: Level, f: (t: Tile, position: Vector2) => void) => {
  level.forEach((row, y) => {
    row.forEach((tile, x) => {
      f(tile, [x, y]);
    });
  });
};

const iterateLevelParties = (level: Level, f: (party: Party) => void) => {
  iterateLevel(level, (tile: Tile) => {
    tile.parties.forEach(f);
  });
};

const iterateLevelMembers = (level: Level, f: (m: PartyMember, party: Party, slotId: number) => void) => {
  iterateLevelParties(level, (party) => {
    [...party.members].forEach((partyMember, i) => partyMember && f(partyMember, party, i));
  });
}

const generateLevel = (timeHolder: TimeHolder, entityRenderables: EntityRenderables[][], depth: number): Level => {
  const walls = entityRenderables[ENTITY_TYPE_WALL];
  const tiles = new Array(LEVEL_DIMENSION).fill(0).map(() => new Array(LEVEL_DIMENSION).fill(0).map<Tile>(() => ({
    parties: [],
  })));

  iterateLevel(tiles, (t, position) => {
    const wallRenderables = walls[depth%walls.length];
    t.parties.push({
      orientated: ORIENTATION_EAST,
      partyType: PARTY_TYPE_OBSTACLE,
      tile: position,
      anims: [],
      animationQueue: createAnimationEventQueue(timeHolder),
      members: [{
        ...BASE_PARTY_MEMBER,
        animationQueue: createAnimationEventQueue(timeHolder),
        entity: {
          renderables: wallRenderables,
          entityType: ENTITY_TYPE_WALL,
          purpose: ENTITY_PURPOSE_USELESS,
        }
      }],
    })
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
        const [dx, dy] = validDeltas[validDeltas.length*Mathrandom()|0];
        dig(tiles, x + dx, y + dy, dx, dy);
      }
    } while(validDeltas.length);
  };

  dig(tiles, LEVEL_DIMENSION/2 | 0, 1, 0, 1);

  let c = 0;

  iterateLevel(tiles, (t: Tile, position: Vector2) => {
    const floors = entityRenderables[ENTITY_TYPE_FLOOR];
    if (!t.parties.length) {
      t.parties.push({
        orientated: ORIENTATION_EAST,
        partyType: PARTY_TYPE_FLOOR,
        tile: position,
        anims: [],
        animationQueue: createAnimationEventQueue(timeHolder),
        members: [{
          ...BASE_PARTY_MEMBER,
          animationQueue: createAnimationEventQueue(timeHolder),
          entity: {
            renderables: floors[depth%floors.length],
            entityType: ENTITY_TYPE_FLOOR,
            purpose: ENTITY_PURPOSE_USELESS,
          }
        }, {
          ...BASE_PARTY_MEMBER,
          animationQueue: createAnimationEventQueue(timeHolder),
          entity: {
            renderables: floors[depth%floors.length],
            entityType: ENTITY_TYPE_CEILING,
            purpose: ENTITY_PURPOSE_USELESS,
          },
        }],
      });
      if (Mathrandom()>.5) {
        const type = (ENTITY_TYPE_MARINE + c%6) as EntityType;
        if (c < 20) {
          c++; 
        } else {
          return t;
        }
        const thingRenderables = entityRenderables[type];
        let entity: Entity;
        switch (type) {
          case ENTITY_TYPE_PISTOL:
            entity = createPistol(thingRenderables[0]);
            break;
          case ENTITY_TYPE_TORCH:
          case ENTITY_TYPE_BATTERY:
          case ENTITY_TYPE_BAYONET:
            entity = {
              renderables: thingRenderables[Mathrandom() * thingRenderables.length | 0],
              entityType: type,
              purpose: ENTITY_PURPOSE_SECONDARY,
            };
            break;
          case ENTITY_TYPE_SPIDER:
            entity = {
              res: [
                {
                  quantity: 2,
                  max: 2,
                }, {
                  quantity: 0,
                  max: 2,
                },
              ],
              purpose: ENTITY_PURPOSE_ACTOR,
              side: 1,
              renderables: thingRenderables[Mathrandom() * thingRenderables.length | 0],
              entityType: type,
              attacks: [
                // power level 0
                [
                  // attacker in front row
                  [
                    // dodge
                    [ATTACK_MOVE_LATERAL, ATTACK_POWER_GAIN], // front row, same side
                  ], 
                  // attacker in back row
                  [
                    // dodge
                    , // front row, same side
                    , // front row, opposide side
                    [ATTACK_MOVE_LATERAL, ATTACK_POWER_GAIN], // back row, same side
                  ], 
                ],
                // power level 1
                [
                  // attacker in front row
                  [
                    // venomous bite
                    , // front row, same side
                    , // front row, opposide side
                    , // back row, same side
                    , // back row, opposite side
                    [ATTACK_POISON], // enemy front row, same side
                  ], 
                  // attacker in back row
                  [
                    // web
                    , // front row, same side
                    , // front row, opposide side
                    , // back row, same side
                    , // back row, opposite side
                    [ATTACK_WEBBING], // enemy front row, same side
                    [ATTACK_WEBBING], // enemy front row, opposite side
                  ], 
                ],                
              ],
            };
            break;
          case ENTITY_TYPE_MARINE:
            entity = createMarine(thingRenderables, Mathrandom() * thingRenderables.length | 0);
            break;
        }

        if (entity) {
          t.parties.push({
            partyType: type == ENTITY_TYPE_SPIDER ? PARTY_TYPE_HOSTILE : PARTY_TYPE_ITEM,
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
  iterateLevelParties(tiles, (party) => {
    const orientation = getFavorableOrientation(party, tiles);
    party.orientated = orientation;
    party.members.forEach((partyMember, i) => {
      if (partyMember) {
        const [position, rotation] = getTargetPositionAndRotations(party, i);
        partyMember['zr'] = rotation;
        partyMember['pos'] = position as Vector3;
      }
    })
  });

  if (FLAG_DEBUG_LEVEL_GENERATION) {
    const s = [];
    for (let y=LEVEL_DIMENSION; y;) {
      y--;
      for (let x=0; x<LEVEL_DIMENSION; x++) {
        const item = tiles[1][y][x];
        s.push(!item || item.parties.some(p => p.partyType == PARTY_TYPE_OBSTACLE) ? '#' : item.parties.some(p => p.partyType === PARTY_TYPE_ITEM) ? '!' : ' ');
      }
      s.push('\n');
    }
    console.log(s.join(''));
  }

  return tiles;
}

const getFavorableOrientation = (party: Party, level: Level): Orientation | undefined => {
  const [x, y]  = party.tile;

  // look around
  const options = CARDINAL_XY_DELTAS.map<[number, Orientation]>(([dx, dy], orientation: Orientation) => {
    const tx = x + dx;
    const ty = y + dy;
    if(tx>=0
        && ty>=0
        && tx<LEVEL_DIMENSION
        && ty<LEVEL_DIMENSION
        && (party.partyType == PARTY_TYPE_HOSTILE || party.partyType == PARTY_TYPE_ITEM) 
    ) {
      const comparisonTile = level[ty][tx];
      // lower appeal is higher
      const appeal = comparisonTile && comparisonTile.parties.reduce(
          (a, p) => a + (
              p.members.some(m => !!m)
                  ? p.partyType == party.partyType
                      ? 1 // slightly avoid looking at like
                      : p.partyType
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
  if (options.length && (options[0][0] < PARTY_TYPE_ITEM || party.orientated == null)) {
    let orientation = options[0][1];
    return orientation;
  } else {
    return party.orientated;
  }
}

const createMarine = (renderables: EntityRenderables[], color: number): ActorEntity => {

  const rng = rngFactory(color);
  const r = rng();
  // TODO make special do something
  // TODO make green marine very standard
  const special = rng() + 1 | 0;
  const maxPower = 2 + (r * r * r * 2 | 0);
  const maxHealth = 5 - maxPower - special;

  return {
    res: [
      {
        quantity: maxHealth,
        max: maxHealth,
        temporary: 0,
      }, {
        quantity: 0,
        max: maxPower,
      },
    ],
    purpose: ENTITY_PURPOSE_ACTOR,
    side: 0,
    renderables: renderables[color],
    entityType: ENTITY_TYPE_MARINE,
    attacks: [
      // power level 0
      [
        // attacker in front row
        [
          // retreat
          [ATTACK_MOVE_MEDIAL], // front row, same side
        ], 
        // attacker in back row
        [
          // move up
          , // front row, same side
          , // front row, opposide side
          [ATTACK_MOVE_MEDIAL], // back row, same side
        ], 
      ],
      // power level 1
      [
        // attacker in front row
        [
          // punch and retreat
          [ATTACK_MOVE_MEDIAL], // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [ATTACK_BLUDGEONING], // enemy front row, same side
        ], 
      ],
    ],
  };
}

const createPistol = (renderables: EntityRenderables): WeaponEntity => {
  return {
    renderables,
    entityType: ENTITY_TYPE_PISTOL,
    purpose: ENTITY_PURPOSE_WEAPON,
    attacks: [
      // power level 0
      [
        // attacker in front row
        [
          // pistol whip
          , // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [ATTACK_POWER_DRAIN], // enemy front row, same side
        ], 
        // attacker in back row
        [
          // reload
          , // front row, same side
          , // front row, opposide side
          [ATTACK_POWER_GAIN, ATTACK_POWER_GAIN], // back row, same side
        ],
      ], 
      // power level 1
      [
        // attacker in front row
        [
          // shoot
          , // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [ATTACK_PIERCING], // enemy front row, same side
        ], 
        // attacker in back row
        [
          // shoot
          , // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [ATTACK_PIERCING], // enemy front row, same side
        ],
      ],
      // power level 2
      [
        // attacker in front row
        [
          // empty clip
          , // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [ATTACK_PIERCING, ATTACK_PIERCING], // enemy front row, same side
        ], 
        // attacker in back row
        [
          // spray clip
          , // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [ATTACK_PIERCING], // enemy front row, same side
          [ATTACK_PIERCING], // enemy front row, opposite side
        ],
      ],
    ],
  };
};