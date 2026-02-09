import React from 'react';

interface UserIconProps {
    className?: string;
    size?: number | string;
    color?: string;
    accentColor?: string;
}

const UserIcon: React.FC<UserIconProps> = ({
    className = '',
    size = 24,
    color = '#1F1F1F',
    accentColor = '#CFAE70'
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Inclusive, Gender-Neutral Silhouette */}
            {/* Geometric Head */}
            <circle
                cx="12"
                cy="8"
                r="3.5"
                stroke={color}
                strokeWidth="1.2"
            />

            {/* Minimal Architectural Shoulders */}
            <path
                d="M5 19C5 16.5 7.5 14.5 12 14.5C16.5 14.5 19 16.5 19 19"
                stroke={color}
                strokeWidth="1.2"
                strokeLinecap="square"
            />

            {/* Luxury Gold Architectural Detail (The 'Accent') */}
            <rect
                x="11.5"
                y="14.5"
                width="1"
                height="0.5"
                fill={accentColor}
            />
        </svg>
    );
};

export default UserIcon;
