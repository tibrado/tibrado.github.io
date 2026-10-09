import { useState, useRef, useCallback, useEffect} from 'react';
import { Map, Popup, GeolocateControl, type MapRef } from 'react-map-gl/maplibre';
import { type MapStyleImageMissingEvent, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GamePage } from '../../pages/GamePage';
import { PlayerIcons, OtherIcons } from '../../assets/types';
import { useWorld } from '../../context';
import { QuestLayer,ObjectiveLayer, MainCharacterLayer, OtherPlayersLayer } from './pins/PinsSourceLayers';
import { RotatingPin, PulsingPin } from './pins/PinAnimations';
import ScoreAnim from '../ScoreAnim';

const MAP_ZOOM = 16.5; 

export function GameMap() {
    const {world, setWorld} = useWorld(); 
    const [points, setPoints] = useState<number>(0); 
    const [popupCoord, setPopupCoord] = useState<{lat: number, lng: number} | undefined>(undefined); 
    
    const loadingImages = new Set<string>(); 
    const mapRef = useRef<MapRef>(null);
    const geolocateRef = useRef<any>(null); 
    const myLayers = ['scavenger-mc-layer', 'scavenger-players-layer', 'scavenger-trial-layer', 'scavenger-game-layer']; 
    
    const onPinFocus = useCallback((lng: number, lat: number, zoom_offset: number = 0) => {
        mapRef.current?.flyTo({
            center: [lng, lat] ,
            duration: 2000, // Duration in milliseconds
            zoom: MAP_ZOOM + zoom_offset,
            essential: true
        });
    }, []); 

    function onClickGamePin(id: number, lng: number, lat: number){
        
        onPinFocus(lng, lat);
        setPopupCoord({lat: lat, lng: lng}); 
        setWorld(pre => ({
            ...pre, 
           selected: {
                mode: 'game',
                index: id,
                lock: undefined
           }
        })); 
    }; 
    
    function onClickTrialPin(id: number, path: number, lock: boolean, lng: number, lat: number){
        onPinFocus(lng, lat, 1.5);
        setPopupCoord({lat: lat, lng: lng}); 
        setWorld(pre => ({
            ...pre, 
            selected: {
                mode: 'trial',
                index: id,
                path: path,
                lock: lock
            }
        })); 
    }; 

    // ----------------------------------------------
    const creationModeRef = useRef(world.creationMode); 

    // Edit
    useEffect(() => {
        if (world.creationMode.edit !== undefined){
            const v = world.creationMode
            .data[world.creationMode.edit].coordinates; 

            if (v) {
                onPinFocus(v.longitude, v.latitude)
                setPopupCoord({lat: v.latitude, lng: v.longitude})
            }
        };
    }, [world.creationMode.edit]); 

    useEffect(() => {
        creationModeRef.current = world.creationMode; 
    }, [world.creationMode]);

    // On data added
    let marker: Marker | null = null;  

    useEffect(() => {
        if(world.creationMode.data.length > 0){
            marker = null; 
        }
    }, [world.creationMode.data])


    function onCreationSelect(map: any, lng: number, lat: number) {
        if (creationModeRef.current.location.active) {
            setWorld(pre => ({
                ...pre,
                creationMode: {
                    ...pre.creationMode,
                    location: {
                        active: false,
                        LatLng: {
                            latitude: lat,
                            longitude: lng
                        }
                    }
                },
                selected: {
                    mode: 'creation',
                    index: 0,
                    path: 0
                }
            }));

            if(marker)
                marker.remove(); 

            marker = new Marker({ color: '#ff0101' })
                .setLngLat([lng, lat])
                .addTo(map);

            onPinFocus(lng, lat);
            setPopupCoord({ lat: lat, lng: lng }); 
        }; 
    };


    // ---------------------------------------------------
    const handleMissingIcon = async (e: MapStyleImageMissingEvent) => {
        const map = e.target; 
        const iconName = e.id;

        if(PlayerIcons.includes(iconName.replace('user-', '')) || OtherIcons.includes(iconName)){
            if(map.hasImage(iconName) || loadingImages.has(iconName)){
                return; 
            };

            loadingImages.add(iconName); 

            try {
                if(iconName == 'search'){
                    map.addImage(
                        iconName, 
                        RotatingPin(300, map, `other_icons/${iconName}.png`)
                    );
                }
                else if(OtherIcons.includes(iconName)){
                    const image = await map.loadImage(`other_icons/${iconName}.png`)
                    map.addImage(iconName, image.data);
                } 
                else if(iconName.includes('user-')){
                    map.addImage(
                        iconName, 
                        PulsingPin(300, map, `player_icons/${iconName.replace('user-', '')}.png`)
                    );
                }
                else{
                    const image = await map.loadImage(`player_icons/${iconName.replace('user-', '')}.png`)
                    map.addImage(iconName, image.data);
                }
                
            } catch (error) {
                console.error(`Failed to load map icon:`, error);
            }
        }
    };
    
    return (
        <>
            <ScoreAnim score={world.player.score} earn={points} />
            <Map
                ref={mapRef}
                attributionControl={false}
                onLoad={(e) => {
                    const map = e.target; 

                    // in creation mode
                    map.on('click', (e) => {onCreationSelect(map, e.lngLat.lng, e.lngLat.lat)}); 
                    map.on('styleimagemissing', handleMissingIcon)
                    map.on('click', 'scavenger-game-layer', (e) => {
                        const features = e.features;

                        if(features){
                            onClickGamePin(features[0].properties.id as number, e.lngLat.lng, e.lngLat.lat)
                        }
                    }); 
                    // map.setPaintProperty('ctracts', 'fill-color', ["step", ["number", ["feature-state", "lmi"], 0], "#FFFFFF", 1, "#FFB6C1", 3, "#FAFAD2"])
                    map.on('click', 'scavenger-trial-layer', (e) => {
                        const features = e.features; 
                        if(features){
                            const prop = features[0].properties; 
                            onClickTrialPin(
                                prop.id as number,
                                prop.path as number, 
                                prop.locked as boolean,
                                e.lngLat.lng, e.lngLat.lat
                            )
                        }
                    });

                    ['scavenger-game-layer','scavenger-trial-layer'].forEach( l => {
                        map.on('mouseenter', l, () => {map.getCanvas().style.cursor = 'pointer'})
                        map.on('mouseleave', l, () => {map.getCanvas().style.cursor = ''})
                    })
                    
                    // Remove other symbols 
                    const layers = map.getStyle().layers; 

                    layers.forEach((layer) => {
                        if(layer.type === 'symbol' && !myLayers.includes(layer.id) ){
                            // Remove the default icons
                            if (map.getLayoutProperty(layer.id, 'icon-image')) {
                                map.setLayoutProperty(layer.id, 'icon-image', '');
                            }
                            /*
                            // Optional: Remove default text labels (like city/street names)
                            if (map.getLayoutProperty(layer.id, 'text-field')) {
                                map.setLayoutProperty(layer.id, 'text-field', '');
                            }
                            */
                        }
                    });
                    geolocateRef.current?.trigger(); 
                }}
                
                // Disable all interactions
                doubleClickZoom={true}
                dragPan={true}
                dragRotate={true}
                touchZoomRotate={true}
                scrollZoom={true}
                maxZoom={18}
                minZoom={2}
                mapStyle='https://tiles.openfreemap.org/styles/liberty'
                style={{
                    height: '95dvh', 
                    width: '95dvw',
                    borderRadius: '5px',
                }}
                
            >
                {/* Custom Popup Styles */}
                <style>
                    {`
                        .maplibregl-popup-content {
                            background: transparent !important;
                            box-shadow: none !important;
                            padding: 0 !important;
                        }
                        .maplibregl-popup-tip {
                            display: none !important;
                        }
                    `}
                </style>

                {/*User Location*/}
                <GeolocateControl
                    ref={geolocateRef}
                    positionOptions={{
                        enableHighAccuracy: false,
                        maximumAge: 0,
                        timeout: 10000 /* 10 sec */
                    }}
                    fitBoundsOptions={{
                        maxZoom: MAP_ZOOM
                    }}
                    trackUserLocation={true}
                    showAccuracyCircle={false}
                    showUserLocation={false}
                    onGeolocate={(e) => {
                        setWorld(pre => ({
                            ...pre, 
                            player: {
                                ...world.player,
                                location: {
                                    latitude: e.coords.latitude,
                                    longitude: e.coords.longitude,
                                    accuracy: e.coords.accuracy
                                },
                            }
                        })); 
                    }}
                />
                
                <MainCharacterLayer/>

                {world.selected?.mode == 'trial' ? <ObjectiveLayer/>: <QuestLayer/>} 
                
                
                <OtherPlayersLayer/>


                {popupCoord !== undefined && (
                    <Popup 
                        anchor='center'
                        latitude={popupCoord.lat}
                        longitude={popupCoord.lng}
                        closeButton={false}
                        style={{padding: 0, margin: 0, zIndex: 3}}
                        onClose={() => {
                            setPopupCoord(undefined); 
                            setWorld(pre => ({
                                ...pre,
                                creationMode: {
                                    ...pre.creationMode,
                                    edit: undefined
                                }
                            }));
                        }}
                    >
                        {
                            world.selected?.lock ?? true
                            ? <GamePage FocusOnPin={onPinFocus} setPopupCoord={setPopupCoord} setPoints={setPoints}/>
                            : "You are not in range"
                        }
                    </Popup>
                )}
            </Map>
        </>
    );
}; 

export default GameMap;