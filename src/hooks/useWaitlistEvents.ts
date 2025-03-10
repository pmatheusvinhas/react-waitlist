import { useEffect, useRef } from 'react';
import { WaitlistEventType, WaitlistEventData, EventManager } from '../utils/events';

/**
 * Hook for subscribing to waitlist events
 * @param eventManager Event manager instance
 * @param eventTypes Array of event types to subscribe to
 * @param handler Function to call when any of the events occur
 * @param deps Dependencies array for the effect
 */
export const useWaitlistEvents = (
  eventManager: EventManager,
  eventTypes: WaitlistEventType[],
  handler: (data: WaitlistEventData) => void,
  deps: any[] = []
): void => {
  // Use a ref to store the handler to avoid unnecessary effect triggers
  const handlerRef = useRef(handler);
  
  // Update the handler ref when the handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);
  
  // Subscribe to events
  useEffect(() => {
    if (!eventManager) return;
    
    // Create a wrapper that calls the current handler
    const handlerWrapper = (data: WaitlistEventData) => {
      handlerRef.current(data);
    };
    
    // Subscribe to events
    const unsubscribe = eventManager.subscribeToMany(eventTypes, handlerWrapper);
    
    // Unsubscribe when the component unmounts or dependencies change
    return unsubscribe;
  }, [eventManager, eventTypes, ...deps]);
}; 