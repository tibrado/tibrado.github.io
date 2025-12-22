import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Divider, Container } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

type Point = {
  x: number;
  y: number;
}

const Zentangles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [seed, setSeed] = useState(0);

  const drawParadox = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, iterations: number) => {
    // Initial square points
    let points: Point[] = [
      { x: x, y: y },
      { x: x + size, y: y },
      { x: x + size, y: y + size },
      { x: x, y: y + size },
    ];

    ctx.strokeStyle = '#222';
    ctx.lineWidth = 0.8;

    for (let i = 0; i < iterations; i++) {
      ctx.beginPath();
      // FIX: Access the first element of the array instead of the array itself
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let j = 1; j < points.length; j++) {
        ctx.lineTo(points[j].x, points[j].y);
      }
      
      ctx.closePath();
      ctx.stroke();

      // Shift factor creates the "twist" effect
      const factor = 0.08; 
      points = points.map((p, idx) => {
        const nextP = points[(idx + 1) % points.length];
        return {
          x: p.x + (nextP.x - p.x) * factor,
          y: p.y + (nextP.y - p.y) * factor,
        };
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gridSize = 4;
    const cellSize = canvas.width / gridSize;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        drawParadox(ctx, col * cellSize, row * cellSize, cellSize, 40);
      }
    }
  }, [seed]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
        <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 600 }}>
              Digital Zentangle
            </Typography>
            <Divider />
          </Box>
          
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box 
              component="canvas" 
              ref={canvasRef}
              width={360}
              height={360}
              sx={{ 
                border: '1px solid #ddd', 
                backgroundColor: '#fff',
                mb: 2,
                borderRadius: 1
              }}
            />
            
            <Button 
              variant="contained" 
              startIcon={<RefreshIcon />}
              onClick={() => setSeed(s => s + 1)}
              sx={{ textTransform: 'none', px: 4 }}
            >
              Generate New Pattern
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Zentangles;
