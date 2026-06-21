import { useState, useRef, useCallback} from 'react';
import { Map, Popup, GeolocateControl, type MapRef } from 'react-map-gl/maplibre';
import type { MapStyleImageMissingEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GamePage } from '../../pages/GamePage';
import { PlayerIcons, OtherIcons, type Coordinates, type MapMode } from '../../assets/types';
import { useWorld } from '../../context';
import { QuestLayer,TrialLayer, MainCharacterLayer, OtherPlayersLayer } from './pins/PinsSourceLayers';
import { PulsingPin } from './pins/PinAnimations';

const MAP_ZOOM = 14.5; 

export function GameMap() {
    const {world, setWorld} = useWorld(); 
    const [selected, setSelected] = useState<{mode: MapMode, index: number, path: number}>({mode: 'game', index: 0, path: 0}); 
    const [coord, setCoord] = useState<Coordinates | undefined>(undefined); 
    const [popupCoord, setPopupCoord] = useState<{lat: number, lng: number} | undefined>(undefined); 
    
    const loadingImages = new Set<string>(); 
    const mapRef = useRef<MapRef>(null);
    const geolocateRef = useRef<any>(null); 

    const onPinFocus = useCallback((lng: number, lat: number, zoom_offset: number = 0) => {
        mapRef.current?.flyTo({
            center: [lng, lat] ,
            duration: 2000, // Duration in milliseconds
            zoom: MAP_ZOOM + zoom_offset,       // Optional: adjust zoom level on arrival
            essential: true
        });
    }, []);  

    
    function onClickGamePin(id: number, lng: number, lat: number){
        onPinFocus(lng, lat);
        setPopupCoord({lat: lat, lng: lng}); 
        setSelected({ mode: 'game', index: id, path: 0}); 
    }; 
    
    function onClickTrialPin(id: number, path: number, lng: number, lat: number){
        onPinFocus(lng, lat, 1.5);
        setPopupCoord({lat: lat, lng: lng}); 
        setSelected({ mode: 'trial', index: id, path: path}); 
    }; 

    // ---------------------------------------------------
    const handleMissingIcon = async (e: MapStyleImageMissingEvent) => {
        const map = e.target; 
        const iconName = e.id;
      
        if(PlayerIcons.includes(iconName) || OtherIcons.includes(iconName)){
            if(map.hasImage(iconName) || loadingImages.has(iconName)){
                return; 
            };
            
            loadingImages.add(iconName); 

            try {
                if(OtherIcons.includes(iconName)){
                    const image = await map.loadImage(`other_icons/${iconName}.png`)
                    map.addImage(iconName, image.data);
                } 
                else{
                    map.addImage(iconName, PulsingPin(300, map, `player_icons/${iconName}.png`));
                }
            } catch (error) {
                console.error(`Failed to load map icon:`, error);
            }
        }
    };


    return (
        <Map
            ref={mapRef}
            attributionControl={false}
            onLoad={(e) => {
                const map = e.target; 

                map.on('styleimagemissing', handleMissingIcon)
                map.on('click', 'scavenger-game-layer', (e) => {
                    const features = e.features; 

                    if(features){
                        onClickGamePin(features[0].id as number, e.lngLat.lng, e.lngLat.lat)
                    }
                }); 

                map.on('click', 'scavenger-trial-layer', (e) => {
                    const features = e.features; 

                    if(features){
                        console.log(features)
                        onClickTrialPin(
                            features[0].properties.id as number,
                            features[0].properties.path as number, 
                            e.lngLat.lng, e.lngLat.lat
                        )
                    }
                });

                geolocateRef.current?.trigger(); 
            }}
            initialViewState={{
                latitude: world.player.lat,
                longitude: world.player.lng,
                zoom: coord ? MAP_ZOOM : 1,
                bearing: 90,
                pitch: 60,
            }}
            
            // Disable all interactions
            doubleClickZoom={true}
            dragPan={true}
            dragRotate={true}
            touchZoomRotate={true}
            scrollZoom={true}
            maxZoom={22}
            mapStyle='https://tiles.openfreemap.org/styles/liberty'
            style={{
                height: '95dvh', 
                width: '95dvw',
                borderRadius: '10px',
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
                    setCoord({
                        longitude: e.coords.longitude, 
                        latitude: e.coords.latitude, 
                        accuracy: e.target?._accuracy
                    }); 
                    
                    setWorld(pre => ({
                        ...pre, 
                        player: {
                            ...world.player,
                            lat: e.coords.latitude,
                            lng: e.coords.longitude
                        }
                    })); 
                }}
            />

            <TrialLayer/>
            <QuestLayer/>
            <OtherPlayersLayer/>
            <MainCharacterLayer/>

            {popupCoord !== undefined && (
                <Popup 
                    anchor='center'
                    latitude={popupCoord.lat}
                    longitude={popupCoord.lng}
                    closeButton={false}
                    style={{padding: 0, margin: 0, zIndex: 3}}
                    onClose={() => setPopupCoord(undefined)}
                >
                    {
                        true
                        ? <GamePage selected={selected} FocusOnPin={onPinFocus} setPopupCoord={setPopupCoord}/>
                        : "You are not in range"
                    }
                </Popup>
            )}
        </Map>
    );
}; 

export default GameMap;