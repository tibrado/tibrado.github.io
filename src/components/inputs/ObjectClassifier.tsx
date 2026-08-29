import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import {Box, Typography} from '@mui/material'; 


type Props = {
    OnSubmit: (v: boolean, p: number) => void; 
    responses: string[];
    hint?: string; 
}


const ObjectClassifier: React.FC<Props> = ({OnSubmit, responses, hint}) => {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
    const [status, setStatus] = useState<string | undefined>(undefined)
    
    const handleObjectDetection = (codes: string[]): boolean => {
        if(codes.length < 0) return false; 
        
        // check for wild card
        if(responses.includes("-")) return true;

        codes = codes.map(c => c.toLocaleLowerCase());

        const code_set = new Set(codes.flatMap(v => v.split(','))); 
        console.log(hint); 
        
        return responses.some(v => code_set.has(v)); 
    }; 

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
        if(streamRef.current){
            streamRef.current.getTracks().forEach(t=> t.stop()); 
            streamRef.current = null; 
        }; 

        if( videoRef.current){
            videoRef.current.srcObject = null; 
        }
    }

    // Mount
	useEffect(() => {
        let animationFrameId: number;
        let isMounted: boolean = true;
        let activeStream: MediaStream | null = null; 

        if(activeStream){
            
        }

        const runObjectDetection = async () => {
            try{
                // Initialize TensorFlow backend and load the model
                setStatus('loading model')
                await tf.ready();
                const model = await mobilenet.load();
                
                if(!isMounted) return; 

                // start video
                if (videoRef.current && videoRef.current.srcObject){
                    activeStream = videoRef.current.srcObject as MediaStream; 
                }; 

                const detectFrame = async () => {
                    if(!isMounted) return; 

                    if (videoRef.current && videoRef.current.readyState === 4) {
                        // Classify the current video frame
                        const results: {className: string; probability: number}[] = await model.classify(videoRef.current);
                        const seen: string[] = results.flatMap(v => v.className.toLocaleLowerCase().split(',')); 
                        
                        if(handleObjectDetection(seen)){
                            OnSubmit(true, 0);
                        }
                    }
                    // Loop the detection

                    animationFrameId = requestAnimationFrame(detectFrame);
                };

                detectFrame();
            } catch (error){
                console.error('Model loading or detection failed:', error); 
            }
        };

        startVideo();
        runObjectDetection();

        // Cleanup when component unmounts
        return () => {
            isMounted = false;
            cancelAnimationFrame(animationFrameId);
            stopVideo();
        };
	}, []);

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