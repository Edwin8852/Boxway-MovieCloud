import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface LoadingContextType {
    isFullPageLoading: boolean;
    isApiLoading: boolean;
    startFullPageLoading: (id?: string) => void;
    stopFullPageLoading: (id?: string) => void;
    startApiLoading: (id?: string) => void;
    stopApiLoading: (id?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isFullPageLoading, setIsFullPageLoading] = useState(false);
    const [isApiLoading, setIsApiLoading] = useState(false);

    // Use refs for reference counting to handle parallel requests correctly
    const fullPageLoaders = useRef<Set<string>>(new Set());
    const apiLoaders = useRef<Set<string>>(new Set());

    const startFullPageLoading = useCallback((id = 'default') => {
        fullPageLoaders.current.add(id);
        setIsFullPageLoading(true);
    }, []);

    const stopFullPageLoading = useCallback((id = 'default') => {
        fullPageLoaders.current.delete(id);
        if (fullPageLoaders.current.size === 0) {
            setIsFullPageLoading(false);
        }
    }, []);

    const startApiLoading = useCallback((id = 'default') => {
        apiLoaders.current.add(id);
        setIsApiLoading(true);
    }, []);

    const stopApiLoading = useCallback((id = 'default') => {
        apiLoaders.current.delete(id);
        if (apiLoaders.current.size === 0) {
            setIsApiLoading(false);
        }
    }, []);

    return (
        <LoadingContext.Provider
            value={{
                isFullPageLoading,
                isApiLoading,
                startFullPageLoading,
                stopFullPageLoading,
                startApiLoading,
                stopApiLoading,
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
