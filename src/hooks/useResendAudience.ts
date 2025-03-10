import { useState } from 'react';
import { Resend } from 'resend';

/**
 * Contact data for Resend API
 */
export interface ResendContact {
  /** Email address */
  email: string;
  /** First name */
  firstName?: string;
  /** Last name */
  lastName?: string;
  /** Whether the contact is unsubscribed */
  unsubscribed?: boolean;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Response from Resend API
 */
export interface ResendResponse {
  /** ID of the created/updated contact */
  id: string;
  /** Email of the contact */
  email: string;
  /** First name of the contact */
  firstName?: string;
  /** Last name of the contact */
  lastName?: string;
  /** Whether the contact is unsubscribed */
  unsubscribed: boolean;
  /** Created at timestamp */
  createdAt: string;
  /** Updated at timestamp */
  updatedAt: string;
}

/**
 * Hook options
 */
export interface UseResendAudienceOptions {
  /** Resend API key */
  apiKey?: string;
  /** Audience ID */
  audienceId: string;
  /** Proxy endpoint for client-side usage */
  proxyEndpoint?: string;
}

/**
 * Hook return value
 */
export interface UseResendAudienceReturn {
  /** Add a contact to the audience */
  addContact: (contact: ResendContact) => Promise<ResendResponse>;
  /** Update a contact in the audience */
  updateContact: (id: string, contact: Partial<ResendContact>) => Promise<ResendResponse>;
  /** Remove a contact from the audience */
  removeContact: (id: string) => Promise<void>;
  /** Get a contact from the audience */
  getContact: (id: string) => Promise<ResendResponse>;
  /** List contacts in the audience */
  listContacts: () => Promise<ResendResponse[]>;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
}

/**
 * Hook for Resend audience integration
 */
export const useResendAudience = (
  options: UseResendAudienceOptions
): UseResendAudienceReturn => {
  const { apiKey, audienceId, proxyEndpoint } = options;
  
  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize Resend client if API key is provided
  const resendClient = apiKey ? new Resend(apiKey) : null;
  
  /**
   * Make a request to the Resend API
   */
  const makeRequest = async <T>(
    action: 'create' | 'update' | 'remove' | 'get' | 'list',
    data?: any
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (proxyEndpoint) {
        // Use proxy endpoint for client-side
        const endpoint = '/audiences/contacts';
        let method = 'POST';
        
        if (action === 'update') {
          method = 'PATCH';
        } else if (action === 'remove') {
          method = 'DELETE';
        } else if (action === 'get' || action === 'list') {
          method = 'GET';
        }
        
        response = await fetch(`${proxyEndpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: data ? JSON.stringify({
            action,
            audienceId,
            ...data
          }) : undefined,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to make request to Resend API');
        }
        
        const responseData = await response.json();
        return responseData as T;
      } else if (resendClient) {
        // Use Resend SDK for server-side
        let result;
        
        switch (action) {
          case 'create':
            result = await resendClient.contacts.create({
              ...data,
              audienceId,
            });
            break;
          case 'update':
            result = await resendClient.contacts.update({
              ...data,
              audienceId,
            });
            break;
          case 'remove':
            result = await resendClient.contacts.remove({
              ...data,
              audienceId,
            });
            break;
          case 'get':
            result = await resendClient.contacts.get({
              ...data,
              audienceId,
            });
            break;
          case 'list':
            result = await resendClient.contacts.list({
              audienceId,
            });
            break;
          default:
            throw new Error('Invalid action');
        }
        
        return result as unknown as T;
      } else {
        throw new Error('Either apiKey or proxyEndpoint must be provided');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Add a contact to the audience
   */
  const addContact = async (contact: ResendContact): Promise<ResendResponse> => {
    return makeRequest<ResendResponse>('create', contact);
  };
  
  /**
   * Update a contact in the audience
   */
  const updateContact = async (
    id: string,
    contact: Partial<ResendContact>
  ): Promise<ResendResponse> => {
    return makeRequest<ResendResponse>('update', {
      id,
      ...contact,
    });
  };
  
  /**
   * Remove a contact from the audience
   */
  const removeContact = async (id: string): Promise<void> => {
    return makeRequest<void>('remove', { id });
  };
  
  /**
   * Get a contact from the audience
   */
  const getContact = async (id: string): Promise<ResendResponse> => {
    return makeRequest<ResendResponse>('get', { id });
  };
  
  /**
   * List contacts in the audience
   */
  const listContacts = async (): Promise<ResendResponse[]> => {
    const response = await makeRequest<{ data: ResendResponse[] }>('list');
    return response.data;
  };
  
  return {
    addContact,
    updateContact,
    removeContact,
    getContact,
    listContacts,
    loading,
    error,
  };
}; 