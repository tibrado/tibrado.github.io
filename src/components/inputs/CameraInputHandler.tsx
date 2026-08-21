import React, { useRef, useState, useEffect } from 'react';
import {Box, Card, CardContent, CardActions} from '@mui/material'; 

export const PhotoBooth: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasBgRef = useRef<HTMLCanvasElement | null>(null);
  const canvasFgRef = useRef<HTMLCanvasElement | null>(null);

  const brandingIconRef = useRef<HTMLImageElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-load the branding icon watermark when the component mounts
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    // Replace this URL with your custom logo file path (e.g., /assets/logo.png)
    img.src = `/player_icons/bear.png`; 
    brandingIconRef.current = img;

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

  /*
    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasBgRef.current;
        const brandingIcon = brandingIconRef.current;

        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw the current frozen video frame onto the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 2. Draw the branding icon overlay (Bottom Right)
        if (brandingIcon && brandingIcon.complete) {
        const iconSize = 60;
        const xPos = canvas.width - iconSize - 20;
        const yPos = canvas.height - iconSize - 20;
        ctx.drawImage(brandingIcon, xPos, yPos, iconSize, iconSize);
        }

        // 3. Draw text layer directly onto the canvas matrix (Bottom Left)
        ctx.font = "bold 26px Arial";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeText("#MyBrandTag", 20, canvas.height - 25);
        ctx.fillText("#MyBrandTag", 20, canvas.height - 25);

        // 4. Convert canvas state to data URL string
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setPreviewUrl(dataUrl);
        setCameraActive(false);
    };
*/
    const xPhoto = () => {
        const video = videoRef.current;
        const canvas = canvasBgRef.current;
        const brandingIcon = brandingIconRef.current;

        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw the current frozen video frame onto the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 2. Draw the branding icon overlay (Bottom Right)
        if (brandingIcon && brandingIcon.complete) {
        const iconSize = 60;
        const xPos = canvas.width - iconSize - 20;
        const yPos = canvas.height - iconSize - 20;
        ctx.drawImage(brandingIcon, xPos, yPos, iconSize, iconSize);
        }

        // 3. Draw text layer directly onto the canvas matrix (Bottom Left)
        ctx.font = "bold 26px Arial";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeText("#MyBrandTag", 20, canvas.height - 25);
        ctx.fillText("#MyBrandTag", 20, canvas.height - 25);

        // 4. Convert canvas state to data URL string
        // const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        // setPreviewUrl(dataUrl);
        // setCameraActive(false);
    };

    const downloadPhoto = () => {
        if (!previewUrl) return;

        const downloadLink = document.createElement('a');
        downloadLink.href = previewUrl;
        downloadLink.download = `branded-photo-${Date.now()}.jpg`;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const retakePhoto = () => {
        setPreviewUrl(undefined);
        // Reassign the active stream back to the video tag element
        setTimeout(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
        }
        }, 50);
    };

    // Inside your component function:
    const initializeSharpCanvas = (canvas: HTMLCanvasElement): CanvasRenderingContext2D | null => {
        const ctx = canvas.getContext('2d'); 
        if (!ctx) return null;

        // make sure canvas match device resolution
        const rect = canvas.getBoundingClientRect(); 
        const dpr = window.devicePixelRatio || 1; 

        canvas.width = rect.width * dpr; 
        canvas.height = rect.height * dpr; 

        ctx.scale(dpr, dpr); 
        ctx.imageSmoothingEnabled = false; // Keep pixel art sharp. (Optional)

        return ctx; 
    }; 

    const wrap_text = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(" ");
        let currentLine = "";
        let currentY = y;
      
        for (let n = 0; n < words.length; n++) {
          // Add the next word to a test line string
          const testLine = currentLine + words[n] + " ";
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;
      
          // If the line is too wide and isn't the very first word, print the line and break
          if (testWidth > maxWidth && n > 0) {
            context.fillText(currentLine, x, currentY);
            currentLine = words[n] + " ";
            currentY += lineHeight; // Drop down to the next row
          } else {
            currentLine = testLine;
          }
        }
        // Print any leftover words on the final line
        context.fillText(currentLine, x, currentY);
    };
      
    useEffect(() => {
        const canvas = canvasFgRef.current;
        if (!canvas) return;

        const ctx = initializeSharpCanvas(canvas); 
        if(!ctx) return; 
        
        // add icon to canvas
        const icon = new Image();
        icon.src = `/player_icons/bear.png`;
        icon.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            const width = canvas.getBoundingClientRect().width;
            const height = canvas.getBoundingClientRect().height;
            
            // Parameters: (image, destinationX, destinationY, width, height)
            ctx.drawImage(icon, 10, 10, 32, 32); 
            ctx.drawImage(icon, width - 42, 10, 32, 32); 

            // Player Name Text 
            ctx.font = "bold 16px Arial";
            ctx.fillStyle = "white";
            ctx.textBaseline = "middle";
            
            const playerNameText = "Player";
            ctx.fillText(
                playerNameText, 
                (width - ctx.measureText(playerNameText).width) / 2, 
                30
            );

            
            // Scavenger Tag 
            const tmText = "scavenger.hq™";
            const baseY = height - 210;
            ctx.font = "12px Arial";
            ctx.fillText(tmText, 20, baseY);


            // -------------------- Info Section 
            const infoText = "Mission accomplished! You proved that no clue is too clever and no hiding spot is too tough for you.";
            ctx.font = "14px Arial";
            wrap_text(ctx, infoText, 10, baseY + 30, 330, 18);

        };
    }, [canvasBgRef]);

    return (
        <Box>
            <Card
                sx={{
                    p: 0, m:0, display: 'flex', flexDirection: "column",
                    height: '95dvh', 
                    maxHeight: '650px',
                    width: '95dvw',
                    maxWidth: '350px',
                    borderRadius: '5px',
                }}
            >
            
                <CardContent
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        p: 0.5, 
                        m: 0,
                        borderRadius: '5px'
                    }}
                >
                    {error && <p style={styles.errorText}>{error}</p>}

                    {/* Camera Feed View */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{
                            position:  'absolute', 
                            top: 0, left: 0,
                            width: '100%',
                            height: '100%',
                            padding: '0px',
                            objectFit: 'cover',
                            zIndex: 1

                        }} 
                    />

                    {/* Background Canvas */}
                    <canvas
                        ref={canvasBgRef}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, 
                            width: '100%',
                            height: '100%',
                            padding: 0,
                            margin: 0,
                            borderRadius: '5px',
                            border: '10px solid #000000ce',
                            borderTop: '50px solid #000000ce',
                            borderBottom: '200px solid #000000ce',
                            display: 'block',
                            zIndex: 2,
                        }} 
                    />

                    {/* Foreground Canvas */}
                    <canvas
                        ref={canvasFgRef}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, 
                            width: '100%',
                            height: '100%',
                            padding: 0,
                            margin: 0,
                            borderRadius: '5px',
                            display: 'block',
                            zIndex: 2,
                        }} 
                    />


                    {/* Stamped Output Preview View */}
                    {true && (
                        <img
                            src={previewUrl}
                            alt="Branded Result"
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, 
                                width: '100%',
                                height: '100%',
                                padding: 0,
                                margin: 0,
                                borderRadius: '5px',
                                background: 'pink',
                                display: 'block'
                            }} 
                        />
                    )}
                </CardContent>
                <CardActions>
                {cameraActive && (
                    <button onClick={xPhoto} style={{ ...styles.btn, ...styles.btnPrimary }}>
                        📸 Take Photo
                    </button>
                )}

                {previewUrl && (
                    <div style={styles.downloadSection}>
                        <button onClick={downloadPhoto} style={{ ...styles.btn, ...styles.btnSuccess }}>
                            📥 Download Photo
                        </button>
                        <p style={styles.hint}>The image will save directly to your device with our official tags!</p>
                        <button onClick={retakePhoto} style={{ ...styles.btn, ...styles.btnSecondary }}>
                            🔄 Retake
                        </button>
                    </div>
                )}

                </CardActions>
            </Card>
        </Box>
    );
};

// Inline TSX CSS Styles Architecture
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '20px auto',
    textAlign: 'center',
  },
  heading: {
    margin: '0 0 15px 0',
    color: '#333'
  },
  mediaElement: {
    width: '100%',
    maxWidth: '400px',
    borderRadius: '8px',
    background: '#000',
    display: 'block',
    margin: '10px auto',
  },
  actions: {
    marginTop: '15px',
  },
  downloadSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  btn: {
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    margin: '8px',
    fontSize: '16px',
    transition: 'background 0.2s ease',
  },
  btnPrimary: { background: '#007bff' },
  btnSuccess: { background: '#28a745' },
  btnSecondary: { background: '#6c757d' },
  hint: {
    fontSize: '14px',
    color: '#666',
    margin: '5px 0',
  },
  errorText: {
    color: '#dc3545',
    fontWeight: 'bold',
  }
};
