import { EventManager, EventTypes } from '../src/EventManager';
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';


describe('EventManager', () => {
  let eventManager: EventManager;
  let mockCallback: Mock;

  beforeEach(() => {
    eventManager = new EventManager();
    mockCallback = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should listen to an event and call the callback when the event is emitted', () => {
    const eventType = EventTypes.ON_ADD_TO_QUEUE;

    // Add the listener for the event
    eventManager.on(eventType, mockCallback);

    // Emit the event
    eventManager.emit(eventType);

    // Check if the callback is called
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should emit an event with arguments and pass them to the listener', () => {
    const eventType = EventTypes.ON_ADD_TO_QUEUE;
    const arg1 = 'data1';
    const arg2 = 'data2';

    // Add the listener for the event
    eventManager.on(eventType, mockCallback);

    // Emit the event with arguments
    eventManager.emit(eventType, arg1, arg2);

    // Check if the callback is called with the correct arguments
    expect(mockCallback).toHaveBeenCalledWith(arg1, arg2);
  });

  it('should not call the callback if the event is not emitted', () => {
    const eventType = EventTypes.ON_ADD_TO_QUEUE;

    // Add the listener for the event
    eventManager.on(eventType, mockCallback);

    // Emit a different event
    eventManager.emit(EventTypes.ON_DELETE_FROM_QUEUE);

    // Check that the callback was not called
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should remove the listener when off is called', () => {
    const eventType = EventTypes.ON_ADD_TO_QUEUE;

    // Add the listener for the event
    eventManager.on(eventType, mockCallback);

    // Remove the listener
    eventManager.off(eventType, mockCallback);

    // Emit the event
    eventManager.emit(eventType);

    // Check that the callback was not called after removal
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should allow multiple listeners for the same event', () => {
    const eventType = EventTypes.ON_ADD_TO_QUEUE;
    const mockCallback2 = vi.fn();

    // Add two listeners for the event
    eventManager.on(eventType, mockCallback);
    eventManager.on(eventType, mockCallback2);

    // Emit the event
    eventManager.emit(eventType);

    // Check that both callbacks are called
    expect(mockCallback).toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalled();
  });
});
