import EventEmitter from 'bare-events';

export enum EventTypes {
  ONLINE = 'platform-online',
  OFFLINE = 'platform-offline',
  ON_PROCESS_QUEUE = 'on-process-queue',
  ON_PROCESS_QUEUE_COMPLETE = 'on-process-queue-complete',
  ON_ADD_TO_QUEUE = 'on-add-to-queue',
  ON_DELETE_FROM_QUEUE = 'on-delete-from-queue',
  DATA_SYNC = 'on-platform-sync-data',
  
}

export class EventManager {
  private eventEmitter = new EventEmitter();
  constructor() {}

  public on(eventType: string, callback: (...args: unknown[]) => void): void {
    this.eventEmitter.on(eventType, callback);
  }

  public emit(eventType: string, ...args: unknown[]): void {
    console.log(eventType, args , 'emitting event');
    this.eventEmitter.emit(eventType, ...args);
  }

  public off(event: EventTypes, listener: () => void): void {
    this.eventEmitter.off(event, listener);
  }
}
