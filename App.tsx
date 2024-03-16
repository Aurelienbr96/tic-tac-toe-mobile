import React, {useEffect, useRef, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {Text, View, TouchableOpacity} from 'react-native';
import XSVG from './components/XSVG';
import OSVG from './components/OSVG';
import {getBorderStyle} from './utils/getBorderStyle';
import {handleWinningState} from './utils/handleWinningState';

const defaultState = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

export type winnerStringStateType = 'x' | 'draw' | 'o';

function App(): React.JSX.Element {
  const [player, setPlayer] = useState<string>('x');
  const [winner, setWinner] = useState<winnerStringStateType>();
  const prevWinnerRef = useRef<string>();
  const [ticTacToeState, setTicTacToeState] =
    useState<Array<Array<string>>>(defaultState);

  const handleSetTicTacToeState = (
    irow: number,
    icell: number,
    value: string,
  ) => {
    setTicTacToeState(prevState => {
      const newState = prevState.map(row => [...row]);
      newState[irow][icell] = value;
      return newState;
    });
    setPlayer(prevState => (prevState === 'x' ? 'o' : 'x'));
  };
  const handleSetWinner = (newWinner: winnerStringStateType) => {
    setWinner(newWinner);
    prevWinnerRef.current = newWinner;
  };

  useEffect(
    () => handleWinningState(ticTacToeState, handleSetWinner, winner),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ticTacToeState],
  );

  const translateY = useSharedValue(0);
  const viewOpacity = useSharedValue(0);

  useEffect(() => {
    if (winner !== undefined) {
      translateY.value = withSpring(translateY.value - 500);
      viewOpacity.value = withSpring(1);
    } else if (winner === undefined && prevWinnerRef.current !== undefined) {
      translateY.value = withSpring(translateY.value + 500);
      viewOpacity.value = withSpring(0);
    }
  }, [viewOpacity, translateY, winner]);

  const opacity = useAnimatedStyle(() => {
    return {
      opacity: viewOpacity.value,
    };
  });

  const handleResetState = () => {
    setWinner(undefined);
    setTicTacToeState(defaultState);
  };

  return (
    <View className="h-screen items-center bg-green">
      <Animated.View
        className="mt-6 flex-row justify-center items-center flex-wrap relative"
        style={[{transform: [{translateY}]}]}>
        {ticTacToeState.map((titac, irow) =>
          titac.map((tic, icell) => (
            <TouchableOpacity
              key={icell}
              activeOpacity={1}
              onPress={() => {
                if (
                  ticTacToeState[irow][icell] === '' &&
                  winner === undefined
                ) {
                  handleSetTicTacToeState(irow, icell, player);
                }
              }}
              className={`w-[100px] flex-row h-[100px] border-4 z-30 border-dark-green items-center justify-center ${getBorderStyle(
                irow,
                icell,
              )}`}>
              {tic === 'x' ? <XSVG /> : tic === 'o' ? <OSVG /> : null}
            </TouchableOpacity>
          )),
        )}
      </Animated.View>
      {winner && (
        <Animated.View className="absolute top-[250px]" style={opacity}>
          <Text className="text-xl">
            {winner === 'draw' ? 'draw' : 'Winner:' + winner}
          </Text>
          <TouchableOpacity onPress={handleResetState}>
            <Text className="text-center">play again</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

export default App;
