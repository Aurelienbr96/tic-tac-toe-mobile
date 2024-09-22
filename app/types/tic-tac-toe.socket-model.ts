import {Board, WinnerStringStateType} from './tic-tac-toe.domain-model';

export type Message = {
  type: 'board_update' | 'finish';
  board: Board;
  winner: WinnerStringStateType;
  nextPlayer: 0 | 1;
};
export type FirstMessage = {
  type: 'set-player';
  player: 'x' | 'o';
};

export type InformationMessage = {
  type: 'waiting_room' | 'information';
  message: string;
};

export type MessageToSend = {
  x: number;
  y: number;
  m: 'x' | 'o' | 'reset_board';
};
