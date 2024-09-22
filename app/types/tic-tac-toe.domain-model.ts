export const defaultState = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

export type Board = string[][];

export type WinnerStringStateType = 'x' | 'draw' | 'o' | 'none';

export type PlayerType = 'o' | 'x' | undefined;
