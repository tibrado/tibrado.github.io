import React from 'react';
import ReactDOMServer from 'react-dom/server'; 

// Helper utility to safely convert an external image url into a base64 string
const fetchAsDataUrl = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (err) {
        console.error("Failed to preload avatar/icon image due to CORS restrictions:", err);
        return url; // fallback to raw string if it fails
    }
};

export const component_to_image = async (component: React.ReactElement, size: number = 48): Promise<HTMLImageElement> => {
    let pcomp = component; 
    const props = component.props as {imgUrl?: string; [key: string]: any}; 

    if(props && props.imgUrl && !props.imgUrl.startsWith('data:')){
        const base64Url = await fetchAsDataUrl(props.imgUrl);

        pcomp = React.cloneElement<any>(component, {imgUrl: base64Url}); 
    };

    return new Promise((resolve, reject) => {
        // render component as string
        const svgString = ReactDOMServer.renderToStaticMarkup(pcomp); 

        // create data safe image url
        const bytes = new TextEncoder().encode(svgString); 
        const base64Svg = btoa(String.fromCharCode(...bytes)); //btoa(unescape(encodeURIComponent(svgString)))
        const dataUrl = `data:image/svg+xml;base64,${encodeURIComponent(base64Svg)}`;
        
        // Load into HTML 
        const img = new Image(size, size); 
        img.onload = () => resolve(img); 
        img.onerror = (err) => reject(err); 
        img.src = dataUrl; 
    });
};