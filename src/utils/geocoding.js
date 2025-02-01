export async function reverseGeocode(lat, lon) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await response.json();
        console.log('****************',data)
        
        const address = data.address;
        return {
            state: address.state,
            district: address.county || address.state_district,
            city: address.city || address.town || address.village,
            taluka: address.suburb || address.subdivision,
            village: address.village,
            isRural: !address.city && (!!address.village || !!address.hamlet)
        };
    } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return null;
    }
}
