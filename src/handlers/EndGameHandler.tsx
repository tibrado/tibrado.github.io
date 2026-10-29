import React, { useEffect, useRef, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Rating,
    Button,
} from '@mui/material';
import {EmojiEvents, BarChart } from '@mui/icons-material';
import { Color } from '../assets/types';

interface RewardCardProps {
    gameName?: string;
    ranking?: string;
    score?: number | string;
    stars?: number;
    website?: string;
    collab?: string;
    imageUrl?: string;
}

export const RewardTradingCard: React.FC<RewardCardProps> = ({
    gameName = "Game Name Is really long",
    ranking = "25",
    score = "400",
    stars = 1,
    website = "www.scavenger.xyz",
    collab,
    imageUrl = 'https://gratisography.com/wp-content/uploads/2025/04/gratisography-cool-car-cat-800x525.jpg'
}) => {

    // Video & Camera 
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [image, setImage] = useState<any | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState<boolean>(false);

    // Styles 
    const sxIcon = { color: `${Color.gold}`, filter: 'drop-shadow(2px 2px 2px #000)' }; 
    const sxText = { fontWeight: 800, color: `${Color.gold}`, textShadow: '2px 2px 1px #000' }; 

    // Start Feed and mount component
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        startCamera();

        // Cleanup: Stop camera tracks when component unmounts
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            setError(null);
            
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: "user" } // "user" defaults to selfie camera
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            setCameraActive(true);
        } catch (err) {
            console.error("Camera access error:", err);
            setError("Please allow camera access to use the photo booth.");
        }
    };

    // Take a Pic 
    const takePhoto = () => {
        const video = videoRef.current;

        if (!video) return;

        // Create canvas
        const canvas = document.createElement('canvas');

        // match feed dimensions 
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        // Draw 2D context and draw the video frame
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert the canvas drawing to a base64 Data URL (image/png or image/jpeg)
            const photoDataUrl = canvas.toDataURL('image/png');

            // Save the photo 
            setImage(photoDataUrl);
        }
    };

    return (
        <>
            <Card
                sx={{
                    width: 320,
                    height: 460,
                    borderRadius: 4,
                    boxShadow: '0px 0px 10px #000',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    fontFamily: 'system-ui'
                }}
            >
                {/* Background Layer: Image fills the entire card container */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                    }}>

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            style={{
                                position: 'absolute',
                                top: 0, left: 0,
                                width: '100%',
                                height: '100%',
                                padding: '0px',
                                objectFit: 'cover',
                                zIndex: 1

                            }}
                        />
                    </Box>
                </Box>

                {/* Foreground Content Layer */}
                <CardContent
                    sx={{
                        p: 2,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        zIndex: 1,
                        position: 'relative',
                    }}
                >
                    {/* Top Header Row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', isolation: 'isolate' }}>
                        <Avatar 
                            src={`/player_icons/cow.png`}
                            sx={{
                                borderRadius: '25% 5%',
                                boxShadow: '-2px -2px 5px #070707c7',
                                width: 40,
                                height: 40,
                                p: "5px", // Padding to keep the image away from the circle edge
                                "& img": {
                                    objectFit: "contain", // Ensures the full PNG is visible
                                    width: "100%",        // Forces image to respect container width
                                    height: "100%",        // Forces image to respect container height
                                    filter: `drop-shadow(1px 2px 1px #00000093)` // Shadow follows PNG shape
                                },
                                cursor: 'pointer',
                                bgcolor:  'transparent'
                            }}
                        />

                        {/* The Cut-Through Game Title */}
                        <Typography
                            sx={{
                                fontFamily: 'system-ui',
                                fontWeight: 800,
                                textAlign: 'center',
                                flex: 1,
                                px: 1,
                                textTransform: 'uppercase',
                                
                                // --- Bleeding Shadow Effect ---
                                color: `${Color.gold}`, // Clean white text to contrast the bleed
                                textShadow: `2px 2px 2px #000000c5`,

                                // --- Auto-Resizing Font Magic ---
                                // Adjust the multiplier (e.g., 24) to scale the baseline size up or down
                                fontSize: `clamp(0.875rem, ${Math.max(1, 24 / (gameName?.length || 1))}vw, 2rem)`,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis', // Graceful fallback if a name is completely massive
                                
                            }}
                        >
                            {gameName}
                        </Typography>

                        <Avatar

                            src={`/icon.png`}
                            sx={{
                                borderRadius: '25% 5%',
                                boxShadow: '2px 2px 5px #070707c7',
                                width: 30,
                                height: 30,
                                p: "0px", // Padding to keep the image away from the circle edge
                                "& img": {
                                    objectFit: "contain", // Ensures the full PNG is visible
                                    width: "100%",        // Forces image to respect container width
                                    height: "100%",        // Forces image to respect container height
                                    filter: `drop-shadow(1px 2px 1px #00000093)` // Shadow follows PNG shape
                                }
                            }}
                        />
                    </Box>

                    {/* Center Panel (Hosts Rating Stack On Left Edge) */}
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', position: 'relative', }}>
                        <Rating
                            value={stars}
                            max={10}
                            readOnly
                            sx={{
                                flexDirection: 'column-reverse',
                                gap: '1px',
                                borderRadius: 2,
                                p: 0,
                                color: `${Color.gold}`, 
                                filter: 'drop-shadow(2px 2px 2px #000)'
                            }}
                        />
                    </Box>

                    {/* Bottom Details Panel */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            alignSelf: 'center',
                            width: '200px'
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                            <BarChart sx={sxIcon}/>
                            <Typography variant="body1" sx={sxText}>
                                {ranking}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'left'}}>
                            <EmojiEvents sx={sxIcon} />
                            <Typography variant="body1" sx={sxText}>
                                {score}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>

                {/* Corporate Branding Footer Banner */}
                <Box
                    sx={{
                        zIndex: 1,
                        width: '100%',
                        height: '15px',
                        bottom: '0px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        alignSelf: 'center',
                        gap: 0.25,
                        position: 'absolute',
                        // 1. Semi-transparent background
                        bgcolor: '#ffc10713',
                        // 2. The "Frosted" effect
                        backdropFilter: 'blur(5px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(5px) saturate(180%)', // Safari support
                    }}
                >
                    <Typography sx={{fontFamily: 'system-ui', fontSize: '10px', fontWeight: 350}}>
                        {website}
                    </Typography>
                    {
                        collab ?
                        <Typography sx={{ fontFamily: 'system-ui', fontSize: '10px', fontWeight: 350 }}>
                            {collab}
                        </Typography> : undefined
                    }
                </Box>
            </Card>

            <Box>
                <Button>
                    Take A Photo
                </Button>
            </Box>
        </>
    );
};
