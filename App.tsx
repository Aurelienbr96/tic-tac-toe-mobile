import React, {useEffect, useRef, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import XSVG from './components/XSVG';
import OSVG from './components/OSVG';
import {getBorderStyle} from './utils/getBorderStyle';
import LSVG from './components/LSVG';

const defaultState = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

type Board = string[][];

export type winnerStringStateType = 'x' | 'draw' | 'o' | 'none';

type Message = {
  type: 'board_update' | 'finish';
  board: Board;
  winner: winnerStringStateType;
  nextPlayer: 0 | 1;
};
type FirstMessage = {
  type: 'set-player';
  player: 'x' | 'o';
};

type InformationMessage = {
  type: 'waiting_room' | 'information';
  message: string;
};

type MessageToSend = {
  x: number;
  y: number;
  m: 'x' | 'o' | 'reset_board';
};

function App(): React.JSX.Element {
  const [player, setPlayer] = useState<'o' | 'x' | undefined>();
  const [nextPlayer, setNextPlayer] = useState<0 | 1>(0);
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsconnected] = useState(false);
  const [winner, setWinner] = useState<winnerStringStateType>('none');
  const prevWinnerRef = useRef<string>();
  const [ticTacToeState, setTicTacToeState] = useState<Board>(defaultState);
  const turn = nextPlayer === 0 ? 'x' : 'o';

  const handleSetNextMove = (irow: number, icell: number, value: 'x' | 'o') => {
    if (isConnected && socket.current) {
      const messageToSend: MessageToSend = {x: irow, y: icell, m: value};

      socket.current.send(JSON.stringify(messageToSend));
    }
  };

  const translateY = useSharedValue(-500);
  const viewOpacity = useSharedValue(0);

  const handleMessage = (data: Message | FirstMessage | InformationMessage) => {
    if (data.type === 'board_update') {
      setNextPlayer(data.nextPlayer);
      setTicTacToeState(data.board);
      setWinner(data.winner);
    }
    if (data.type === 'set-player') {
      setPlayer(data.player);
    }
  };

  useEffect(() => {
    socket.current = new WebSocket('ws://192.168.0.24:8080/ws');

    socket.current.onopen = () => {
      console.log('WebSocket connected');
      setIsconnected(true);
      // Send a message once the connection is open
    };

    // Handle errors
    socket.current.onerror = error => {
      console.log('WebSocket Error: ', error.message);
    };

    // Handle connection closed
    socket.current.onclose = event => {
      setIsconnected(false);
      console.log('WebSocket connection closed:', event.code, event.reason);
    };

    socket.current.onmessage = event => {
      console.log('received', event);
      const data: Message = JSON.parse(event.data);
      handleMessage(data);
    };

    // Clean up on component unmount
    return () => {
      if (socket.current) {
        socket.current.close();
        socket.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (winner !== 'none') {
      translateY.value = withSpring(translateY.value - 500);
      viewOpacity.value = withSpring(1);
    } else if (winner === 'none' && prevWinnerRef.current !== 'none') {
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
    if (isConnected && socket.current) {
      const messageToSend: MessageToSend = {x: 0, y: 0, m: 'reset_board'};
      console.log(messageToSend);
      socket.current.send(JSON.stringify(messageToSend));
    }
  };

  return (
    <View className="h-screen items-center bg-green pt-20">
      {winner === 'none' && player && (
        <View>
          <Text>You are: {player}</Text>
          <Text>Next turn: {turn}</Text>
        </View>
      )}
      {!player && (
        <View>
          <Text>Looking for a player please wait...</Text>
          <ActivityIndicator />
        </View>
      )}
      {player && (
        <Animated.View
          className="mt-20 flex-row justify-center items-center flex-wrap relative"
          style={[{transform: [{translateY}]}]}>
          {ticTacToeState.map((titac, irow) =>
            titac.map((tic, icell) => (
              <TouchableOpacity
                key={icell}
                activeOpacity={1}
                onPress={() => {
                  if (
                    ticTacToeState[irow][icell] === '' &&
                    winner === 'none' &&
                    player !== undefined &&
                    turn === player
                  ) {
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
      )}
      {winner !== 'none' && (
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
