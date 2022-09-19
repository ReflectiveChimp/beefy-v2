import { io, Socket } from 'socket.io-client';

const METHODS = ['log', 'info', 'warn', 'error', 'debug', 'group', 'groupCollapsed', 'groupEnd'];

export class Logger {
  private socket: Socket;

  constructor(protected room: string) {
    this.socket = io('https://beefy.getgas.org');
  }

  start() {
    this.hookConsole();
    this.logWindowEvents();
  }

  logWindowEvents() {
    ['DOMContentLoaded', 'load'].forEach(event =>
      window.addEventListener(event, () => console.debug('window', event))
    );
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
