import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useWaitlistEvents } from '../../src/hooks/useWaitlistEvents';
import { EventManager, createEventManager } from '../../src/utils/events';

// Mock EventManager
jest.mock('../../src/utils/events', () => {
  const mockSubscribe = jest.fn().mockReturnValue(jest.fn());
  const mockSubscribeToMany = jest.fn().mockReturnValue(jest.fn());
  const mockEmit = jest.fn();
  
  const mockEventManager = {
    subscribe: mockSubscribe,
    subscribeToMany: mockSubscribeToMany,
    emit: mockEmit
  };
  
  return {
    __esModule: true,
    EventManager: jest.fn().mockImplementation(() => mockEventManager),
    createEventManager: jest.fn().mockReturnValue(mockEventManager)
  };
});

describe('useWaitlistEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should return event manager instance', () => {
    const { result } = renderHook(() => useWaitlistEvents());
    
    expect(result.current.eventManager).toBeDefined();
    expect(createEventManager).toHaveBeenCalled();
  });
  
  test('should provide subscribe method', () => {
    const { result } = renderHook(() => useWaitlistEvents());
    const mockHandler = jest.fn();
    
    result.current.subscribe('view', mockHandler);
    
    expect(result.current.eventManager.subscribe).toHaveBeenCalledWith('view', mockHandler);
  });
  
  test('should provide subscribeToMany method', () => {
    const { result } = renderHook(() => useWaitlistEvents());
    const mockHandler = jest.fn();
    const eventTypes = ['view', 'submit', 'success'];
    
    result.current.subscribeToMany(eventTypes, mockHandler);
    
    expect(result.current.eventManager.subscribeToMany).toHaveBeenCalledWith(eventTypes, mockHandler);
  });
  
  test('should provide emit method', () => {
    const { result } = renderHook(() => useWaitlistEvents());
    const eventData = { 
      type: 'view', 
      timestamp: new Date().toISOString() 
    };
    
    result.current.emit(eventData);
    
    expect(result.current.eventManager.emit).toHaveBeenCalledWith(eventData);
  });
  
  test('should clean up subscriptions on unmount', () => {
    // Create an unsubscribe mock function
    const unsubscribeMock = jest.fn();
    
    // Override the subscribe behavior for this test only
    const mockSubscribe = jest.fn().mockReturnValue(unsubscribeMock);
    
    // Create an EventManager mock with custom behavior
    const mockEventManager = {
      subscribe: mockSubscribe,
      subscribeToMany: jest.fn(),
      emit: jest.fn()
    };
    
    // Override createEventManager for this test
    createEventManager.mockReturnValueOnce(mockEventManager);

    // Render the hook
    const { result, unmount } = renderHook(() => useWaitlistEvents());
    
    // Create a subscription
    const mockHandler = jest.fn();
    const unsubscribe = result.current.subscribe('view', mockHandler);
    
    // Verify subscribe was called
    expect(mockSubscribe).toHaveBeenCalledWith('view', mockHandler);
    
    // Verify the unsubscribe function was returned
    expect(unsubscribe).toBe(unsubscribeMock);
    
    // Unmount the hook
    unmount();
  });
  
  test('should handle multiple subscriptions', () => {
    // Create unsubscribe mock functions
    const unsubscribeMock1 = jest.fn();
    const unsubscribeMock2 = jest.fn();
    
    // Create a subscribe mock that returns different unsubscribe functions
    const mockSubscribe = jest.fn()
      .mockReturnValueOnce(unsubscribeMock1)
      .mockReturnValueOnce(unsubscribeMock2);
    
    // Create an EventManager mock with custom behavior
    const mockEventManager = {
      subscribe: mockSubscribe,
      subscribeToMany: jest.fn(),
      emit: jest.fn()
    };
    
    // Override createEventManager for this test
    createEventManager.mockReturnValueOnce(mockEventManager);

    // Render the hook
    const { result } = renderHook(() => useWaitlistEvents());

    // Create multiple subscriptions
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    const unsubscribe1 = result.current.subscribe('view', handler1);
    const unsubscribe2 = result.current.subscribe('submit', handler2);
    
    // Verify subscribe was called correctly
    expect(mockSubscribe).toHaveBeenCalledWith('view', handler1);
    expect(mockSubscribe).toHaveBeenCalledWith('submit', handler2);
    
    // Verify the unsubscribe functions were returned correctly
    expect(unsubscribe1).toBe(unsubscribeMock1);
    expect(unsubscribe2).toBe(unsubscribeMock2);
    
    // Call the unsubscribe functions
    unsubscribe1();
    unsubscribe2();
    
    // Verify the unsubscribe functions were called
    expect(unsubscribeMock1).toHaveBeenCalled();
    expect(unsubscribeMock2).toHaveBeenCalled();
  });
}); 