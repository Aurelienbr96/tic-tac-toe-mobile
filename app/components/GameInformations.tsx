import React from 'react';
import {Text, View} from 'react-native';
import {
  PlayerType,
  WinnerStringStateType,
} from '../types/tic-tac-toe.domain-model';

type Props = {
  player: PlayerType;
  winner: WinnerStringStateType;
  turn: string;
};

export const GameInformations = ({winner, player, turn}: Props) => {
  if (winner !== 'none' || !player) {
    return null;
  }
  return (
    <View>
      <Text>You are: {player}</Text>
      <Text>Next turn: {turn}</Text>
    </View>
  );
};
