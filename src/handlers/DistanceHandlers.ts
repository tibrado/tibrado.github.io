import {LngLat} from 'maplibre-gl';
import type { Coordinates } from '../assets/types';

export function  meterToMile(value: number): number {
    return Math.round((value * 0.000621371) * 100) / 100; 
}; 


export function getDistance(A: Coordinates, B: Coordinates): number {
    const point1: LngLat = new LngLat(A.longitude, A.latitude); 
    const point2: LngLat = new LngLat(B.longitude, B.latitude); 
    return point1.distanceTo(point2); 
 };

export function inRange( userLocation: Coordinates | undefined, pin:  Coordinates): boolean {
    if(userLocation){
        return getDistance(userLocation, pin) < (userLocation?.accuracy ?? 0); 
    }; 
    return false; 
};

