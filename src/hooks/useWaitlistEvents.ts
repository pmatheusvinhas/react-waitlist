import { useCallback } from 'react';
import { eventBus, WaitlistEventType, WaitlistEventData, WaitlistEventHandler } from '../core/events';

/**
 * Hook for using the waitlist event bus
 */
export const useWaitlistEvents = () => {
  /**
   * Subscribe to an event
   */
  const subscribe = useCallback((type: WaitlistEventType, handler: WaitlistEventHandler) => {
    return eventBus.subscribe(type, handler);
  }, []);

  /**
   * Subscribe to multiple events
   */
  const subscribeToMany = useCallback((types: WaitlistEventType[], handler: WaitlistEventHandler) => {
    return eventBus.subscribeToMany(types, handler);
  }, []);

  /**
   * Emit an event
   */
  const emit = useCallback((data: WaitlistEventData) => {
    eventBus.emit(data);
  }, []);

  /**
   * Emit a field focus event
   */
  const emitFieldFocus = useCallback((field: string) => {
    eventBus.emit({
      type: 'field_focus',
      timestamp: new Date().toISOString(),
      field,
    });
  }, []);

  /**
   * Emit a submit event
   */
  const emitSubmit = useCallback((formData: Record<string, any>) => {
    eventBus.emit({
      type: 'submit',
      timestamp: new Date().toISOString(),
      formData,
    });
  }, []);

  /**
   * Emit a success event
   */
  const emitSuccess = useCallback((formData: Record<string, any>, response: any) => {
    eventBus.emit({
      type: 'success',
      timestamp: new Date().toISOString(),
      formData,
      response,
    });
  }, []);

  /**
   * Emit an error event
   */
  const emitError = useCallback((formData: Record<string, any>, error: Error) => {
    eventBus.emit({
      type: 'error',
      timestamp: new Date().toISOString(),
      formData,
      error: {
        message: error.message,
        code: (error as any).code,
      },
    });
  }, []);

  /**
   * Emit a security event
   */
  const emitSecurity = useCallback((securityType: string, details: Record<string, any>) => {
    eventBus.emit({
      type: 'security',
      timestamp: new Date().toISOString(),
      securityType,
      details,
    });
  }, []);

  return {
    subscribe,
    subscribeToMany,
    emit,
    emitFieldFocus,
    emitSubmit,
    emitSuccess,
    emitError,
    emitSecurity,
  };
}; 