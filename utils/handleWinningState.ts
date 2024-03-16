import {winnerStringStateType} from '../App';

export const handleWinningState = (
  ticTacToeState: string[][],
  handleSetWinner: (newWinner: winnerStringStateType) => void,
  winner: winnerStringStateType | undefined,
) => {
  // check rows
  for (let row = 0; row < ticTacToeState.length; row++) {
    if (
      ticTacToeState[row][0] !== '' &&
      ticTacToeState[row][0] === ticTacToeState[row][1] &&
      ticTacToeState[row][1] === ticTacToeState[row][2]
    ) {
      handleSetWinner(ticTacToeState[row][0] as winnerStringStateType);
      return;
    }
  }
  // check cols
  for (let col = 0; col < ticTacToeState.length; col++) {
    if (
      ticTacToeState[0][col] !== '' &&
      ticTacToeState[0][col] === ticTacToeState[1][col] &&
      ticTacToeState[1][col] === ticTacToeState[2][col]
    ) {
      handleSetWinner(ticTacToeState[0][col] as winnerStringStateType);
      return;
    }
  }

  // check diag
  if (
    ticTacToeState[0][0] !== '' &&
    ticTacToeState[0][0] === ticTacToeState[1][1] &&
    ticTacToeState[2][2] === ticTacToeState[1][1]
  ) {
    handleSetWinner(ticTacToeState[0][0] as winnerStringStateType);
    return;
  }

  if (
    ticTacToeState[0][2] !== '' &&
    ticTacToeState[0][2] === ticTacToeState[1][1] &&
    ticTacToeState[2][0] === ticTacToeState[1][1]
  ) {
    handleSetWinner(ticTacToeState[0][2] as winnerStringStateType);
    return;
  }

  const size = ticTacToeState.length;
  let emptyFound = false;

  // check draw
  for (let i = 0; i < size && !emptyFound; i++) {
    for (let j = 0; j < size; j++) {
      if (ticTacToeState[i][j] === '') {
        emptyFound = true;
        break;
      }
    }
  }

  if (!emptyFound && !winner) {
    handleSetWinner('draw');
  }
};
