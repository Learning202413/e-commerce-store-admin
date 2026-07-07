const BASE_URL = '/api/v1';

// Helper to get auth headers
const getHeaders = (requireAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (requireAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Error handler helper
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const textData = await response.text();
      if (textData) {
        try {
          const errorData = JSON.parse(textData);
          errorMessage = errorData.detail || errorData.message || textData;
        } catch (e) {
          errorMessage = textData;
        }
      }
    } catch (e) {
      console.error("Error reading response text", e);
    }
    throw new Error(errorMessage);
  }
  
  if (response.status === 204) return null;
  
  try {
    const textData = await response.text();
    if (!textData) return null;
    
    try {
      return JSON.parse(textData);
    } catch(e) {
      return textData;
    }
  } catch (e) {
    return null;
  }
};

export const authService = {
  login: async (username, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      // The API returns the token in the Authorization header according to the postman test script
      const authHeader = response.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        localStorage.setItem('token', token);
        return { token };
      }
    }
    return handleResponse(response);
  },
  
  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getProfile: async () => {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: getHeaders(true)
    });
    return handleResponse(response);
  }
};

export const catalogService = {
  getAllProducts: async () => {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  
  getProductById: async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getProductsByIds: async (ids) => {
    const query = ids.map(id => `ids=${id}`).join('&');
    const response = await fetch(`${BASE_URL}/products/by-ids?${query}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  addProduct: async (productData) => {
    const response = await fetch(`${BASE_URL}/products/add`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  increaseStock: async (stockData) => {
    const response = await fetch(`${BASE_URL}/products/increase-stock`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stockData)
    });
    return handleResponse(response);
  },

  decreaseStock: async (stockData) => {
    const response = await fetch(`${BASE_URL}/products/decrease-stock`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stockData)
    });
    return handleResponse(response);
  }
};

export const reviewService = {
  getProductReviews: async (productId) => {
    const response = await fetch(`${BASE_URL}/reviews/products/${productId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  
  getTopProductReviews: async (max = 5) => {
    const response = await fetch(`${BASE_URL}/reviews/products/top?max=${max}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getUserReviews: async () => {
    const response = await fetch(`${BASE_URL}/reviews/users/me`, {
      method: 'GET',
      headers: getHeaders(true)
    });
    return handleResponse(response);
  },
  
  addReview: async (reviewData) => {
    const response = await fetch(`${BASE_URL}/reviews/users/me`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(reviewData)
    });
    return handleResponse(response);
  },

  deleteReview: async (reviewId) => {
    const response = await fetch(`${BASE_URL}/reviews/users/me/${reviewId}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return handleResponse(response);
  }
};

export const orderService = {
  placeOrder: async (products) => {
    // Expected structure for products: [{ productId, quantity }]
    const response = await fetch(`${BASE_URL}/orders/users/me`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ products })
    });
    return handleResponse(response);
  },
  
  getOrderById: async (orderId) => {
    const response = await fetch(`${BASE_URL}/orders/users/me/${orderId}`, {
      method: 'GET',
      headers: getHeaders(true)
    });
    return handleResponse(response);
  }
};
