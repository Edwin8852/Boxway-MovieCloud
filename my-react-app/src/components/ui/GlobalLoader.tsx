import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '@/context/LoadingContext';

const GlobalLoader: React.FC = () => {
    const { isFullPageLoading } = useLoading();

    return (
        <AnimatePresence>
            {isFullPageLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Architectural Spinner */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="w-16 h-16 border-t-2 border-r-2 border-primary rounded-full mb-6"
                        />

                        {/* Branding/Text */}
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center"
                        >
                            <h2 className="text-xl font-display font-black tracking-tighter uppercase">Boxway</h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] mt-1 font-bold">Synchronizing Data</p>
                        </motion.div>

                        {/* Subtle Progress Bar */}
                        <motion.div
                            className="absolute -bottom-12 w-48 h-[1px] bg-border overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <motion.div
                                className="h-full bg-primary"
                                animate={{
                                    x: ["-100%", "100%"]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalLoader;
