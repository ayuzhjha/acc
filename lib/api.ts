if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
}

if (process.env.NODE_ENV === 'production') {
    return 'https://acm-backend-u2ng.onrender.com';
}

return 'http://localhost:5000';
};

export const API_URL = getApiUrl();
