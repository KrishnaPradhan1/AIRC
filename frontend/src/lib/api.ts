import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

export const login = async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const signup = async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const createJob = async (jobData: any) => {
    const response = await api.post('/jobs/', jobData);
    return response.data;
};

export const getJobs = async () => {
    const response = await api.get('/jobs/');
    return response.data;
};

export const getJob = async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
};

export const applyJob = async (jobId: string, file: File) => {
    const formData = new FormData();
    formData.append('job_id', jobId);
    formData.append('resume', file);

    const response = await api.post('/applications/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getMyApplications = async () => {
    const response = await api.get('/applications/my-applications');
    return response.data;
};

export const sendOtp = async (email: string) => {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
};

export const verifyOtp = async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
};

export const resetPassword = async (password: string) => {
    const response = await api.post('/auth/reset-password', { password });
    return response.data;
};

export const getJobApplications = async (jobId: number) => {
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};

export const updateProfile = async (data: any) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
};

export const applyForJob = async (jobId: number, resume: File) => {
    const formData = new FormData();
    formData.append('job_id', jobId.toString());
    formData.append('resume', resume);

    const response = await api.post('/applications/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const uploadResume = async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/resume/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getResume = async () => {
    const response = await api.get('/resume/');
    return response.data;
};

export const deleteJob = async (id: number) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
};

export const updateJob = async (id: number, data: any) => {
    const response = await api.put(`/jobs/${id}`, data);
    return response.data;
};

export const updateApplicationStatus = async (id: number, status: string) => {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
};
