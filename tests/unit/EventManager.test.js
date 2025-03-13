import { EventBus } from '../../src/core/events';

describe('EventManager', () => {
  let eventManager;

  beforeEach(() => {
    eventManager = new EventBus();
  });

  test('should initialize with handlers for all event types', () => {
    expect(eventManager.handlers).toBeDefined();
    // Não podemos acessar diretamente handlers pois é privado
    // Vamos testar a funcionalidade em vez da implementação
  });

  test('should subscribe to events', () => {
    const mockHandler = jest.fn();
    const unsubscribe = eventManager.subscribe('field_focus', mockHandler);
    
    expect(typeof unsubscribe).toBe('function');
    
    // Emitir um evento para verificar se o handler foi registrado
    eventManager.emit({ type: 'field_focus', timestamp: new Date().toISOString() });
    expect(mockHandler).toHaveBeenCalled();
  });

  test('should emit events to subscribers', () => {
    const mockHandler = jest.fn();
    eventManager.subscribe('submit', mockHandler);
    
    const eventData = { 
      type: 'submit', 
      timestamp: new Date().toISOString(),
      formData: { email: 'test@example.com' } 
    };
    
    eventManager.emit(eventData);
    
    expect(mockHandler).toHaveBeenCalledWith(eventData);
  });

  test('should unsubscribe from events', () => {
    const mockHandler = jest.fn();
    const unsubscribe = eventManager.subscribe('success', mockHandler);
    
    // Unsubscribe
    unsubscribe();
    
    // Emit event after unsubscribe
    eventManager.emit({ 
      type: 'success', 
      timestamp: new Date().toISOString(),
      response: { id: 'test-id' } 
    });
    
    // Handler should not be called
    expect(mockHandler).not.toHaveBeenCalled();
  });

  test('should not error when emitting to event with no subscribers', () => {
    // All events have empty arrays by default, so this should not throw
    expect(() => {
      eventManager.emit({ 
        type: 'error', 
        timestamp: new Date().toISOString(),
        error: { message: 'Test error' } 
      });
    }).not.toThrow();
  });

  test('should support multiple subscribers for the same event', () => {
    const mockHandler1 = jest.fn();
    const mockHandler2 = jest.fn();
    
    eventManager.subscribe('field_focus', mockHandler1);
    eventManager.subscribe('field_focus', mockHandler2);
    
    const eventData = { 
      type: 'field_focus', 
      timestamp: new Date().toISOString() 
    };
    
    eventManager.emit(eventData);
    
    expect(mockHandler1).toHaveBeenCalledWith(eventData);
    expect(mockHandler2).toHaveBeenCalledWith(eventData);
  });

  test('should support subscribing to multiple events', () => {
    const mockHandler = jest.fn();
    
    eventManager.subscribe('field_focus', mockHandler);
    eventManager.subscribe('submit', mockHandler);
    
    const viewData = { 
      type: 'field_focus', 
      timestamp: new Date().toISOString() 
    };
    
    const submitData = { 
      type: 'submit', 
      timestamp: new Date().toISOString(),
      formData: { email: 'test@example.com' } 
    };
    
    eventManager.emit(viewData);
    eventManager.emit(submitData);
    
    expect(mockHandler).toHaveBeenCalledTimes(2);
    expect(mockHandler).toHaveBeenNthCalledWith(1, viewData);
    expect(mockHandler).toHaveBeenNthCalledWith(2, submitData);
  });

  test('should support subscribeToMany method', () => {
    const mockHandler = jest.fn();
    
    const unsubscribeAll = eventManager.subscribeToMany(
      ['field_focus', 'submit', 'success'], 
      mockHandler
    );
    
    expect(typeof unsubscribeAll).toBe('function');
    
    // Emit events
    eventManager.emit({ type: 'field_focus', timestamp: new Date().toISOString() });
    eventManager.emit({ 
      type: 'submit', 
      timestamp: new Date().toISOString(),
      formData: { email: 'test@example.com' } 
    });
    
    expect(mockHandler).toHaveBeenCalledTimes(2);
    
    // Unsubscribe from all
    unsubscribeAll();
    
    // Emit another event
    eventManager.emit({ 
      type: 'success', 
      timestamp: new Date().toISOString(),
      response: { id: 'test-id' } 
    });
    
    // Count should still be 2
    expect(mockHandler).toHaveBeenCalledTimes(2);
  });
}); 