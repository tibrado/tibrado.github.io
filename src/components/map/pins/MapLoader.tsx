import BasePin from "./BasePin";
import BlackBoxPin from "./BlackBoxPin";
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

const componentToImage = async (component: React.ReactElement, size: number = 48): Promise<HTMLImageElement> => {
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


// Load Pin of X type
export const LoadPin = async (map: any, name: string, color: string, type: 'base' | 'black box') => {
    try {
        // Create Image
        const pimg = type === 'base' 
            ?   await componentToImage(
                <BasePin imgUrl={`other_icons/${name}.png`} color={color} />,
                64
            )
            : await componentToImage(
                <BlackBoxPin imgUrl={`other_icons/${name}.png`} color={color} />,
                200
            ); 

        // Load pin to map
        if (!map.hasImage(name)) {
            map.addImage(name, pimg);
        };
    } catch (err) {
        console.error('Image Load Failed: ', err);
    };
};