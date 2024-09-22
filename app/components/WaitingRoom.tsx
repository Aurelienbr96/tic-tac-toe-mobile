import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {PlayerType} from '../types/tic-tac-toe.domain-model';

type Props = {
  player: PlayerType;
};

export const WaitingRoom = ({player}: Props) => {
  if (player) {
    return null;
  }
  return (
    <View>
      <Text>Looking for a player please wait...</Text>
      <ActivityIndicator />
    </View>
  );
};
