export default function convertCoordinatesToXYZ(lat: number, lon: number, alt: number, earthRadius: number = 6371000): [number, number, number] {
    // const earthRadius = 6371000; // Radius of the Earth in meters

    const latRad = lat * (Math.PI / 180);
    const lonRad = lon * (Math.PI / 180);

    const x = (earthRadius + alt) * Math.cos(latRad) * Math.cos(lonRad);
    const y = (earthRadius + alt) * Math.cos(latRad) * Math.sin(lonRad);
    const z = (earthRadius + alt) * Math.sin(latRad);

    return [x, y, z];
}