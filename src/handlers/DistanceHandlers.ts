import {LngLat} from 'maplibre-gl';
import type { Coordinates } from '../assets/types';

export function  meterToMile(value: number): number {
    return Math.round((value * 0.000621371) * 100) / 100; 
}; 


export function get_distance(A: Coordinates, B: Coordinates, in_miles: boolean = false): number {
    try{
        const point1: LngLat = new LngLat(A.longitude, A.latitude); 
        const point2: LngLat = new LngLat(B.longitude, B.latitude); 
        return in_miles ? meterToMile(point1.distanceTo(point2)) : point1.distanceTo(point2); 
    }
    catch{
        return 0;
    }
 };

export function inRange( userLocation: Coordinates | undefined, pin:  Coordinates): boolean {
    if(userLocation){
        console.log(get_distance(userLocation, pin))
        return get_distance(userLocation, pin) < (userLocation?.accuracy ?? 2); 
    }; 
    return false; 
};

