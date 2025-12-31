const ipInput = document.getElementById('ip_address_input');
const searchBtn = document.querySelector('.ip-search-btn');

const userIpAddress = document.getElementById('user_ip_address');
const userLocation = document.getElementById('user_location');
const userTimezone = document.getElementById('user_timezone');
const userISP = document.getElementById('user_isp');

const CONFIG = {
    functionUrl: '/api/ipinfo'
};

let map;
let marker;

function initMap(lat = 51.505, lng = -0.09, zoom = 13) {
    map = L.map('map').setView([lat, lng], zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    marker = L.marker([lat, lng]).addTo(map);
}

function updateMap(lat, lng) {
    if (!map) {
        initMap(lat, lng);
    } else {
        map.setView([lat, lng], 13)
    }

    if (marker) {
        marker.remove();
    }
    marker = L.marker([lat, lng]).addTo(map);
}


async function fetchIPData(ipAddress = '') {
    try {
        const url = ipAddress
                    ? `${CONFIG.functionUrl}?ip=${encodeURIComponent(ipAddress)}`
                    : CONFIG.functionUrl;
        const response = await fetch(url);

        if(!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching IP data:', error);
        throw error;
    }
}

function updateUI(data) {

    userIpAddress.textContent = data.ip || 'N/A';

    const locationParts = [data.city, data.country, data.postal].filter(Boolean).join(', ');
    userLocation.textContent = locationParts || 'N/A';

    userTimezone.textContent = data.timezone || 'N/A';
    userISP.textContent = data.org || 'N/A';

    if(data.loc) {
        const [lat, lng] = data.loc.split(',').map(Number);
        const location = [data.city, data.region, data.country_code].filter(Boolean).join(', ');
        updateMap(lat, lng, location);
    }
}


async function handleSearchIP(ip = '') {
    try {
        userIpAddress.textContent = 'Loading...';
        userLocation.textContent = 'Loading...';
        userTimezone.textContent = 'Loading...';
        userISP.textContent = 'Loading...';

        const data = await fetchIPData(ip);
        updateUI(data);

    } catch (error) {
       userIpAddress.textContent = 'Error';
        userLocation.textContent = 'N/A';
        userTimezone.textContent = 'N/A';
        userISP.textContent = 'N/A';
       alert("Failed to find IP address details. Please check the IP and try again")
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initMap()
    handleSearchIP();
});