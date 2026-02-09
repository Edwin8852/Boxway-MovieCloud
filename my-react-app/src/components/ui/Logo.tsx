import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 32 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Boxway Premium Logo design */}
            {/* Single path for perfect sharp corners, no 'folded' appearance */}
            {/* Main Frame: Bottom-center -> Bottom-left -> Top-left -> Top-right -> Right-center */}
            <path
                d="M22 32 H8 V8 H32 V22"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="butt"
                strokeLinejoin="miter"
            />

            {/* Red Accent Corner: Right-bottom -> Corner -> Bottom-right */}
            <path
                d="M32 27 V32 H27"
                stroke="#D22D2D"
                strokeWidth="3"
                strokeLinecap="butt"
                strokeLinejoin="miter"
            />
        </svg>
    );
};

export default Logo;
