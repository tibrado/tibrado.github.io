import type { Coordinates } from "../assets/types";

export function GpsHandler(setStatus: (s: string) => void, setGps: (c: Coordinates) => void) {
    console.log('running')
    if(!navigator.geolocation){
        setStatus('not-supported'); 
        return; 
    }; 

    navigator.permissions
        .query({name: "geolocation"})
        .then((permissionStatus) => {
            setStatus(permissionStatus.state) // granted, denied, prompt

            // check changes 
            permissionStatus.onchange = () => {
                setStatus(permissionStatus.state); 
            }

            if(permissionStatus.state == 'granted'){
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setGps(
                            {
                                latitude: pos.coords.latitude,
                                longitude: pos.coords.longitude
                            }
                        );
                    },
                    (err) => {
                        console.log(`Error: ${err.message}`);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    }
                );

            }
        })
        .catch(() => {
            setStatus('error'); 
        }); 
}; 