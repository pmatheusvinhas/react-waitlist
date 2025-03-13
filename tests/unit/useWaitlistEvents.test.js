import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useWaitlistEvents } from '../../src/hooks/useWaitlistEvents';
import { eventBus } from '../../src/core/events';

// Mock eventBus
jest.mock('../../src/core/events', () => {
  const mockSubscribe = jest.fn().mockReturnValue(jest.fn());
  const mockSubscribeToMany = jest.fn().mockReturnValue(jest.fn());
  const mockEmit = jest.fn();
  
  return {
    __esModule: true,
    eventBus: {
      subscribe: mockSubscribe,
      subscribeToMany: mockSubscribeToMany,
      emit: mockEmit
    }
  };
});

describe('useWaitlistEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should provide subscribe method', () => {
    const { result } = renderHook(() => useWaitlistEvents());
    const mockHandler = jest.fn();
    
    result.current.subscribe('field_focus', mockHandler);
    
    expect(eventBus.subscribe).toHaveBeenCalledWith('field_focus', mockHandler);
  });
  
  test('should provide subscribeToMany method', () => {
    const { result } = renderHook(() => useWaitlistEvents());
    const mockHandler = jest.fn();
    const eventTypes = ['field_focus', 'submit', 'success'];
    
    result.current.subscribeToMany(eventTypes, mockHandler);
    
    expect(eventBus.subscribeToMany).toHaveBeenCalledWith(eventTypes, mockHandler);
  });
  
  test('should provide emit method', () => {
    const { result } = renderHook(() => useWaitlistEvents());
    const eventData = { 
      type: 'field_focus', 
      timestamp: new Date().toISOString() 
    };
    
    result.current.emit(eventData);
    
    expect(eventBus.emit).toHaveBeenCalledWith(eventData);
  });
  
  test('should provide emitFieldFocus method', () => {
    const { result } = renderHook(() => useWaitlistEvents());
    
    result.current.emitFieldFocus('email');
    
    expect(eventBus.emit).toHaveBeenCalledWith(expect.objectContaining({
      type: 'field_focus',
      field: 'email'
    }));
  });
  
  test('should provide emitSubmit method', () => {
    const { result } = renderHook(() => useWaitlistEvents());
    const formData = { email: 'test@example.com' };
    
    result.current.emitSubmit(formData);
    
    expect(eventBus.emit).toHaveBeenCalledWith(expect.objectContaining({
      type: 'submit',
      formData
    }));
  });
  
  test('should provide emitSuccess method', () => {
    const { result } = renderHook(() => useWaitlistEvents());
    const formData = { email: 'test@example.com' };
    const response = { id: 'test-id' };
    
    result.current.emitSuccess(formData, response);
    
    expect(eventBus.emit).toHaveBeenCalledWith(expect.objectContaining({
      type: 'success',
      formData,
      response
    }));
  });
  
  test('should provide emitError method', () => {
    const { result } = renderHook(() => useWaitlistEvents());
    const formData = { email: 'test@example.com' };
    const error = new Error('Test error');
    
    result.current.emitError(formData, error);
    
    expect(eventBus.emit).toHaveBeenCalledWith(expect.objectContaining({
      type: 'error',
      formData,
      error: expect.objectContaining({
        message: 'Test error'
      })
    }));
  });
}); 