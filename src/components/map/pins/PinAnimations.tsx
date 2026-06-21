import type { StyleImageInterface, Map } from 'maplibre-gl';

// Define a type that combines MapLibre's interface with our custom context tracking
type PulsingDotImage = StyleImageInterface & {
    context: CanvasRenderingContext2D | null;
    img: HTMLImageElement | null;
};

/**
 * Creates an animated pulsing aura wave effect around a custom image pin.
 * @param size The total width/height block of the marker layer.
 * @param map The MapLibre Map instance.
 * @param imageUrl The URL path or imported asset string of your icon/pin image.
 */
export function PulsingPin(size: number, map: Map, imageUrl: string): PulsingDotImage {
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