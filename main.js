// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn && window.location.pathname.endsWith('index.html')) {
        window.location.replace('dashboard.html');
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorMessage = document.getElementById('errorMessage');
            
            if (!username || !password) {
                errorMessage.textContent = 'Please enter both username and password';
                errorMessage.classList.remove('hidden');
                return;
            }
            
            // Simple login simulation
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            // Prevent default form submission and redirect manually
            window.location.replace('dashboard.html');
        });
    }

    // Handle mobile number tracking
    const trackForm = document.getElementById('trackForm');
    if (trackForm) {
        trackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const mobileNumber = document.getElementById('mobileNumber').value.trim();
            const errorMessage = document.getElementById('trackingError');
            const loadingIndicator = document.getElementById('loadingIndicator');
            
            // Validate mobile number
            const mobileRegex = /^\+?[\d\s-]{10,}$/;
            if (!mobileRegex.test(mobileNumber)) {
                errorMessage.textContent = 'Please enter a valid mobile number (minimum 10 digits)';
                errorMessage.classList.remove('hidden');
                return;
            }

            try {
                errorMessage.classList.add('hidden');
                loadingIndicator.classList.remove('hidden');
                
                // Call the location tracking function
                const locationData = await getLocation(mobileNumber);
                
                // Store the result in localStorage
                const trackingResult = {
                    mobileNumber,
                    location: locationData,
                    timestamp: new Date().toISOString()
                };
                
                // Save to history
                const history = JSON.parse(localStorage.getItem('trackingHistory') || '[]');
                history.unshift(trackingResult);
                localStorage.setItem('trackingHistory', JSON.stringify(history));
                
                // Save current result for the result page
                localStorage.setItem('currentTracking', JSON.stringify(trackingResult));
                
                // Redirect to result page
                window.location.replace('result.html');
            } catch (error) {
                errorMessage.textContent = error.message || 'An error occurred while tracking the location';
                errorMessage.classList.remove('hidden');
            } finally {
                loadingIndicator.classList.add('hidden');
            }
        });
    }

    // Display tracking result
    const resultContainer = document.getElementById('resultContainer');
    if (resultContainer) {
        const currentTracking = JSON.parse(localStorage.getItem('currentTracking'));
        if (!currentTracking) {
            window.location.replace('dashboard.html');
            return;
        }

        const { mobileNumber, location, timestamp } = currentTracking;
        document.getElementById('resultMobileNumber').textContent = mobileNumber;
        document.getElementById('resultLocation').textContent = `${location.city}, ${location.region}`;
        document.getElementById('resultCoordinates').textContent = `${location.latitude}, ${location.longitude}`;
        document.getElementById('resultTimestamp').textContent = new Date(timestamp).toLocaleString();

        // Update map iframe source
        const mapIframe = document.getElementById('map');
        if (mapIframe) {
            mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude-0.01},${location.latitude-0.01},${location.longitude+0.01},${location.latitude+0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}`;
        }
    }

    // Display tracking history
    const historyContainer = document.getElementById('historyContainer');
    if (historyContainer) {
        const history = JSON.parse(localStorage.getItem('trackingHistory') || '[]');
        if (history.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-history text-4xl mb-4"></i>
                    <p>No tracking history available</p>
                </div>
            `;
            return;
        }

        const historyHTML = history.map((item, index) => `
            <div class="bg-white rounded-lg shadow-md p-4 mb-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-lg font-semibold">${item.mobileNumber}</p>
                        <p class="text-gray-600">${item.location.city}, ${item.location.region}</p>
                        <p class="text-sm text-gray-500">${new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                    <div class="text-blue-600">
                        <i class="fas fa-map-marker-alt text-2xl"></i>
                    </div>
                </div>
            </div>
        `).join('');

        historyContainer.innerHTML = historyHTML;
    }

    // Handle logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.replace('index.html');
        });
    }
});

// Function to check login status
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && !window.location.pathname.endsWith('index.html')) {
        window.location.replace('index.html');
    }
}

// Check login status on protected pages
if (!window.location.pathname.endsWith('index.html')) {
    checkLogin();
}
