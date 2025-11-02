// A simple service to get the user's approximate region based on their IP.

interface GeolocationResponse {
    country_name: string;
}

export const getRegionByIP = async (): Promise<string> => {
    try {
        // Using a free, privacy-friendly geolocation API.
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
            throw new Error('Geolocation fetch failed');
        }
        const data: GeolocationResponse = await response.json();
        return data.country_name || 'United States';
    } catch (error) {
        console.warn("Could not detect region by IP, defaulting.", error);
        // Fallback in case of API failure or ad-blockers.
        return 'United States';
    }
};
