/**
 * Types of events that can be emitted by the waitlist component
 */
export type WaitlistEventType = 'view' | 'submit' | 'success' | 'error';

/**
 * Data structure for events
 */
export interface WaitlistEventData {
  /** Type of event */
  type: WaitlistEventType;
  /** Timestamp of the event */
  timestamp: string;
  /** Form data (for submit, success, error events) */
  formData?: Record<string, any>;
  /** Response from Resend API (for success events) */
  response?: any;
  /** Error information (for error events) */
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * Event handler function type
 */
export type WaitlistEventHandler = (data: WaitlistEventData) => void;

/**
 * Event manager for handling waitlist events
 */
export class EventManager {
  private handlers: Record<WaitlistEventType, WaitlistEventHandler[]> = {
    view: [],
    submit: [],
    success: [],
    error: [],
  };

  /**
   * Subscribe to an event
   * @param type Type of event to subscribe to
   * @param handler Function to call when the event occurs
   * @returns Function to unsubscribe
   */
  public subscribe(type: WaitlistEventType, handler: WaitlistEventHandler): () => void {
    this.handlers[type].push(handler);
    
    // Return unsubscribe function
    return () => {
      this.handlers[type] = this.handlers[type].filter(h => h !== handler);
    };
  }

  /**
   * Subscribe to multiple event types
   * @param types Array of event types to subscribe to
   * @param handler Function to call when any of the events occur
   * @returns Function to unsubscribe from all events
   */
  public subscribeToMany(types: WaitlistEventType[], handler: WaitlistEventHandler): () => void {
    const unsubscribers = types.map(type => this.subscribe(type, handler));
    
    // Return function that unsubscribes from all events
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }

  /**
   * Emit an event
   * @param data Event data
   */
  public emit(data: WaitlistEventData): void {
    const { type } = data;
    this.handlers[type].forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${type} event:`, error);
      }
    });
  }
}

/**
 * Create a new event manager
 */
export const createEventManager = (): EventManager => {
  return new EventManager();
}; 