import React, {useState, useMemo} from 'react';

import {Text, TouchableOpacity, View} from 'react-native';

import {GameInformations} from './components/GameInformations';
import {WaitingRoom} from './components/WaitingRoom';
import {WinningBoard} from './components/WinningBoard';
import {TicTacToeBoard} from './components/TicTacToeBoard';

import {
  HandleBoardUpdateInputType,
  HandleSetPlayerEventInputType,
  useWebSocketAdapter,
} from './adapter/react-web-socket.adapter';
import {
  Board,
  defaultState,
  PlayerType,
  WinnerStringStateType,
} from './types/tic-tac-toe.domain-model';

function Game(): React.JSX.Element {
  const [player, setPlayer] = useState<PlayerType>();
  const [nextPlayer, setNextPlayer] = useState<0 | 1>(0);
  const [isLookingForAPlayer, setIsLookingForAPlayer] = useState(false);

  const [ticTacToeState, setTicTacToeState] = useState<Board>(defaultState);
  const [winner, setWinner] = useState<WinnerStringStateType>('none');

  const turn = useMemo(() => (nextPlayer === 0 ? 'x' : 'o'), [nextPlayer]);

  const handleBoardUpdateEvent = (obj: HandleBoardUpdateInputType) => {
    setWinner(obj.winner);
    setNextPlayer(obj.nextPlayer);
    setTicTacToeState(obj.board);
  };

  const handleSetPlayerEvent = (obj: HandleSetPlayerEventInputType) => {
    setPlayer(obj.player);
  };

  const handleSetIsLookingForAPlayer = () => {
    setIsLookingForAPlayer(prev => !prev);
  };

  const {handleResetState, handleSetNextMove, connect} = useWebSocketAdapter({
    handleBoardUpdateEvent,
    handleSetPlayerEvent,
    handleOnCloseConnection: handleSetIsLookingForAPlayer,
  });

  const handleFindPlayer = () => {
    connect(handleSetIsLookingForAPlayer);
  };

  return (
    <View className="h-screen items-center bg-green pt-20">
      {isLookingForAPlayer ? (
        <WaitingRoom player={player} />
      ) : (
        <TouchableOpacity onPress={handleFindPlayer}>
          <Text>Find a player</Text>
        </TouchableOpacity>
      )}
      <GameInformations winner={winner} player={player} turn={turn} />
      <TicTacToeBoard
        player={player}
        winner={winner}
        handleSetNextMove={handleSetNextMove}
        ticTacToeState={ticTacToeState}
        turn={turn}
      />
      <WinningBoard winner={winner} handleResetState={handleResetState} />
    </View>
  );
}

export default Game;
