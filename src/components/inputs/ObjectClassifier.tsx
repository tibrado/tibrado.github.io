import React, { useEffect, useRef } from 'react';
import type { InputTypes } from '../../assets/types';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import {Box, Typography} from '@mui/material'; 


type Props = {
    onSubmit: (text: string) => void; 
    inputType: InputTypes;
    msg?: string;
    nope?: boolean; 
}


const ObjectClassifier: React.FC<Props> = ({onSubmit, inputType, msg, nope}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	// const [isModelLoading, setIsModelLoading] = useState(true);

	useEffect(() => {
        if(inputType === 'detect'){
            let animationFrameId: number;

            const startVideo = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'environment' } 
                    });

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Error accessing webcam:", err);
                }
            };

            const runObjectDetection = async () => {
                // Initialize TensorFlow backend and load the model
                await tf.ready();

                const model = await mobilenet.load();
                
                // setIsModelLoading(false);

                const detectFrame = async () => {
                    if (videoRef.current && videoRef.current.readyState === 4) {
                        // Classify the current video frame
                        const results: {className: string; probability: number}[] = await model.classify(videoRef.current);

                        // check for match 
                        const seen: string =  Object.values(results).map(r => r.className).join(','); 

                        onSubmit(seen); 
                    }
                    // Loop the detection
                    animationFrameId = requestAnimationFrame(detectFrame);
                };

                detectFrame();
            };

            startVideo();
            runObjectDetection();

            // Cleanup when component unmounts
            return () => {
                cancelAnimationFrame(animationFrameId);
            };
        }
	}, [inputType]);

	return (
		<Box
			sx={{
					borderRadius: '5px',
					p: '4px',
					boxShadow: `0px 3px 10px ${true ? 'red' : 'rgba(255, 255, 255, 1)'}`,
					background: 'rgba(255, 255, 255, 1)'
			}}
		>
			<Typography 
					variant='caption'
					sx={{
							pl: 1, 
							alignContent: 'center',
							fontFamily: 'system-ui',
							textShadow: '0px 1px 5px rgba(0, 0, 0, 0.5)',
							color: `${nope ? 'red' : '#000000e1'}`
					}}
			>
				{`${msg}`}
			</Typography>
			<video
				ref={videoRef}
				autoPlay
				muted
				playsInline
				width="100%"
				height="100%"
				style={{ borderRadius: '8px', border: '2px solid #333' }}
			/>
		</Box>
		
	);
};

export default ObjectClassifier;