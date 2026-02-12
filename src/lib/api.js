import api from "./axios";

/* ================= AUTH ================= */

export const send_otp = async (payload) => {
    return api.post("/auth/register/send-otp", payload);
};
export const varfy_otp = async (payload) => {
    return api.post("/auth/register/verify-otp", payload);
};
export const login = async (payload) => {
    return api.post("/auth/login", payload);
};
export const logoutUser = async () => {
    return api.post("/auth/logout");
};
export const forgotPassword = async (payload) => {
    return api.post("/auth/forgot-password", payload);
};
export const resetPassword = async (token, payload) => {
    return api.put(`/auth/reset-password/${token}`, payload);
};
export const getUserMe = async () => {
    return api.get("/auth/me");
};
export const updatePassword = async (payload) => {
    return api.put("/auth/me", payload);
};

/* ================= public data ================= */
export const getSetupData = async () => api.get('/data');
export const sendContact = async (data) => api.post('/contact', data);
export const getProducts = async (page = 1, limit = 20, categoryId) => {
    const params = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    if (categoryId) params.categoryId = categoryId
    return await api.get("/products", { params })
}

/* ================= user cart ================= */

export const addToCart = async (data) => api.post('/cart/add', data);
export const getCart = async () => api.get('/cart');
export const updateCart = (data) => api.put('/cart/update', data);
export const removeCart = async (productId) => api.delete(`/cart/remove/${productId}`);
export const clearCart = async () => api.delete('/cart/clear');

/* ================= user location ================= */
export const getLocation = async () => api.get('/users/location/user');
export const addLocation = async (data) => api.post('/users/location', data);
export const deleteLocation = (id) => api.delete(`/users/location/${id}`);
export const setDefaultLocation = (id) => api.patch(`/users/location/${id}/default`);

/* ================= user location ================= */
export const getOrders = async (params = {}) => {
    const cleanParams = {}
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            cleanParams[key] = value
        }
    })
    return api.get("/orders/my", { params: cleanParams });
};

export const createOrders = async () => api.get('/orders');
export const cancelOrder = async (id) => api.patch(`/orders/${id}`);
export const getOrderById = (id) => api.get(`/orders/my/${id}`);
/* ================= products ================= */
export const getProductByID = async (id) => api.get(`/products/${id}`,);

export const getProductsByCat = (catId, params = {}) => {
    const cleanParams = {}
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            cleanParams[key] = value
        }
    })
    return api.get(`/categories/${catId}`, { params: cleanParams })
}
