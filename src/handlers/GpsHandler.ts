import type { Coordinates, AppPermissionOptions } from "../assets/types";

export function GpsHandler(setStatus: (s: AppPermissionOptions) => void, setGps: (c: Coordinates) => void) {
    if(!navigator.geolocation){
        setStatus('unsupported'); 
        return; 
    }; 

    navigator.permissions
        .query({name: "geolocation"})
        .then((permissionStatus) => {
            setStatus(permissionStatus.state) // granted, denied, prompt

            // Get Location 
            const fetchLocation = () => {
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
            }; 

            // Already have permission 
            if(permissionStatus.state == 'granted'){
                fetchLocation(); 
            }; 

            // check changes 
            permissionStatus.onchange = () => {
                setStatus(permissionStatus.state); 

                if(permissionStatus.state === 'granted'){
                    fetchLocation(); 
                }; 
            };
        })
        .catch(() => {
            setStatus('error'); 
        }); 
}; 