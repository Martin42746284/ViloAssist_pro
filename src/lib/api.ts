// src/lib/api.ts

const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = `${RAW_BASE_URL}/api`;

// Interface pour standardiser les réponses d'erreur
interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export const api = {
  async request(endpoint: string, method: string, data?: any): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Log pour débogage
    console.debug(`API Call: ${method} ${url}`, data ? { data } : '');

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Ajout automatique du token si disponible
        ...(localStorage.getItem('token') && {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }),
      },
      credentials: 'include',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      // Log de la réponse brute
      console.debug(`API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: await response.text() || 'Unknown error' };
        }

        // Log complet de l'erreur
        console.error(`API Error [${response.status}]:`, {
          url,
          status: response.status,
          error: errorData,
        });

        const error: ApiError = {
          message: errorData.message || `Request failed with status ${response.status}`,
          status: response.status,
          details: errorData.details || errorData,
        };

        throw error;
      }

      return await response.json();
    } catch (error) {
      // Gestion des erreurs réseau ou autres
      console.error('API Request Failed:', {
        url,
        error: error instanceof Error ? error.message : error,
      });

      throw {
        message: 'Network error or API unreachable',
        details: error,
      } as ApiError;
    }
  },

  get(endpoint: string) {
    return this.request(endpoint, 'GET');
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, 'POST', data);
  },

  put(endpoint: string, data: any) {
    return this.request(endpoint, 'PUT', data);
  },

  delete(endpoint: string) {
    return this.request(endpoint, 'DELETE');
  },
};