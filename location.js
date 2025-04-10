// Simulated location data
const locationDatabase = {
    '+1234567890': {
        latitude: 24.5854,
        longitude: 73.7125,
        city: 'Udaipur',
        region: 'Rajasthan, India'
    },
    '+9876543210': {
        latitude: 51.5074,
        longitude: -0.1278,
        city: 'London',
        region: 'England, UK'
    },
    '+8529631470': {
        latitude: 35.6762,
        longitude: 139.6503,
        city: 'Tokyo',
        region: 'Japan'
    }
};

// Simulated API call to get location
function getLocation(mobileNumber) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Remove any spaces or dashes from the mobile number
            const cleanNumber = mobileNumber.replace(/[\s-]/g, '');
            
            // Check if the mobile number exists in our database
            if (locationDatabase[cleanNumber]) {
                resolve(locationDatabase[cleanNumber]);
            } else {
                // Simulate random locations for unknown numbers
                const randomLocations = [
                    {
                        latitude: 48.8566,
                        longitude: 2.3522,
                        city: 'Paris',
                        region: 'France'
                    },
                    {
                        latitude: -33.8688,
                        longitude: 151.2093,
                        city: 'Sydney',
                        region: 'Australia'
                    },
                    {
                        latitude: 19.4326,
                        longitude: -99.1332,
                        city: 'Mexico City',
                        region: 'Mexico'
                    }
                ];
                
                const randomLocation = randomLocations[Math.floor(Math.random() * randomLocations.length)];
                resolve(randomLocation);
            }
        }, 1500); // Simulate network delay
    });
}
