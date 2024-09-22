import {Message, MessageToSend} from '../types/tic-tac-toe.socket-model';

class WebSocketService {
  static instance: WebSocketService | null = null;

  private socket: WebSocket | null;
  public isConnected: boolean = false;

  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(url: string) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          resolve(this.socket);
        };

        this.socket.onerror = error => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
          reject(error);
        };

        this.socket.onclose = () => {
          console.log('WebSocket closed');
          this.isConnected = false;
        };
      } else {
        resolve(this.socket);
      }
    });
  }

  public onCloseConnection(callback: () => void) {
    if (!this.socket) {
      throw new Error('No socket instance found');
    }
    this.socket.onclose = () => callback;
  }

  public sendMessage(message: MessageToSend) {
    if (!this.socket) {
      throw new Error('No socket instance found');
    }
    this.socket.send(JSON.stringify(message));
  }

  public onReceiveMessage(callback: (msg: Message) => void) {
    if (!this.socket) {
      throw new Error('No socket instance found');
    }
    this.socket.onmessage = event => {
      const data: Message = JSON.parse(event.data);
      callback(data);
    };
  }

  public closeConnection() {
    if (!this.socket) {
      throw new Error('No socket instance found');
    }
    this.socket.close();
  }
}

export default WebSocketService;
