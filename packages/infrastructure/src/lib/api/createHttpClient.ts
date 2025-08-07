// shared/infra/api/apiClient.ts
import axios from "axios";
import { ApiClient } from "@leasing/domain";
import { HttpParams } from "./http.type.js";

const TOKEN_CONFIG = {
    header: 'Authorization',
    prefix: 'Bearer'
}

export const createHttpClient = ({ baseURL, token, onUnauthorized }: HttpParams): ApiClient => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (token) {
        instance.interceptors.request.use((config) => {
            config.headers[`${TOKEN_CONFIG.header}`] = `${TOKEN_CONFIG.prefix} ${token}`;
            return config;
        });
    }

    instance.interceptors.response.use(
        (res) => res,
        async (err) => {
            const originalConfig = err.config;
            const isUnauthorized = err?.response?.status === 401 && !originalConfig._retry;

            if (isUnauthorized) {
                originalConfig._retry = true;
                onUnauthorized?.();
            }

            return Promise.reject(err);
        }
    );

    return {
        get: async <T>(url: string) => {
            const response = await instance.get<T>(url);
            return response.data;
        },

        post: async <T>(url: string, data: unknown) => {
            const response = await instance.post<T>(url, data);
            return response.data;
        },

        patch: async <T>(url: string, data: unknown) => {
            const response = await instance.patch<T>(url, data);
            return response.data;
        }
    };
};
