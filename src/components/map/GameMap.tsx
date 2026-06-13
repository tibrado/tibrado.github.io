import { useMemo, useState, useRef, useCallback } from 'react';
import { Map, Marker, Popup, GeolocateControl, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Place } from '@mui/icons-material';
import { GamePage } from '../../pages/GamePage';
import type { Coordinates, MapMode } from '../../assets/types';
import {inRange} from '../../handlers/DistanceHandlers';
import { PlayerDisplay } from '../player_details/Player';
import GameMapPin from '../../animations/GameMapPin';
import { useWorld } from '../../context';

const MAP_ZOOM = 14.5; 

export function GameMap() {
    const {world, setWorld} = useWorld(); 
    const [selected, setSelected] = useState<{mode: MapMode, index: number, path: number}>({mode: 'game', index: 0, path: 0}); 
    const [coord, setCoord] = useState<Coordinates | undefined>(undefined); 
    const [popupCoord, setPopupCoord] = useState<{lat: number, lng: number} | undefined>(undefined); 
    const mapRef = useRef<MapRef>(null);
    const geolocateRef = useRef<any>(null); 

    const FocusOnPin = useCallback((lng: number, lat: number, zoom_offset: number = 0) => {
        mapRef.current?.flyTo({
            center: [lng, lat] ,
            duration: 2000, // Duration in milliseconds
            zoom: MAP_ZOOM + zoom_offset,       // Optional: adjust zoom level on arrival
            essential: true
        });
    }, []);  

    const user_pin = useMemo(() => {
        return (
            coord ? 
                <Marker
                    key={`active-user`}
                    latitude={coord.latitude}
                    longitude={coord.longitude}
                    anchor='bottom'
                    offset={[0, 20]}
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        console.log(`user}`)
                    }}
                    style={{
                        cursor: 'pointer',
                        zIndex: 1
                    }}
                >
                    <PlayerDisplay name={world.player.name} position={0} icon={world.player.icon}/>
                </Marker> 
            : undefined
        )
    }, [coord]); 

    const game_pins = useMemo(() => world.games?.hunts.map((g, index) => {
        return ( world.games ? 
            <Marker
                key={`event_marker-${index}`}
                latitude={g.coord[0]}
                longitude={g.coord[1]}
                anchor='bottom'
                onClick={e => {
                    e.originalEvent.stopPropagation();
                    FocusOnPin(g.coord[1], g.coord[0]);
                    setPopupCoord({lat: g.coord[0], lng: g.coord[1]}); 
                    setSelected({ mode: 'game', index: index, path: 0}); 
                    
                }}
                style={{
                    cursor: 'pointer',
                    zIndex: 2
                }}
            >
                <GameMapPin/>
            </Marker> : <></>
        )
    }), [world.games]);

    const player_pins = useMemo(() => world.players.map((p, i) => {
        return world.id ?  
            <Marker
                key={`player-${i}`}
                latitude={p.latitude}
                longitude={p.longitude}
                anchor='bottom'
                onClick={e => {
                    e.originalEvent.stopPropagation();
                }}
                style={{
                    cursor: 'pointer',
                    zIndex: 1
                }}
            >
                <PlayerDisplay name={p.name} position={i} icon={p.icon}/>
            </Marker> : undefined
    }), [world.players]);
    
    const pins = useMemo(() => world.trials.flatMap((clue, index) =>
        clue.location.flatMap((c, p) => {
            if(world.paths.length - 1 < index)
                return undefined; 
            
            if(world.paths[index] !== p)
                return undefined
            
            return <Marker
                key={`marker-${index}-${p}`}
                latitude={c[0]}
                longitude={c[1]}
                anchor='bottom'
                onClick={e => {
                    e.originalEvent.stopPropagation();
                    setSelected({ mode: 'trial', index: index, path: p}); 
                    setPopupCoord({lat: c[0], lng: c[1]});
                    FocusOnPin(c[1], c[0], 1.5);
                }}
                style={{
                    cursor: 'pointer',
                    zIndex: 1
                }}
            >
                <Place color={
                        world.current > index ? 
                            'success' :  inRange(coord, {latitude: c[0], longitude: c[1]}) ? 'primary' : 'secondary'
                    }
                /> 
            </Marker>
        })
    ), [world.trials, world.current]);
    // ---------------------------------------------------
    return (
        <Map
            ref={mapRef}
            attributionControl={false}
            onLoad={(e) => {
                geolocateRef.current?.trigger(); 

                const _map = e.target; 
                const style = _map.getStyle(); 

                // Remove other icons 
                if(style && style.layers){
                    style.layers
                    .filter(l => l.type === 'symbol' && !l.id.includes('the-scavenger'))    
                    .forEach(l =>  _map.removeLayer(l.id))
                }; 
            }}

            initialViewState={{
                latitude: world.player.latitude,
                longitude: world.player.longitude,
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
                showAccuracyCircle={true}
                showUserLocation={true}
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
                            latitude: e.coords.latitude,
                            longitude: e.coords.longitude
                        }
                    })); 
                }}
            />

            {world.id ? pins : game_pins}
            {player_pins}
            {user_pin}
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
                        inRange(coord, {latitude: popupCoord.lat, longitude: popupCoord.lng})
                        ? <GamePage selected={selected} FocusOnPin={FocusOnPin} setPopupCoord={setPopupCoord}/>
                        : "You are not in range"
                    }
                </Popup>
            )}
        </Map>
    );
}; 

export default GameMap;