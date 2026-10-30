import React, { useEffect, useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { Card, CardContent,Typography, Box,Avatar,Rating,Backdrop,IconButton} from '@mui/material';
import {EmojiEvents, BarChart, CameraAlt, Download,Cancel } from '@mui/icons-material';
import { Color } from '../assets/types';
import { useWorld } from '../context';
import Dialog from '../components/Dialog';

interface RewardCardProps {
    website?: string;
    collab?: string;
}

export const RewardTradingCard: React.FC<RewardCardProps> = ({
    website = "www.scavenger.xyz",
    collab,
}) => {

    const {world, setWorld} = useWorld(); 

    // Video & Camera 
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const cardRef = useRef<HTMLDivElement>(null); 
    const canvasRef = useRef<HTMLCanvasElement | null>(null); 

    const [image, setImage] = useState<any | undefined>(undefined);
    const [downloadLink, setDownloadLink] = useState<HTMLAnchorElement | null>(null); 

    const [cameraOn, setCameraOn] = useState<boolean>(false); 
    // Styles 
    const sxIcon = { color: `${Color.gold}`, filter: 'drop-shadow(2px 2px 2px #000)' }; 
    const sxText = { fontWeight: 800, color: `${Color.gold}`, textShadow: '2px 2px 1px #000' }; 

    // stars
    const maxStars = world.objectives.length; 
    const stars = Math.floor(world.player.score / 10); 

    // Start Feed and mount component
    useEffect(() => { 
        let mediaStream: MediaStream | null = null; 
        
        const startCamera = async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, facingMode: "user" } // "user" defaults to selfie camera
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }

            } catch (err) {
                console.error("Camera access error:", err);
            }
        };

        if (cameraOn){
            startCamera(); 
        }; 

        // Cleanup: Stop camera tracks when component unmounts
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            };
        };
    }, [cameraOn]);


    // Take a Pic 
    const takePhoto = async () => {
        if (!videoRef.current || cardRef.current === null) return;

        try{
            const video = videoRef.current; 
            const canvas = canvasRef.current; 
            const context = canvas?.getContext('2d'); 

            if(context && canvas){
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                // Draw Image 
                context.drawImage(video, 0, 0, canvas.width, canvas.height); 

                const frameDataUrl = canvas.toDataURL('image/jpeg'); 
                setImage(frameDataUrl); 

                const dataUrl = await toJpeg(cardRef.current, {
                    cacheBust: true,
                    style: { transform: 'scale(1)'}
                });

                const link = document.createElement('a'); 

                link.download = `scavenger.jpeg`; 
                link.href = dataUrl; 
                setDownloadLink(link); 
            } 
        } catch (err) {
            console.error('Failed to capture card snapshot', err); 
            setImage(null); 
        }
    };

    const handleClose = () => {
        setWorld(pre => ({
            ...pre,
            uuid: undefined,
            reward: false,
            objectives: [],
            players: [],
            worldTime: 0,
            selected: { mode: 'game', index: 0, path: 0 },
            current: { index: 0, path: 0 },
            player: {
                ...pre.player,
                score: 0
            }
        }));
    };

    return (
        <Backdrop 
            open={world.reward ?? false } 
            sx={{zIndex: 999}}
        
        >
            { !cameraOn ? (
                    <Box sx={{
                        position: 'absolute',
                    }}>
                        <Dialog 
                            title={`CHALLENGE COMPLETED!!!`} 
                            message={"Show us some love. Take a pic and tag us @scavenger.hq"} 
                            handleResponse={(v: boolean) => {
                                if(v){
                                    setCameraOn(true); 
                                }
                                else{
                                    handleClose(); 
                                    setCameraOn(false); 
                                }
                            }} 
                            trueText="Yes"
                            falseText='No' 
                        />
                    </Box>
                ) : (
                    <Box>
                        <IconButton
                            aria-label="close"
                            onClick={() => setCameraOn(false)}
                            sx={{
                                position: 'absolute',
                                zIndex: 1,
                                top: 40,
                                right: 10,
                                width: 40,
                                height: 40,
                                color: '#ff0000',
                            }}
                        >
                            <Cancel sx={{ fontSize: '30px', boxShadow: '0px 0px 5px red', p: 0, m: 0, borderRadius: '50%'}}/>
                        </IconButton>
                        <Box>
                            {/*Canvas for video snap*/}
                            <canvas ref={canvasRef} style={{display: 'none'}}/>

                            <Card
                                ref={cardRef}
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
                                        justify: 'center',
                                    }}
                                >
                                    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                                        {image ? (
                                            <img
                                                src={image}
                                                alt="Captured Snapshot"
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    zIndex: 1
                                                }}
                                            />
                                        ) : (
                                            // Live camera stream
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    padding: '0px',
                                                    objectFit: 'cover',
                                                    zIndex: 1
                                                }}
                                            />
                                        )}
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
                                            src={`/player_icons/${world.player.icon as string}.png`}
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
                                                fontSize: `clamp(0.875rem, ${Math.max(1, 24 / (world.title?.length || 1))}vw, 2rem)`,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis', // Graceful fallback if a name is completely massive
                                                
                                            }}
                                        >
                                            {world.title}
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
                                            max={maxStars}
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
                                                {
                                                    world.players.findIndex(p => p.score <= world.player.score) + 1
                                                }
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'left'}}>
                                            <EmojiEvents sx={sxIcon} />
                                            <Typography variant="body1" sx={sxText}>
                                                {world.player.score}
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

                            <Box sx={{pt: '20px',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                                alignSelf: 'center',

                            }}>
                                { image ? (
                                    <IconButton
                                        onClick={() => {
                                            if(downloadLink !== null){
                                                downloadLink.click(); 
                                                setDownloadLink(null); 
                                                setImage(undefined);
                                                setCameraOn(false); 
                                                handleClose();
                                            }
                                        }}
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            color: Color.gold,
                                            bgcolor: '#0000006b',
                                            border: `2px solid`,
                                            boxShadow: '0px 2px 5px #000',
                                        }}
                                    >
                                        <Download sx={{ fontSize: '2.5rem' }} />
                                    </IconButton>
                                ) : (
                                        <IconButton
                                            onClick={takePhoto}
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                color: Color.gold,
                                                bgcolor: '#0000006b',
                                                border: `2px solid`,
                                                boxShadow: '0px 2px 5px #000',
                                            }}
                                        >
                                            <CameraAlt sx={{ fontSize: '2.5rem'}}/>
                                        </IconButton>
                                    )
                                }
                            </Box>
                        </Box>
                    </Box>
                )
            }
        </Backdrop>
    );
};
