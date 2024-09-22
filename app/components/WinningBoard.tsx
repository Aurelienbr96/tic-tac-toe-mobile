import React, {useEffect} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {WinnerStringStateType} from '../types/tic-tac-toe.domain-model';

type Props = {
  winner: WinnerStringStateType;
  handleResetState: () => void;
};

export const WinningBoard = ({winner, handleResetState}: Props) => {
  const viewOpacity = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      opacity: viewOpacity.value,
    };
  });

  useEffect(() => {
    if (winner !== 'none') {
      viewOpacity.value = withSpring(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  if (winner === 'none') {
    return null;
  }
  return (
    <Animated.View className="absolute top-[250px]" style={style}>
      <Text className="text-xl">
        {winner === 'draw' ? 'draw' : 'Winner:' + winner}
      </Text>
      <TouchableOpacity onPress={handleResetState}>
        <Text className="text-center">play again</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
