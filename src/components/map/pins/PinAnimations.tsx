import type { StyleImageInterface, Map } from 'maplibre-gl';

// Define a type that combines MapLibre's interface with our custom context tracking
type MapLayerImageAnim = StyleImageInterface & {
    context: CanvasRenderingContext2D | null;
    img: HTMLImageElement | null;
};

/**
 * Creates an animated pulsing aura wave effect around a custom image pin.
 * @param size The total width/height block of the marker layer.
 * @param map The MapLibre Map instance.
 * @param imageUrl The URL path or imported asset string of your icon/pin image.
 */
export function PulsingPin(size: number, map: Map, imageUrl: string): MapLayerImageAnim {
  return {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    context: null,
    img: null,

    // Triggered once when the layer gets loaded by MapLibre
    onAdd() {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');

      // Pre-initialize and cache the HTML image object
      const img = new Image();
      img.src = imageUrl;
      
      // Force a repaint once the asset finishes downloading
      img.onload = () => {
        map.triggerRepaint();
      };
      
      this.img = img;
    },

    // Triggered on every frame update loop
    render() {
      const context = this.context;
      const img = this.img;
      
      // Safety check: Don't render until canvas context and image are fully ready
      if (!context || !img || !img.complete) return false;

      const duration = 1500; // Animation cycle length in milliseconds
      const t = (performance.now() % duration) / duration;

      // Define the fixed size of the central image pin (e.g., 50% of the total box size)
      const imgSize = size * 0.5; 
      const imgX = (this.width - imgSize) / 2;
      const imgY = (this.height - imgSize) / 2;

      // Calculate base start radius (edge of the image) and max outer ring radius
      const baseRadius = imgSize / 2;
      const maxRadius = size / 2;
      
      // The wave starts at the image edge and expands out to the edge of the box boundary
      const currentRadius = baseRadius + (maxRadius - baseRadius) * t;

      // Clear the canvas rectangle from the last tick frame
      context.clearRect(0, 0, this.width, this.height);

      // --- 1. DRAW BACKGROUND PULSE EFFECT ---
      context.save(); // Save context state before drawing alpha graphics
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        currentRadius,
        0,
        Math.PI * 2
      );
      // Fades out from a semi-transparent color to completely invisible
      context.fillStyle = `rgba(15, 143, 232, ${1 - t})`;
      context.fill();
      context.restore();

      // --- 2. DRAW CENTRAL IMAGE ON TOP ---
      context.drawImage(img, imgX, imgY, imgSize, imgSize);

      // Extract the canvas memory buffer to update MapLibre layer data
      this.data = context.getImageData(
        0,
        0,
        this.width,
        this.height
      ).data;

      // Keep the browser refreshing the map space for smooth motion graphics
      map.triggerRepaint();

      return true;
    }
  };
}

/**
 * Creates an animated rotating effect around a custom image pin.
 * @param size The total width/height block of the marker layer.
 * @param map The MapLibre Map instance.
 * @param imageUrl The URL path or imported asset string of your icon/pin image.
 */
export function RotatingPin(size: number, map: Map, imageUrl: string): MapLayerImageAnim {    
    // 1. Keep track of movement states within function closure scope
    let posX = size / 2;
    let posY = size / 2;

    // Set a random starting speed and direction for X and Y axes
    let speedX = 0.15;
    let speedY = 0.2;

    return {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        context: null,
        img: null,

        onAdd: function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');

            this.img = new Image();
            this.img.src = imageUrl;
            this.img.crossOrigin = 'Anonymous';
            this.img.onload = () => {
                map.triggerRepaint();
            };
        },

        render: function () {
            // Safety check: Stop if canvas is missing or image is broken
            if (!this.context || !this.img || !this.img.complete || this.img.naturalWidth === 0) {
                return false;
            }

            const ctx = this.context;
            const imgW = this.img.width;
            const imgH = this.img.height;

            // Clear the frame for a fresh draw
            ctx.clearRect(0, 0, this.width, this.height);
            

            // 3. Draw the colored bounce area background
            const padding = 100; 
            ctx.fillStyle = '#00000010';
            ctx.fillRect(
                padding, 
                padding, 
                this.width - (padding * 2), 
                this.height - (padding * 2)
            );
            // Update positions using current speed vectors
            posX += speedX;
            posY += speedY;
            // Bounce off Left or Right borders with padding
            if (posX - imgW / 2 < padding || posX + imgW / 2 > this.width - padding) {
                speedX = -speedX; // Simply reverse the direction
                //speedX += (Math.random() - 0.5) * 0.2; // Add minor random angle deviation
            }
            
            // Bounce off Top or Bottom borders with padding
            if (posY - imgH / 2 < padding || posY + imgH / 2 > this.height - padding) {
                speedY = -speedY; // Simply reverse the direction
                //speedY += (Math.random() - 0.5) * 0.2; // Add minor random angle deviation
            }

            // Draw the pin centered at the newly updated coordinates
            ctx.save();
            ctx.translate(posX, posY);
            ctx.drawImage(
                this.img, 
                -imgW / 2, 
                -imgH / 2, 
                imgW, 
                imgH
            );
            ctx.restore();

            // Push updated canvas buffer to MapLibre layer data array
            this.data = ctx.getImageData(0, 0, this.width, this.height).data;
            
            // Queue up the next frame render block
            map.triggerRepaint();

            return true;
        }
    };
}