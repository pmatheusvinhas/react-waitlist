/**
 * Types of events that can be emitted by the waitlist component
 */
export type WaitlistEventType = 'field_focus' | 'submit' | 'success' | 'error' | 'security';

/**
 * Data structure for events
 */
export interface WaitlistEventData {
  /** Type of event */
  type: WaitlistEventType;
  /** Timestamp of the event */
  timestamp: string;
  /** Field name (for field_focus events) */
  field?: string;
  /** Form data (for submit, success, error events) */
  formData?: Record<string, any>;
  /** Response from API (for success events) */
  response?: any;
  /** Error information (for error events) */
  error?: {
    message: string;
    code?: string;
  };
  /** Security type (for security events) */
  securityType?: string;
  /** Security details (for security events) */
  details?: Record<string, any>;
}

/**
 * Event handler function type
 */
export type WaitlistEventHandler = (data: WaitlistEventData) => void;

/**
 * Event bus for handling waitlist events
 */
export class EventBus {
  private handlers: Record<WaitlistEventType, WaitlistEventHandler[]> = {
    field_focus: [],
    submit: [],
    success: [],
    error: [],
    security: [],
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

// Singleton instance that can be shared
export const eventBus = new EventBus(); 