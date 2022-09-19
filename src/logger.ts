import { io, Socket } from 'socket.io-client';

const METHODS = ['log', 'info', 'warn', 'error', 'debug', 'group', 'groupCollapsed', 'groupEnd'];

export class Logger {
  private socket: Socket;

  constructor(protected room: string) {
    this.socket = io('https://beefy.getgas.org');
  }

  start() {
    this.hookConsole();
  }

  hookConsole() {
    for (const method of METHODS) {
      this.hookConsoleMethod(method);
    }
  }

  hookConsoleMethod(method: string) {
    const originalMethod = window.console[method];
    window.console[method] = (...args) => {
      this.send(method, args);
      originalMethod.apply(window.console, args);
    };
  }

  send(method, args) {
    this.socket.emit('write', {
      room: this.room,
      method,
      args,
    });
  }
}
