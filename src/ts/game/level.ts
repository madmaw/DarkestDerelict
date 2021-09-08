///<reference path="../math/random.ts"/>

const LEVEL_SPACING = 3;
const LEVEL_DIMENSION = 9;
const LEVEL_MIDDLE_X = LEVEL_DIMENSION/2 | 0;
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
  const tiles = new Array(LEVEL_DIMENSION + LEVEL_SPACING*2).fill(0).map(() => new Array(LEVEL_DIMENSION).fill(0).map<Tile>(() => ({
    parties: [],
  })));

  iterateLevel(tiles, (t, position) => {
    const [x, y] = position;
    // leave an in/out corridor
    if (x != LEVEL_MIDDLE_X || y > LEVEL_SPACING && y < LEVEL_DIMENSION + LEVEL_SPACING) {
      t.parties.push({
        orientated: ORIENTATION_EAST,
        partyType: PARTY_TYPE_OBSTACLE,
        tile: position,
        anims: [],
        animationQueue: createAnimationEventQueue(timeHolder),
        members: [],
      });  
    }
  });
  const dig = (x: number, y: number, previousDx: number, previousDy: number) => {
    (tiles[y][x] as Tile).parties = [];
    let validDeltas: Vector2[];
    do {
      validDeltas = ([...CARDINAL_XY_DELTAS, ...new Array(Mathmax(5-depth, 0)).fill([previousDx, previousDy])] as Vector2[])
        .filter(([dx, dy]) => {
          const tx = x + dx;
          const ty = y + dy;
          return tx>0
              && ty>LEVEL_SPACING
              && tx<LEVEL_DIMENSION-1
              && ty<LEVEL_DIMENSION + LEVEL_SPACING - 1
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
        dig(x + dx, y + dy, dx, dy);
      }
    } while(validDeltas.length);
  };

  dig(LEVEL_DIMENSION/2 | 0, LEVEL_DIMENSION + LEVEL_SPACING - 1, 0, -1);
  dig(LEVEL_DIMENSION/2 | 0, LEVEL_SPACING + 1, 0, 1);
  dig(LEVEL_DIMENSION/2 | 0, LEVEL_SPACING + 2, 0, 1);

  const flood = (isValid: (tile: Tile) => Booleanish, updateTile: (tile: Tile, adjacentValid: number, inLevel: Booleanish, pos: Vector2) => void) => {
    const positions: Vector2[] = [];
    // randomise position order
    iterateLevel(tiles, (t: Tile, pos: Vector2) => positions.splice(Mathrandom()*positions.length | 0, 0, pos));
    positions.forEach(pos => {
      const [x, y] = pos;
      const t = tiles[y][x];
      if (isValid(t)) {
        const adjacentValid: number = CARDINAL_XY_DELTAS.reduce((a, [dx, dy], orientation) => {
          const ax = x + dx;
          const ay = y + dy;

          if (ax >= 0 && ay >= 0 && ax < LEVEL_DIMENSION && ay < LEVEL_DIMENSION + LEVEL_SPACING*2 && isValid(tiles[ay][ax])) {
            a |= 1 << orientation;
          }
          return a;
        }, 0)
        const inLevel = y >= LEVEL_SPACING && y < LEVEL_DIMENSION + LEVEL_SPACING - 1;

        updateTile(t, adjacentValid, inLevel, pos);
      }
    });
  };
  // add in the walls
  const decor = (depth % 2) + 1;
  flood(
      tile => tile.parties.some(p => p.partyType == PARTY_TYPE_OBSTACLE),
      (tile, adjacentValid, inLevel) => {
        const entityType = (adjacentValid == 5 || adjacentValid == 10) && inLevel
            // east-west or north-south wall
            ? ENTITY_TYPE_WALL_PIPES
            : ENTITY_TYPE_WALL_INSET;
        const orientated = adjacentValid & 1 ? ORIENTATION_EAST : ORIENTATION_NORTH;
        const party = tile.parties[0];
        party.members.push({
          ...BASE_PARTY_MEMBER,
          animationQueue: createAnimationEventQueue(timeHolder),
          ['zr']: orientated * CONST_3_PI_ON_2_3DP,          
          entity: {
            renderables: entityRenderables[entityType][inLevel ? decor : 0],
            entityType,
            purpose: ENTITY_PURPOSE_USELESS,
          }
        });
      },
  );

  const previousDoorType = (depth) % entityRenderables[ENTITY_TYPE_DOOR].length
  const doorType = (depth + 1) % entityRenderables[ENTITY_TYPE_DOOR].length;

  // add in weapons/secondary/marines/keys
  // always have the right key and one food on each level
  const items: Entity[] = ([{
    renderables: entityRenderables[ENTITY_TYPE_KEY][doorType],
    entityType: ENTITY_TYPE_KEY,
    purpose: ENTITY_PURPOSE_SECONDARY,
    variation: doorType,
  }, {
    renderables: entityRenderables[ENTITY_TYPE_FOOD][0],
    entityType: ENTITY_TYPE_FOOD,
    purpose: ENTITY_PURPOSE_SECONDARY,
    variation: 0,
  }] as Entity[]).concat(
      new Array(Mathmin(Mathrandom()*depth | 0, 3)).fill(0).map<Entity>(() => {
        const entityType = (ENTITY_TYPE_FOOD + Mathpow(Math.random(), Mathmax(depth - 5, 1)) * 4 | 0) as EntityType;
        const thingRenderables = entityRenderables[entityType];
        const variation = thingRenderables.length * (Mathpow(Math.random(), Mathmax(depth - 5, 1)) | 0);
        return {
          renderables: thingRenderables[variation],
          entityType,
          purpose: ENTITY_PURPOSE_SECONDARY,
          variation,
        };
      })
  ).concat(
      // marines
      new Array(Mathmax(1 - (Mathrandom() * depth | 0), 0)).fill(0).map<Entity>(() => {
        return createMarine(
            entityRenderables[ENTITY_TYPE_MARINE],
            Mathrandom() * (entityRenderables[ENTITY_TYPE_MARINE].length - 1) + 1 | 0,
        );
      }),
  ).concat(
      // weapons
      new Array(Mathrandom() * 2 + 1 | 0).fill(0).map<Entity>(() => { 
        const v = (Mathpow(Mathrandom(), 4) * depth | 0) % 2;
        switch(v) {
          case 0:
            return createPistol(
                entityRenderables[ENTITY_TYPE_PISTOL], 
                (Mathpow(Mathrandom(), Mathmax(depth - 5, 1)) * (entityRenderables[ENTITY_TYPE_PISTOL].length) | 0) as Attack,
            );
          case 1:
            // shotgunt
            return {
              entityType: ENTITY_TYPE_SHOTGUN,
              purpose: ENTITY_PURPOSE_WEAPON,
              renderables: entityRenderables[ENTITY_TYPE_SHOTGUN][0],
              attacks: [
                // power level 0
                [
                  // attacker in front row
                  [
                    // reload
                    [ATTACK_POWER_GAIN, ATTACK_POWER_GAIN], // front row, same side
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
                    // one barrel, point blank
                    [ATTACK_MOVE_MEDIAL], // front row, same side
                    , // front row, opposide side
                    , // back row, same side
                    , // back row, opposite side
                    [ATTACK_PIERCING, ATTACK_PIERCING, ATTACK_MOVE_MEDIAL], // enemy front row, same side
                  ], 
                  // attacker in back row
                  [
                    // buckshot
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
                    // let them have it with both barrels 
                    [ATTACK_MOVE_MEDIAL], // front row, same side
                    , // front row, opposide side
                    , // back row, same side
                    , // back row, opposite side
                    [ATTACK_PIERCING, ATTACK_PIERCING, ATTACK_MOVE_MEDIAL], // enemy front row, same side
                    [ATTACK_PIERCING, ATTACK_PIERCING, ATTACK_MOVE_MEDIAL], // enemy front row, opposite side
                  ], 
                  // attacker in back row
                  [
                    // buckshot
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
        }
      })
  );
  flood(
      tile => !tile.parties.length,
      (tile, adjacentValid, inLevel, pos) => {
        const c = ((adjacentValid & 1) + (adjacentValid & 2)/2 + (adjacentValid & 4)/4 + (adjacentValid & 8)/8)/4;
        // preference dead ends, especially as we go deeper
        if (Mathpow(Mathrandom(), depth)*items.length > c && inLevel) {
          const item = items.shift();
          tile.parties.push({
            animationQueue: createAnimationEventQueue(timeHolder),
            anims: [],
            partyType: PARTY_TYPE_ITEM,
            tile: pos,
            members: [{
              ...BASE_PARTY_MEMBER,
              animationQueue: createAnimationEventQueue(timeHolder),
              anims: [],
              entity: item,
            }],
          });
        }
      }
  );

  let enemyPartyCount = depth + 1;
  flood(
      tile => !tile.parties.length,
      (tile, adjacentValid, inLevel, pos) => {
        const c = ((adjacentValid & 1) + (adjacentValid & 2)/2 + (adjacentValid & 4)/4 + (adjacentValid & 8)/8)/4;
        const [x, y] = pos;
        // preference open areas, 
        if (Mathrandom() < c * enemyPartyCount && inLevel && !(y % 3) && (x + y)%2) {
          enemyPartyCount--;
          let partyStrength = depth + Mathrandom() * depth - depth/2 | 0;
          const partyMembers: PartyMember[] = [];
          while (partyStrength && partyMembers.length < 4) {
            let enemyId = Mathmin(Mathrandom() * depth + 1 | 0, partyStrength, 2);
            //let enemyId = 1;
            let entity: Entity;
            partyStrength -= enemyId;
            switch (enemyId) {
              case 1: 
                // TODO variants (large spider?)
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
                  renderables: entityRenderables[ENTITY_TYPE_SPIDER][0],
                  entityType: ENTITY_TYPE_SPIDER,
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
                }
                break;
              case 2:
                entity = createMarine(entityRenderables[ENTITY_TYPE_MARINE], 0);
                break;
            }
            const partyMember: PartyMember = {
              ...BASE_PARTY_MEMBER,
              pos: [...pos, 0],
              animationQueue: createAnimationEventQueue(timeHolder),
              entity,
              anims: [],
            };
            if (entity.entityType == ENTITY_TYPE_MARINE) {
              // give it a gun too
              partyMember.weapon = createPistol(entityRenderables[ENTITY_TYPE_PISTOL], ATTACK_PIERCING);
            }
            // TODO maybe give something to drop on death (e.g. food)
            partyMembers.push(partyMember);
          }
          if (partyMembers.length) {
            tile.parties.push({
              animationQueue: createAnimationEventQueue(timeHolder),
              anims: [],
              members: partyMembers,
              partyType: PARTY_TYPE_HOSTILE,
              tile: pos,
            });  
          }
        }
      },
  );

  // floors
  flood(
      tile => !tile.parties.some(party => party.partyType == PARTY_TYPE_OBSTACLE),
      (tile, _, inLevel, pos) => {
        const floors = entityRenderables[ENTITY_TYPE_FLOOR];
        tile.parties.push({
          orientated: ORIENTATION_EAST,
          partyType: PARTY_TYPE_FLOOR,
          tile: pos,
          anims: [],
          animationQueue: createAnimationEventQueue(timeHolder),
          members: [{
            ...BASE_PARTY_MEMBER,
            animationQueue: createAnimationEventQueue(timeHolder),
            entity: {
              renderables: floors[inLevel ? decor: 0],
              entityType: ENTITY_TYPE_FLOOR,
              purpose: ENTITY_PURPOSE_USELESS,
            }
          }, {
            ...BASE_PARTY_MEMBER,
            animationQueue: createAnimationEventQueue(timeHolder),
            entity: {
              renderables: floors[inLevel ? decor : 0],
              entityType: ENTITY_TYPE_CEILING,
              purpose: ENTITY_PURPOSE_USELESS,
            },
          }],
        });
      }
  );

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


  // doors
  tiles[0][LEVEL_MIDDLE_X].parties.push({
    animationQueue: createAnimationEventQueue(timeHolder),
    anims: [],
    partyType: PARTY_TYPE_FLOOR,
    tile: [LEVEL_MIDDLE_X, 0],
    members: [{
      ...BASE_PARTY_MEMBER,
      animationQueue: createAnimationEventQueue(timeHolder),
      anims: [],
      ['pos']: [LEVEL_MIDDLE_X, -.4, 0],
      ['zr']: CONST_PI_ON_2_2DP,
      entity: {
        entityType: ENTITY_TYPE_DOOR,
        purpose: ENTITY_PURPOSE_USELESS,
        renderables: entityRenderables[ENTITY_TYPE_DOOR][previousDoorType],
      },
    }],
  });
  tiles[LEVEL_DIMENSION + LEVEL_SPACING - 1][LEVEL_MIDDLE_X].parties.push({
    animationQueue: createAnimationEventQueue(timeHolder),
    anims: [],
    partyType: PARTY_TYPE_DOOR,
    tile: [LEVEL_MIDDLE_X, LEVEL_DIMENSION + LEVEL_SPACING - 1],
    members: [{
      ...BASE_PARTY_MEMBER,
      animationQueue: createAnimationEventQueue(timeHolder),
      anims: [],
      ['pos']: [LEVEL_MIDDLE_X, LEVEL_DIMENSION + LEVEL_SPACING - 1.4, 0],
      ['zr']: CONST_PI_ON_2_2DP,
      entity: {
        entityType: ENTITY_TYPE_DOOR,
        purpose: ENTITY_PURPOSE_DOOR,
        renderables: entityRenderables[ENTITY_TYPE_DOOR][doorType],
        variation: doorType,
      },
    }],
  });  

  if (FLAG_DEBUG_LEVEL_GENERATION) {
    const s = [];
    for (let y=tiles.length; y;) {
      y--;
      const row = tiles[y];
      for (let x=0; x<row.length; x++) {
        const tile = tiles[y][x];
        s.push(!tile || tile.parties.some(p => p.partyType == PARTY_TYPE_OBSTACLE) ? '#' : tile.parties.some(p => p.partyType === PARTY_TYPE_ITEM) ? '!' : ' ');
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
        && ty<LEVEL_DIMENSION + LEVEL_SPACING * 2
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
  const maxHealth = 5 - (color < 3 ? 2 : color > 4 ? 1 : 3);
  const maxPower = 5 - maxHealth;

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
    variation: color,
    attacks: [
      // power level 0
      [
        // attacker in front row
        [
          // shove and retreat
          [ATTACK_MOVE_MEDIAL], // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [ATTACK_MOVE_MEDIAL], // enemy front row, same side

        ], 
        // attacker in back row
        [
          // move up
          , // front row, same side
          , // front row, opposide side
          [ATTACK_MOVE_MEDIAL, ATTACK_POWER_GAIN], // back row, same side
        ], 
      ],
      // power level 1
      [
        // attacker in front row
        [
          // violent shove
          , // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [ATTACK_BLUDGEONING, ATTACK_MOVE_MEDIAL], // enemy front row, same side
        ], 
        // attacker in back row
        [
          // running strike
          , // front row, same side
          , // front row, opposide side
          [ATTACK_MOVE_MEDIAL], // back row, same side
          , // back row, opposite side
          [ATTACK_BLUDGEONING, ATTACK_MOVE_MEDIAL], // enemy front row, same side
        ], 
      ],
    ],
  };
}

const createPistol = (renderables: EntityRenderables[], attackType: Attack): WeaponEntity => {
  return {
    renderables: renderables[attackType],
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
          [attackType], // enemy front row, same side
        ], 
        // attacker in back row
        [
          // shoot
          , // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [attackType], // enemy front row, same side
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
          [attackType, attackType], // enemy front row, same side
        ], 
        // attacker in back row
        [
          // spray clip
          , // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [attackType], // enemy front row, same side
          , // enemy front row, opposite side
          [attackType], // enemy back row, same side
        ],
      ],
      // power level 3
      [
        // attacker in front row
        [
          // empty clip
          , // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [attackType, attackType, attackType], // enemy front row, same side
        ], 
        // attacker in back row
        [
          // spray clip
          , // front row, same side
          , // front row, opposide side
          , // back row, same side
          , // back row, opposite side
          [attackType, attackType], // enemy front row, same side
          , // enemy front row, opposite side
          [attackType, attackType], // enemy back row, same side
        ],
      ],      
    ],
  };
};