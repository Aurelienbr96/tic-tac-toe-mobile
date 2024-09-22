/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';
import WebSocketService from '../infra/socket';
import {
  FirstMessage,
  InformationMessage,
  Message,
  MessageToSend,
} from '../types/tic-tac-toe.socket-model';
import {
  Board,
  PlayerType,
  WinnerStringStateType,
} from '../types/tic-tac-toe.domain-model';

export type HandleBoardUpdateInputType = {
  nextPlayer: 0 | 1;
  board: Board;
  winner: WinnerStringStateType;
};

export type HandleSetPlayerEventInputType = {
  player: PlayerType;
};

type AdapterInput = {
  handleBoardUpdateEvent: ({
    nextPlayer,
    board,
    winner,
  }: HandleBoardUpdateInputType) => void;
  handleOnCloseConnection: () => void;
  handleSetPlayerEvent: ({player}: HandleSetPlayerEventInputType) => void;
};

export const useWebSocketAdapter = ({
  handleBoardUpdateEvent,
  handleSetPlayerEvent,
  handleOnCloseConnection,
}: AdapterInput) => {
  const socket = WebSocketService.getInstance();

  const handleMessage = (data: Message | FirstMessage | InformationMessage) => {
    if (data.type === 'board_update') {
      handleBoardUpdateEvent({
        nextPlayer: data.nextPlayer,
        board: data.board,
        winner: data.winner,
      });
    }
    if (data.type === 'set-player') {
      handleSetPlayerEvent({
        player: data.player,
      });
    }
  };

  const connect = (callback: () => void) => {
    socket.connect('ws://192.168.0.24:8080/ws').then(() => {
      socket.onReceiveMessage(msg => handleMessage(msg));
      socket.onCloseConnection(handleOnCloseConnection);
      callback();
    });
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.closeConnection();
      }
    };
  }, []);

  const handleSetNextMove = (irow: number, icell: number, value: 'x' | 'o') => {
    socket.sendMessage({x: irow, y: icell, m: value});
  };

  const handleResetState = () => {
    const messageToSend: MessageToSend = {x: 0, y: 0, m: 'reset_board'};
    socket.sendMessage(messageToSend);
  };

  return {
    handleSetNextMove,
    handleResetState,
    connect,
    handleOnCloseConnection: socket.onCloseConnection,
  };
};
