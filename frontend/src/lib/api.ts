import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Axios request interceptor to add admin token to headers
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('adminToken');
    if (token && window.location.pathname.startsWith('/admin')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Axios response interceptor to handle expired/invalid token
api.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');

      // Avoid infinite redirect loop
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);


export const login = async (email: string, password: string) => {
    try{
        const response = await api.post('/auth/admin/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const createAdmin = async (adminData: any) => {
    try {
        const response = await api.post('/admin', adminData);
        return response.data;
    } catch (error) {
        console.error('Create admin error:', error);
        throw error;
    }
};

export const getAdmins = async () => {
    try {
        const response = await api.get('/admin');
        return response.data;
    } catch (error) {
        console.error('Get admins error:', error);
        throw error;
    }
};

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error('Get products error:', error);
        throw error;
    }
};

// Products now fetched client-side via useProducts hook

export const getProductCount = async () => {
    try {
        const response = await api.get('/products/count');
        console.log('Product count response:', response.data);
        return response.data.count;
    } catch (error) {
        console.error('Get product count error:', error);
        return 0;
    }
};

export const getProductById = async (id: string) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get product by ID error:', error);
        throw error;
    }
};

export const createProduct = async (formData: FormData, token?: string) => {
    try {
        const response = await api.post('/products', formData, {
            headers: {
                Authorization: `Bearer ${token || localStorage.getItem('adminToken')}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Create product error:', error);
        throw error;
    }
};

export const updateProduct = async (id: string, productData: any, token: string) => {
    try {
        const response = await api.patch(`/products/${id}`, productData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Update product error:', error);
        throw error;
    }
};

export const deleteProduct = async (id: string, token: string) => {
    try {
        const response = await api.delete(`/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Delete product error:', error);
        throw error;
    }
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderById = async (id: string) => {
    try {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get order by ID error:', error);
        throw error;
    }
};

export const getBlogs = async () => {
    try {
        const response = await api.get('/blog');
        return response.data;
    } catch (error) {
        console.error('Get blogs error:', error);
        throw error;
    }
};

export const getAdminById = async (id: string) => {
    try {
        const response = await api.get(`/admin/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get admin by ID error:', error);
        throw error;
    }
};

export const updateAdmin = async (id: string, adminData: any) => {
    try {
        const response = await api.patch(`/admin/${id}`, adminData);
        return response.data;
    } catch (error) {
        console.error('Update admin error:', error);
        throw error;
    }
};

export const deleteAdmin = async (id: string) => {
    try {
        const response = await api.delete(`/admin/${id}`);
        return response.data;
    } catch (error) {
        console.error('Delete admin error:', error);
        throw error;
    }
};

export const getAdminUser = async () => {
    try {
        const response = await api.get('/auth/admin');
        return response.data;
    } catch (error) {
        console.error('Error fetching admin user:', error);
        throw error;
    }
};



export default api;
