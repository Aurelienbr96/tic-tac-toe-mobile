import React, {useEffect, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import XSVG from './svg/XSVG';
import OSVG from './svg/OSVG';
import {getBorderStyle} from '../utils/getBorderStyle';
import LSVG from './svg/LSVG';

import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';
import {
  Board,
  PlayerType,
  WinnerStringStateType,
} from '../types/tic-tac-toe.domain-model';

type Props = {
  player: PlayerType;
  winner: WinnerStringStateType;
  ticTacToeState: Board;
  turn: string;
  handleSetNextMove: (irow: number, icell: number, value: 'x' | 'o') => void;
};

export const TicTacToeBoard = ({
  player,
  winner,
  ticTacToeState,
  turn,
  handleSetNextMove,
}: Props) => {
  const translateY = useSharedValue(-500);
  const viewOpacity = useSharedValue(0);

  const prevWinnerRef = useRef<string>();

  useEffect(() => {
    if (winner !== 'none') {
      translateY.value = withSpring(translateY.value - 500);
      viewOpacity.value = withSpring(1);
    } else if (winner === 'none' && prevWinnerRef.current !== 'none') {
      translateY.value = withSpring(translateY.value + 500);
      viewOpacity.value = withSpring(0);
    }
  }, [viewOpacity, translateY, winner]);
  if (!player) {
    return null;
  }
  return (
    <Animated.View
      className="mt-20 flex-row justify-center items-center flex-wrap relative"
      style={[{transform: [{translateY: translateY}]}]}>
      {ticTacToeState.map((titac, irow) =>
        titac.map((tic, icell) => (
          <TouchableOpacity
            key={icell}
            activeOpacity={1}
            onPress={() => {
              const canClick =
                ticTacToeState[irow][icell] === '' &&
                winner === 'none' &&
                player !== undefined &&
                turn === player;

              if (canClick) {
                handleSetNextMove(irow, icell, player);
              }
            }}
            className={`w-[120px] flex-row h-[100px] border-4 z-30 border-dark-green items-center justify-center ${getBorderStyle(
              irow,
              icell,
            )}`}>
            {tic === 'x' ? <XSVG /> : tic === 'o' ? <OSVG /> : null}
          </TouchableOpacity>
        )),
      )}
      <LSVG winner={winner} />
    </Animated.View>
  );
};
