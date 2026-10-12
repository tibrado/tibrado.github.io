import React from 'react';

type Props = React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
    imgUrl?: string;
}; 

export const BasePin: React.FC<Props> = ({
    size = 48,
    color = 'blue',
    imgUrl,
    className = '',
    ...props
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox='0 0 200 200'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={className}
            {...props}
        >
            {/* Image Def */}
            <defs>
                <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
                    {/* Drops the shadow blurred frame offset down and right */}
                    <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="5"
                        floodColor="#000000"
                        floodOpacity="1"
                    />
                </filter>

                {imgUrl ? (
                    <pattern
                        id='pinHeadImage'
                        x='0'
                        y='0'
                        width='1'
                        height='1'
                        patternContentUnits='objectBoundingBox'
                    >
                        <image
                            href={imgUrl}
                            x='0.1'
                            y='0.1'
                            width='0.8'
                            height='0.8'
                            preserveAspectRatio='xMidYMid meet'
                        />
                    </pattern>
                ) : null}
            </defs>

            {/* Oval / Circular Base */}
            <path
                d='M 110,150 A 30,11 0 1,1 90,150 Z'
                fill='#0000003d'
                transform='translate(0,25)'
            />

            {/* Pin Head */}
            <rect
                x='45'
                y='50'
                width='110'
                height='100'
                r='40'
                fill={color}
                stroke='white'
                strokeWidth={6}
                rx='5'
                filter='url(#pinShadow)'
            />

            {/* Pin Needle */}
            <rect
                x='93'
                y='140'
                width='14'
                height='40'
                r='40'
                fill={color}
                stroke='white'
                strokeWidth={6}
                rx='8'
            />

            <rect
                x='90'
                y='127'
                width='20'
                height='20'
                r='40'
                fill={color}
            />

            <rect
                x='55'
                y='55'
                width='90'
                height='90'
                r='40'
                fill={'url(#pinHeadImage)'}
            />

        </svg>
    );
};

export default BasePin;