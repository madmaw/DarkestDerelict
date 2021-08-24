type GameEventTypeMove = 0;
const GAME_EVENT_TYPE_MOVE: GameEventTypeMove = 0;
type GameEventMove = {
  type: GameEventTypeMove,

}

type GameEventType = GameEventTypeMove;
type GameEvent = GameEventMove;

type Game = {
  actionQueue: EventQueue<GameEvent, void>,
  levels: Level[], 
};