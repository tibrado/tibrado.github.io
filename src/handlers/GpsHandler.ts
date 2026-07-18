import type { Coordinates, AppPermissionOptions } from "../assets/types";

export function GpsHandler(setStatus: (s: AppPermissionOptions) => void, setGps: (c: Coordinates) => void) {
    if(!navigator.geolocation){
        setStatus('unsupported'); 
        return; 
    }; 

    // Fetch Location 
    const fetchLocation = (highAccuracy = true) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setStatus('granted');  // override to prevent "prompt" stuck state
                setGps(
                    {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                );
            },
            (err) => {
                console.warn(`GPS Error (${err.code}): ${err.message}`);

                // Fallback if high accuracy times out or fails
                if(highAccuracy && (err.code === 3 || err.code === 2)){
                    console.log("Lowering GPS accuracy."); 
                    fetchLocation(false); 
                } else {
                    setStatus('denied'); 
                }; 
            },
            {
                enableHighAccuracy: highAccuracy,
                timeout: highAccuracy ? 8000 : 15000,
                maximumAge: highAccuracy ? 0 : Infinity,
            }
        );
    }; 

    navigator.permissions
        .query({name: "geolocation"})
        .then((permissionStatus) => {
            setStatus(permissionStatus.state) // granted, denied, prompt

            // Already have permission 
            if(permissionStatus.state === 'granted' || permissionStatus.state === 'prompt'){
                fetchLocation(true); 
            }

            // check changes 
            permissionStatus.onchange = () => {
                setStatus(permissionStatus.state); 

                if(permissionStatus.state === 'granted'){
                    fetchLocation(true); 
                }; 
            };
        })
        .catch(() => {
            fetchLocation(true);
        }); 
}; 