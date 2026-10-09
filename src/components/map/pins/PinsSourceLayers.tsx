import {useMemo, useEffect} from 'react'; 
import { Source, Layer, useMap} from 'react-map-gl/maplibre';
import { useWorld } from '../../../context';
import { get_distance, in_range } from '../../../handlers/DistanceHandlers';
import type { LatLng } from '../../../assets/types';

export function QuestLayer() {
    const { world } = useWorld();

    const geoJsonData = useMemo(() => {
        const games = world.games; 
        if(!Array.isArray(games)){
            return {
                "type": "FeatureCollection" as const,
                "features": []
            };
        };
        
        const features = games.map((h, i) => ({
            "type": "Feature" as const, // Cast to literal type for TypeScript safety
            "id": `game_pin_${i}`,
            "properties": {
                "id": i, 
                "title": h.title,
                "type": h.type,
                "in_range": true,
                "description": h.description,
                "distance_meters": get_distance(h.location, world.player.location, true)
            },
            "geometry": {
                "type": "Point" as const,
                "coordinates": [h.location.longitude, h.location.latitude]
            }
        }));
    
        return {
            "type": "FeatureCollection" as const,
            "features": features
        };
    }, [world.games]);
  
    return (
        <Source id="game-pins-source" type="geojson" data={geoJsonData}>
            <Layer 
                id="scavenger-game-layer" 
                type="symbol" 
                layout={{ 
                    'icon-image': 'quest', 
                    'icon-size': 0.56,
                    'icon-allow-overlap': true, 
                }}
            />
        </Source>
    );
};

export function ObjectiveLayer() {
    const { world } = useWorld();

    const geoJsonData = useMemo(() => {
        const trials = world?.objectives
        const i = world.current.index;
        const p = world.current.path; 
        const can_solve = (id: number, path: number, coord: LatLng ): boolean => {
            return in_range(
                world.player.location,
                coord
            ) && (id == i && path == p); 
        }; 

        if(!Array.isArray(trials)){
            return {
                "type": "FeatureCollection" as const,
                "features": []
            };
        };

        const features = trials.flatMap((t, id) => (
            t.clue.flatMap((text, path) => ({
                "type": "Feature" as const, // Cast to literal type for TypeScript safety
                "id": `trial_pin_${id}_${path}`,
                "properties": {
                    "id": id,
                    "path": path,
                    "active": id == i && path == p,
                    "locked": can_solve(id, path, t.location[path]),
                    "text": text,
                    "distance_meters": get_distance(t.location[path], world.player.location, true)
                },
                "geometry": {
                    "type": "Point" as const,
                    "coordinates": [t.location[path].longitude, t.location[path].latitude]
                }

            })))
        );
        
        return {
            "type": "FeatureCollection" as const,
            "features": features.flat()
        };
    }, [world?.objectives, world.current]);
  
    return (
        <Source id="trial-pin-source" type="geojson" data={geoJsonData}>
            {
                <Layer 
                    id="scavenger-trial-layer" 
                    type="symbol" 
                    filter={['==', ['get', 'active'], true]}
                    layout={{ 
                        'icon-image': ['case', ['get', 'locked'], 'search', 'locked'], 
                        'icon-size': 0.4,
                        'icon-allow-overlap': true, 
                    }}
                />
            }
        </Source>
    );
};

export function MainCharacterLayer() {
    const { world } = useWorld();
    const { current: map } = useMap(); // Gets the raw map instance
    
    const mc = world.player;

    // 1. Update the data directly in MapLibre without re-rendering React
    useEffect(() => {
        if (!map) return;

        const source = map.getSource('mc-pin-source') as maplibregl.GeoJSONSource;

        if (source) {
            // Directly push the new coordinates to the GPU
            source.setData({
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "id": "mc_pin",
                    "properties": mc,
                    "geometry": {
                        "type": "Point",
                        "coordinates": [mc.location.longitude, mc.location.latitude]
                    }
                }]
            });
        }
    }, [mc.location.latitude, mc.location.longitude, map]); // Only runs when coordinates change

    // 2. Initial render returns an empty collection so the layer exists
    return (
        <Source id="mc-pin-source" type="geojson" data={{ type: "FeatureCollection", features: [] }}>
            {/*<Layer 
                id='scavenger-mc-pulse-layer'
                type="circle" 
                paint={{
                    'circle-radius': ['coalesce', ['get', 'pulseRadius'], 0], 
                    'circle-opacity': ['coalesce', ['get', 'pulseOpacity'], 0],
                    'circle-color': '#198EC8',
                    'circle-stroke-width': 0
                }} 
            />*/}
            <Layer 
                id="scavenger-mc-layer" 
                type="symbol" 
                layout={{ 
                    'icon-image': `user-${mc.icon}`, 
                    'icon-size': 0.25,
                    'icon-allow-overlap': true, 
                }}
            />
        </Source>
    );
}

export function OtherPlayersLayer() {
    const { world } = useWorld();
    const players = world.players; 
    const { current: map } = useMap(); // Gets the raw map instance
    
    // 1. Update the data directly in MapLibre without re-rendering React
    useEffect(() => {
        if (!map) return;

        const source = map.getSource('players-pin-source') as maplibregl.GeoJSONSource;
        if (source) {
            // Directly push the new coordinates to the GPU
            source.setData({
                "type": "FeatureCollection",
                "features": players.map((p, i) => ({
                    "type": "Feature",
                    "id": `players_pin_${i}`,
                    "properties": p,
                    "geometry": {
                        "type": "Point",
                        "coordinates": [p.location.longitude, p.location.latitude]
                    }
                }))
            });
        }
    }, [players, map]); // Only runs when coordinates change

    // 2. Initial render returns an empty collection so the layer exists
    return (
        <Source id="players-pin-source" type="geojson" data={{ type: "FeatureCollection", features: [] }}>
            <Layer 
                id="scavenger-players-layer" 
                type="symbol" 
                layout={{ 
                    'icon-image': ['get', 'icon' as string], 
                    'icon-size': 0.15,
                    'icon-allow-overlap': true, 
                }}
            />
        </Source>
    );
}