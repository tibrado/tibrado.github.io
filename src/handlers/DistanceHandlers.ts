import {LngLat} from 'maplibre-gl';
import type { LatLng } from '../assets/types';

export function  meterToMile(value: number): number {
    return Math.round((value * 0.000621371) * 100) / 100; 
}; 


export function get_distance(A: LatLng, B: LatLng, in_miles: boolean = false): number {
    try{
        const point1: LngLat = new LngLat(A.longitude, A.latitude); 
        const point2: LngLat = new LngLat(B.longitude, B.latitude); 
        return in_miles ? meterToMile(point1.distanceTo(point2)) : point1.distanceTo(point2); 
    }
    catch{
        return 0;
    }
 };

export function in_range( userLocation: LatLng | undefined, pin:  LatLng): boolean {
    if(userLocation){
        return get_distance(userLocation, pin, true) < (userLocation?.accuracy ?? 0.05); 
    }; 
    return false; 
};

