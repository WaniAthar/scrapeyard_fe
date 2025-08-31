// src/api/playground-api.ts
interface PlaygroundScrapeRequest {
    url: string;
    user_prompt: string;
    schema: string;
  }
  
  interface PlaygroundResponse {
    data: any;
    status: string;
    message: string;
    request_id?: string;
  }
  
  export class PlaygroundApiError extends Error {
    constructor(
      message: string, 
      public statusCode?: number, 
      public details?: any
    ) {
      super(message);
      this.name = 'PlaygroundApiError';
    }
  }
  
  
  export const scrapePlayground = async (
    request: PlaygroundScrapeRequest
  ): Promise<PlaygroundResponse> => {
    const apiUrl = import.meta.env.VITE_PLAYGROUND_URL || 'http://localhost:8001';
    
    try {
      const response = await fetch(`${apiUrl}/scrape/playground`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(request),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        // Handle different types of errors
        switch (response.status) {
          case 429:
            throw new PlaygroundApiError(
              'Rate limit exceeded. Please wait a minute before trying again.',
              429,
              responseData
            );
          case 400:
            throw new PlaygroundApiError(
              responseData.detail || 'Invalid request parameters',
              400,
              responseData
            );
          case 408:
            throw new PlaygroundApiError(
              'Request timed out. The website might be slow to respond.',
              408,
              responseData
            );
          case 503:
            throw new PlaygroundApiError(
              'Could not connect to the target website. Please check the URL.',
              503,
              responseData
            );
          default:
            throw new PlaygroundApiError(
              responseData.detail || 'An unexpected error occurred',
              response.status,
              responseData
            );
        }
      }
  
      return responseData;
    } catch (error) {
      if (error instanceof PlaygroundApiError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new PlaygroundApiError(
          'Network error. Please check your connection and try again.',
          0,
          error
        );
      }
      
      throw new PlaygroundApiError(
        'An unexpected error occurred',
        0,
        error
      );
    }
  };
  