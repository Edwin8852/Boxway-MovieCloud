import React, { useEffect } from 'react';
import api from '@/services/api';
import { useLoading } from '@/context/LoadingContext';

export const AxiosLoadingInterceptor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { startApiLoading, stopApiLoading } = useLoading();
    const minDelay = 400; // Prevent flickering on fast requests

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use((config) => {
            const requestId = `${config.method}-${config.url}-${Date.now()}`;
            (config as any)._requestId = requestId;
            (config as any)._startTime = Date.now();

            startApiLoading(requestId);
            return config;
        });

        const responseInterceptor = api.interceptors.response.use(
            (response) => {
                const config = response.config as any;
                const duration = Date.now() - config._startTime;
                const delay = Math.max(0, minDelay - duration);

                setTimeout(() => {
                    stopApiLoading(config._requestId);
                }, delay);

                return response;
            },
            (error) => {
                const config = error.config as any;
                if (config) {
                    const duration = Date.now() - config._startTime;
                    const delay = Math.max(0, minDelay - duration);

                    setTimeout(() => {
                        stopApiLoading(config._requestId);
                    }, delay);
                } else {
                    // Fallback if config is missing (rare)
                    stopApiLoading();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [startApiLoading, stopApiLoading]);

    return <>{children}</>;
};
