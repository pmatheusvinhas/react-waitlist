import { useEffect, useRef, useMemo } from 'react';
import { WaitlistEventType, WaitlistEventData, EventManager, createEventManager } from '../utils/events';

/**
 * Hook for managing waitlist events
 * @returns Object with eventManager and utility methods
 */
export const useWaitlistEvents = () => {
  // Create a single instance of the event manager
  const eventManager = useMemo(() => createEventManager(), []);

  // Return the event manager and utility methods
  return {
    eventManager,
    
    /**
     * Subscribe to an event
     * @param type Type of event to subscribe to
     * @param handler Function to call when the event occurs
     * @returns Function to unsubscribe
     */
    subscribe: (type: WaitlistEventType, handler: (data: WaitlistEventData) => void) => {
      return eventManager.subscribe(type, handler);
    },
    
    /**
     * Subscribe to multiple event types
     * @param types Array of event types to subscribe to
     * @param handler Function to call when any of the events occur
     * @returns Function to unsubscribe from all events
     */
    subscribeToMany: (types: WaitlistEventType[], handler: (data: WaitlistEventData) => void) => {
      return eventManager.subscribeToMany(types, handler);
    },
    
    /**
     * Emit an event
     * @param data Event data
     */
    emit: (data: WaitlistEventData) => {
      eventManager.emit(data);
    }
  };
}; 