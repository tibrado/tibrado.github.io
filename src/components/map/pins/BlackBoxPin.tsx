import React from 'react';

type Props = React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
    imgUrl?: string;
}; 

export const BlackBoxPin: React.FC<Props> = ({
    size = 200,
    color = '#ffd104',
    imgUrl = '/icon.png',
    ...props
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox='0 0 200 200'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
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
                        floodColor="#000002"
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
                            width='0.6'
                            height='0.6'
                            preserveAspectRatio='xMidYMid meet'
                        />
                    </pattern>
                ) : null}
            </defs>


            {/* Border Shadow */}
            <rect
                x='45'
                y='50'
                width='110'
                height='100'
                r='40'
                fill={'#00000077'}
                stroke={color}
                strokeWidth={3}
                rx='5'
                filter='url(#pinShadow)'
            />

            <rect
                x='62.5'
                y='62.5'
                r='40'
                width='90'
                height='90'
                fill={'url(#pinHeadImage)'}
            />

        </svg>
    );
};

export default BlackBoxPin;