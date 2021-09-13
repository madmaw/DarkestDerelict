const LEVEL_SPACING = 3;
const LEVEL_DIMENSION = 9;
const LEVEL_MIDDLE_X = LEVEL_DIMENSION/2 | 0;
const TILE_DELTAS = [-1, 0, 1];
// in order of orientation
const CARDINAL_XY_DELTAS: Vector2[] = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const REGULAR_DOOR_VARIANT = 1;
const TREASURE_DOOR_VARIANT = 0;

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

const generateLevel = (entityRenderables: EntityRenderables[][], depth: number): Level => {
  const tiles = new Array(LEVEL_DIMENSION + LEVEL_SPACING*2).fill(0).map(() => new Array(LEVEL_DIMENSION).fill(0).map<Tile>(() => ({
    parties: [],
  })));

  const staples: Entity[] = entityRenderables[ENTITY_TYPE_FOOD].map<Entity>((renderables, variation) => ({
    renderables,
    entityType: ENTITY_TYPE_FOOD,
    purpose: ENTITY_PURPOSE_SECONDARY,
    variation,
  }))/*.concat([{
    renderables: entityRenderables[ENTITY_TYPE_KEY][TREASURE_DOOR_VARIANT],
    entityType: ENTITY_TYPE_KEY,
    purpose: ENTITY_PURPOSE_SECONDARY,
    variation: TREASURE_DOOR_VARIANT,
  }])*/;
  

  iterateLevel(tiles, (t, position) => {
    const [x, y] = position;
    // leave an in/out corridor
    if (x != LEVEL_MIDDLE_X || y > LEVEL_SPACING && y < LEVEL_DIMENSION + LEVEL_SPACING) {
      t.parties.push({
        orientated: ORIENTATION_EAST,
        partyType: PARTY_TYPE_OBSTACLE,
        tile: position,
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

  const flood = (
      isValid: (tile: Tile) => Booleanish,
      updateTile: (tile: Tile, adjacentValid: number, band: number, pos: Vector2) => void,
  ) => {
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
        const band = y < LEVEL_SPACING
            ? -1
            : y < LEVEL_DIMENSION + LEVEL_SPACING - 1
                ? 0 : 1;

        updateTile(t, adjacentValid, band, pos);
      }
    });
  };
  // add in the walls
  const decor = depth % entityRenderables[ENTITY_TYPE_WALL_INSET].length;
  const nextDecor = (depth+1) % entityRenderables[ENTITY_TYPE_WALL_INSET].length;
  flood(
      tile => tile.parties.some(p => p.partyType == PARTY_TYPE_OBSTACLE),
      (tile, adjacentValid, band) => {
        const entityType = (adjacentValid == 5 || adjacentValid == 10) && !band
            // east-west or north-south wall
            ? ENTITY_TYPE_WALL_PIPES
            : ENTITY_TYPE_WALL_INSET;
        const orientated = adjacentValid & 1 ? ORIENTATION_EAST : ORIENTATION_NORTH;
        const party = tile.parties[0];
        party.members.push({
          ...BASE_PARTY_MEMBER,
          ['zr']: orientated * CONST_3_PI_ON_2_3DP,          
          entity: {
            renderables: entityRenderables[entityType][band > 0 ? nextDecor : decor],
            entityType,
            purpose: ENTITY_PURPOSE_USELESS,
          }
        });
      },
  );

  if (FLAG_TREASURE_ROOMS) {
    let treasureRooms = 1;
    flood(
        tile => !tile.parties.length,
        (tile, adjacentValid, band, pos) => {
          // all sides except one surrounded by walls, hole facing east
          if (!band && adjacentValid == 1 && treasureRooms) {
            treasureRooms--;
            // special shotgun
            // TODO food cache
            tile.parties.push({
              partyType: PARTY_TYPE_ITEM,
              tile: pos,
              members: [{
                ...BASE_PARTY_MEMBER,
                entity: createGun(entityRenderables, ENTITY_TYPE_SHOTGUN, (Mathrandom() * 3 | 0) as Attack)
              }],
            });
            // door facing east
            tile.parties.push({
              partyType: PARTY_TYPE_DOOR,
              tile: pos,
              orientated: ORIENTATION_EAST,
              members: [{
                ...BASE_PARTY_MEMBER,
                entity: {
                  entityType: ENTITY_TYPE_DOOR,
                  purpose: ENTITY_PURPOSE_DOOR,
                  // treasure door is the other door variant
                  renderables: entityRenderables[ENTITY_TYPE_DOOR][TREASURE_DOOR_VARIANT],
                  variation: TREASURE_DOOR_VARIANT,
                },
              }]
            });
          }
        }
    );
  }


  // add in weapons/secondary/marines/keys
  // always have the right key and one food on each level
  const items: Entity[] = ([{
    renderables: entityRenderables[ENTITY_TYPE_KEY][REGULAR_DOOR_VARIANT],
    entityType: ENTITY_TYPE_KEY,
    purpose: ENTITY_PURPOSE_SECONDARY,
    variation: REGULAR_DOOR_VARIANT,
  }, staples[0]] as Entity[]).concat(
      new Array(Mathsqrt(depth - 1) | 0).fill(0).map<Entity>(() => {
        // only spawn extra keys if there are treasure rooms
        const entityType = (ENTITY_TYPE_FOOD + Mathpow(Mathrandom(), Mathmax(depth - 5, 1)) * (FLAG_TREASURE_ROOMS ? 5 : 4) | 0) as EntityType;
        const thingRenderables = entityRenderables[entityType];
        const variation = thingRenderables.length * (Mathpow(Mathrandom(), Mathmax(depth - 5, 1)) | 0);
        return {
          renderables: thingRenderables[variation],
          entityType,
          purpose: ENTITY_PURPOSE_SECONDARY,
          variation,
        };
      })
  ).concat(
      // marines
      new Array(Mathmax(2 - Mathrandom() * depth | 0, 0)).fill(0).map<Entity>(() => {
        return createMarine(
            entityRenderables[ENTITY_TYPE_MARINE],
            Mathrandom() * (entityRenderables[ENTITY_TYPE_MARINE].length - 1) + 1 | 0,
        );
      }),
  ).concat(
      // weapons
      new Array(Mathrandom() * 2 + 1 | 0).fill(0).map<Entity>(() => { 
        const v = (Mathpow(Mathrandom(), 4) * depth | 0) % 2;
        return createGun(
            entityRenderables,
            ENTITY_TYPE_PISTOL + v as EntityTypePistol | EntityTypeShotgun, 
            // only spawn regular shotguns
            v ? 0 : (Mathpow(Mathrandom(), Mathmax(depth - 5, 1)) * (entityRenderables[ENTITY_TYPE_PISTOL].length) | 0) as Attack,
        );
      }),
  );
  flood(
      tile => !tile.parties.length,
      (tile, adjacentValid, band, pos) => {
        const c = ((adjacentValid & 1) + (adjacentValid & 2)/2 + (adjacentValid & 4)/4 + (adjacentValid & 8)/8)/4;
        // preference dead ends, especially as we go deeper
        if (Mathpow(Mathrandom(), depth)*items.length > c && !band) {
          const item = items.shift();
          tile.parties.push({
            partyType: PARTY_TYPE_ITEM,
            tile: pos,
            members: [{
              ...BASE_PARTY_MEMBER,
              entity: item,
            }],
          });
        }
      }
  );

  let enemyPartyCount = depth + 1;
  let treasureCount = 0;
  flood(
      tile => !tile.parties.length,
      (tile, adjacentValid, band, pos) => {
        const c = ((adjacentValid & 1) + (adjacentValid & 2)/2 + (adjacentValid & 4)/4 + (adjacentValid & 8)/8)/4;
        const [x, y] = pos;
        // preference open areas, 
        if (Mathrandom() < c * enemyPartyCount && !band && !(y % 3) && (x + y)%2) {
          let partyStrength = Mathmin(Mathsqrt(depth) + Mathrandom() * enemyPartyCount | 0, depth);
          enemyPartyCount--;
          const partyMembers: PartyMember[] = [];
          while (partyStrength && partyMembers.length < 4) {
            const enemyId = Mathmin(Mathrandom() * Mathsqrt(depth) + 1 | 0, partyStrength, 4);

            //let enemyId = 1;
            let entity: Entity;
            partyStrength -= enemyId;
            switch (enemyId) {
              case 1: 
              case 3:
              case 4:
                // variants (large spider)
                const poisonAttack = enemyId - 1 ? [ATTACK_POISON, ATTACK_POISON] : [ATTACK_POISON];
                const webbingAttack = enemyId - 1 ? [ATTACK_WEBBING, ATTACK_WEBBING] : [ATTACK_WEBBING];
                const renderables = entityRenderables[ENTITY_TYPE_SPIDER][0];
                entity = {
                  res: [
                    {
                      quantity: enemyId+1,
                      maxim: enemyId+1,
                    }, {
                      quantity: 0,
                      maxim: enemyId+1,
                    },
                    {
                      quantity: 0,
                    }
                  ],
                  purpose: ENTITY_PURPOSE_ACTOR,
                  side: 1,
                  renderables: enemyId - 1 ? {...renderables, staticTransform: matrix4Scale(Mathsqrt(enemyId)/(3*VOLUME_SCALE*WALL_DIMENSION))} : renderables,
                  entityType: ENTITY_TYPE_SPIDER,
                  attacks: FLAG_USE_ATTACK_MATRICES
                    ? 
                        [
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
                              [ATTACK_MOVE_LATERAL, ATTACK_POWER_GAIN, ATTACK_POWER_GAIN], // back row, same side
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
                              poisonAttack, // enemy front row, same side
                            ], 
                            // attacker in back row
                            [
                              // web
                              , // front row, same side
                              , // front row, opposide side
                              [ATTACK_MOVE_MEDIAL], // back row, same side
                              , // back row, opposite side
                              webbingAttack, // enemy front row, same side
                              webbingAttack, // enemy front row, opposite side
                            ], 
                          ],         
                          // power level 2
                          [
                            // attacker in front row
                            [
                              // venomous bite
                              , // front row, same side
                              , // front row, opposide side
                              , // back row, same side
                              , // back row, opposite side
                              poisonAttack, // enemy front row, same side
                              poisonAttack, // enemy front row, opposite side
                            ], 
                            // attacker in back row
                            [
                              // web
                              , // front row, same side
                              , // front row, opposide side
                              [ATTACK_MOVE_MEDIAL], // back row, same side
                              , // back row, opposite side
                              webbingAttack, // enemy front row, same side
                              webbingAttack, // enemy front row, opposite side
                              webbingAttack, // enemy back row, same side
                              webbingAttack, // enemy back row, opposite side
                            ], 
                          ],                           
                        ] 
                    : arrayFromBase64<Attack[][][][]>([...('=<;<]_=::<]_<?::::;[@::::;a;a<@::::;[;[B::::;a;a;a;a')], 4)
                }
                break;
              case 2:
                  entity = createMarine(entityRenderables[ENTITY_TYPE_MARINE], 0);
                break;
            }
            const partyMember: PartyMember = {
              ...BASE_PARTY_MEMBER,
              p: [...pos, 0],
              entity,
            };
            if (entity.entityType == ENTITY_TYPE_MARINE) {
              // give it a gun too
              partyMember.weapon = createGun(entityRenderables, ENTITY_TYPE_PISTOL, ATTACK_PIERCING);
            }
            // maybe drop food
            Mathrandom() < enemyId/(treasureCount+1)  && (partyMember.secondary = {...staples[Mathmax(staples.length - 1 - treasureCount++, 0)]});
            partyMembers.push(partyMember);
          }
          if (partyMembers.length) {
            tile.parties.push({
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
      (tile, _, band, pos) => {
        const floors = entityRenderables[ENTITY_TYPE_FLOOR];
        tile.parties.push({
          partyType: PARTY_TYPE_FLOOR,
          tile: pos,
          members: [{
            ...BASE_PARTY_MEMBER,
            entity: {
              renderables: floors[band > 0 ? nextDecor: decor],
              entityType: ENTITY_TYPE_FLOOR,
              purpose: ENTITY_PURPOSE_USELESS,
            }
          }, {
            ...BASE_PARTY_MEMBER,
            entity: {
              renderables: floors[band > 0 ? nextDecor : decor],
              entityType: ENTITY_TYPE_CEILING,
              purpose: ENTITY_PURPOSE_USELESS,
            },
          }],
        });
      }
  );

  // exit
  tiles[LEVEL_DIMENSION + LEVEL_SPACING - 1][LEVEL_MIDDLE_X].parties.push({
    partyType: PARTY_TYPE_DOOR,
    tile: [LEVEL_MIDDLE_X, LEVEL_DIMENSION + LEVEL_SPACING - 1],
    orientated: ORIENTATION_SOUTH,
    members: [{
      ...BASE_PARTY_MEMBER,
      entity: {
        entityType: ENTITY_TYPE_DOOR,
        purpose: ENTITY_PURPOSE_DOOR,
        renderables: entityRenderables[ENTITY_TYPE_DOOR][REGULAR_DOOR_VARIANT],
        variation: REGULAR_DOOR_VARIANT,
      },
    }],
  });  

  // set orientations
  iterateLevelParties(tiles, (party) => {
    const orientation = getFavorableOrientation(party, tiles);
    party.orientated = orientation;
    party.members.forEach((partyMember, i) => {
      if (partyMember) {
        const [position, rotation] = getTargetPositionAndRotations(party, i);
        partyMember['zr'] = rotation;
        partyMember['p'] = position as Vector3;
      }
    })
  });

  // fake entrance door
  tiles[0][LEVEL_MIDDLE_X].parties.push({
    partyType: PARTY_TYPE_FLOOR,
    tile: [LEVEL_MIDDLE_X, 0],
    members: [{
      ...BASE_PARTY_MEMBER,
      ['p']: [LEVEL_MIDDLE_X, -.4, 0],
      ['zr']: -CONST_PI_ON_2_2DP,
      entity: {
        entityType: ENTITY_TYPE_DOOR,
        purpose: ENTITY_PURPOSE_USELESS,
        renderables: entityRenderables[ENTITY_TYPE_DOOR][REGULAR_DOOR_VARIANT],
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
        && (party.partyType == PARTY_TYPE_HOSTILE || party.partyType == PARTY_TYPE_ITEM && party.members.every(m => !m || m.entity.purpose == ENTITY_PURPOSE_ACTOR)) 
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
  const maxHealth = (color < 3 ? 3 : color > 3 ? 4 : 2);
  const maxPower = 5 - maxHealth;

  return {
    res: [
      {
        quantity: maxHealth,
        maxim: maxHealth,
      }, {
        quantity: 0,
        maxim: maxPower,
      },
      {
        quantity: 0,
      }
    ],
    purpose: ENTITY_PURPOSE_ACTOR,
    side: 0,
    renderables: renderables[color],
    entityType: ENTITY_TYPE_MARINE,
    variation: color,
    attacks: FLAG_USE_ATTACK_MATRICES
        ? 
          [
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
                [ATTACK_POWER_DRAIN, ATTACK_POWER_DRAIN, ATTACK_MOVE_MEDIAL], // enemy front row, same side
              ], 
              // attacker in back row
              [
                // running strike
                , // front row, same side
                , // front row, opposide side
                [ATTACK_MOVE_MEDIAL], // back row, same side
                , // back row, opposite side
                [ATTACK_POWER_DRAIN, ATTACK_POWER_DRAIN, ATTACK_MOVE_MEDIAL], // enemy front row, same side
              ], 
            ],
            // power level 2
            [
              // attacker in front row
              [
                // crack heads together
                , // front row, same side
                , // front row, opposide side
                , // back row, same side
                , // back row, opposite side
                [ATTACK_POWER_DRAIN, ATTACK_POWER_DRAIN, ATTACK_MOVE_LATERAL], // enemy front row, same side
                [ATTACK_POWER_DRAIN, ATTACK_POWER_DRAIN], // enemy front row, opposite side
              ], 
            ],

          ]
        : arrayFromBase64<Attack[][][][]>([...('<<?;^:::;^=::<^_<?::::<Z^?::;^:<Z^')],4),
  };
}

const createGun = (renderables: EntityRenderables[][], gunType: EntityTypeShotgun | EntityTypePistol, attackType: Attack): WeaponEntity => {
  const bonusAttacks = attackType == ATTACK_ELECTRIC ? [ATTACK_POWER_DRAIN] : attackType == ATTACK_POISON ? [ATTACK_POISON] : [];
  return gunType == ENTITY_TYPE_PISTOL
    ? {
      renderables: renderables[gunType][attackType],
      entityType: ENTITY_TYPE_PISTOL,
      purpose: ENTITY_PURPOSE_WEAPON,
      attacks: FLAG_USE_ATTACK_MATRICES
        ? [
            // power level 0
            [
              // attacker in front row
              [
                // pistol whip (feels good)
                [ATTACK_MOVE_MEDIAL, ATTACK_POWER_GAIN], // front row, same side
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
                [...bonusAttacks, attackType], // enemy front row, same side
              ], 
              // attacker in back row
              [
                // shoot
                , // front row, same side
                , // front row, opposide side
                , // back row, same side
                , // back row, opposite side
                [...bonusAttacks, attackType], // enemy front row, same side
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
                [...bonusAttacks, attackType, attackType], // enemy front row, same side
              ], 
              // attacker in back row
              [
                // spray clip
                , // front row, same side
                , // front row, opposide side
                , // back row, same side
                , // back row, opposite side
                [...bonusAttacks, attackType], // enemy front row, same side
                , // enemy front row, opposite side
                [...bonusAttacks, attackType], // enemy back row, same side
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
                [...bonusAttacks, attackType, attackType, attackType], // enemy front row, same side
              ], 
              // attacker in back row
              [
                // spray clip
                , // front row, same side
                , // front row, opposide side
                , // back row, same side
                , // back row, opposite side
                [...bonusAttacks, attackType], // enemy front row, same side
                [...bonusAttacks, attackType], // enemy front row, opposite side
                [...bonusAttacks, attackType], // enemy back row, same side
                [...bonusAttacks, attackType], // enemy back row, opposite side
              ],
            ],      
          ]
        : arrayFromBase64<Attack[][][][]>([...('><?;^:::;`=::<__<?::::;Y?::::;Y<?::::<YYA::::;Y:;Y<?::::=YYYA::::<YY:<YY')],4,[attackType]),
    }
    : {
      entityType: ENTITY_TYPE_SHOTGUN,
      purpose: ENTITY_PURPOSE_WEAPON,
      renderables: renderables[gunType][attackType],
      attacks: FLAG_USE_ATTACK_MATRICES
        ? [
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
                [...bonusAttacks, attackType, attackType, ATTACK_MOVE_MEDIAL], // enemy front row, same side
              ], 
              // attacker in back row
              [
                // buckshot
                , // front row, same side
                , // front row, opposide side
                , // back row, same side
                , // back row, opposite side
                [...bonusAttacks, attackType], // enemy front row, same side    
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
                [...bonusAttacks, attackType, attackType, ATTACK_MOVE_MEDIAL], // enemy front row, same side
                [...bonusAttacks, attackType, attackType, ATTACK_MOVE_MEDIAL], // enemy front row, opposite side
              ], 
              // attacker in back row
              [
                // buckshot
                , // front row, same side
                , // front row, opposide side
                , // back row, same side
                , // back row, opposite side
                [...bonusAttacks, attackType], // enemy front row, same side
                [...bonusAttacks, attackType], // enemy front row, opposite side
              ], 
            ],
          ]
        : arrayFromBase64<Attack[][][][]>([...('=<;<__=::<__<?;^:::=ZZ^?::::;Z<@;^:::=ZZ^=ZZ^@::::;Z;Z')],4)
    };
};

const convertAttackMatrixToString = (matrix: (Attack | -1)[][][][], name: string) => {
  const s = arrayToBase64(matrix, 4);
  console.log(`attack ${name} : "${s}"`);
  return s;
};