import React, { useEffect, useRef, useState } from 'react';
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
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
    const [status, setStatus] = useState<string | undefined>(undefined)
	// const [isModelLoading, setIsModelLoading] = useState(true);

    const startVideo = async () => {
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({
                video: {facingMode: 'environment'}
            });

            if(videoRef.current){
                videoRef.current.srcObject = streamRef.current; 
            }
        } catch (err) {
            console.error("Fail to access webcam: ", err)
        }
    }; 

    const stopVideo = () => {
        console.log(msg, nope); 

        if(streamRef.current){
            streamRef.current.getTracks().forEach(t=> t.stop()); 
            streamRef.current = null; 
        }; 

        if( videoRef.current){
            videoRef.current.srcObject = null; 
        }
    }

	useEffect(() => {
        if(inputType === 'detect'){
            let animationFrameId: number;

            const runObjectDetection = async () => {
                // Initialize TensorFlow backend and load the model
                setStatus('loading model')
                await tf.ready();

                const model = await mobilenet.load();
                
                // setIsModelLoading(false);

                const detectFrame = async () => {
                    if (videoRef.current && videoRef.current.readyState === 4) {
                        // Classify the current video frame
                        const results: {className: string; probability: number}[] = await model.classify(videoRef.current);

                        // check for match 
                        const seen: string =  Object.values(results).map(r => r.className).join(','); 

                        if(results.length > 0){
                            setStatus(results[0].className.split(',')[0])
                        }
                        
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

    // Unmount 
    useEffect(() => {
        return () => {
            stopVideo()
        }
    }, []); 

	return (
        <>
            <style>
                { `
                    @keyframes scanAnimation 
                    {
                        0% { top: 2%;}
                        50% { top: 90%;}
                        100% {top: 2%;}
                    }
                `}
            </style>

            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '5px',
                    overflow: 'hidden'
                }}
            >        
            {/* THE SCANNING LINE */}
            <Box
                sx={{
                    position: 'absolute',
                    left: '5px',    
                    right: '5px',       
                    height: '5px',        
                    background: '#00ff3376', 
                    zIndex: 2,
                    pointerEvents: 'none',
                    animation: 'scanAnimation 10s ease-in-out infinite', 
                }}
            >
                <Typography 
                    sx={{   
                        fontFamily: 'Courier New, monospace',   
                        fontSize: '0.75rem',
                        letterSpacing: '1px',
                        color: '#f5faf6bf',
                        pl: '10px'                   
                    }}
                > 
                    {status}
                </Typography> 
            </Box>

            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ 
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '3px',
                        boxShadow: '1px 1px 10px #00FF33',
                        objectFit: 'cover',
                        zIndex: 1
                }}
                
            />
            </Box>
		</>
	);
};

export default ObjectClassifier;