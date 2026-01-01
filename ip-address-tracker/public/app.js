const ipInput = document.getElementById('ip_address_input');
const searchBtn = document.querySelector('.ip-search-btn');
const ipForm = document.querySelector('.ip-address-form');

const userIpAddress = document.getElementById('user_ip_address');
const userLocation = document.getElementById('user_location');
const userTimezone = document.getElementById('user_timezone');
const userISP = document.getElementById('user_isp');

const CONFIG = {
    functionUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '/api/ipinfo'
    : '/.netlify/functions/ipinfo'
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

function updateMap(lat, lng, popupText) {
    if (!map) {
        initMap(lat, lng);
    } else {
        map.setView([lat, lng], 13)
    }

    if (marker) {
        marker.remove();
    }
    marker = L.marker([lat, lng]).addTo(map);

    if (popupText) {
        marker.bindPopup(popupText).openPopup();
    }
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

function formatTimezone(timezone) {
    if (!timezone) return 'N/A';

    try {
        const now = new Date();
        const options = {timeZone: timezone, timeZoneName: 'short'};
        const formatter = new Intl.DateTimeFormat('en-US', options);

        const timeZoneDate = new Date(now.toLocaleString('en-US', {timeZone: timezone}));
        const utcDate = new Date(now.toLocaleString('en-US', {timeZone: 'UTC'}));
        const offsetMinutes = (timeZoneDate - utcDate) / (1000 * 60);
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const offsetMins = Math.abs(offsetMinutes) % 60;

        const sign = offsetMinutes >= 0 ? '+' : '-';
        const formattedOffset = `UTC${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`

        return formattedOffset;

    } catch (error) {
        return timezone;
    }
}

function validateIP(ip) {
    if (!ip) return true;

    ip = ip.trim();

    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Regex.test(ip)) {
        const parts = ip.split('.');
        return parts.every(part => {
            const num = parseInt(part);
            return num >= 0 && num <= 255;
        });
    }

    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    if (ipv6Regex.test(ip)) {
        return true;
    }

    return false;
}

function showError(message) {
    let errorEl = document.getElementById('ip-error-message');

    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = 'ip-error-message';
        errorEl.classList.add('error-message');

        ipForm.appendChild(errorEl);
    }
    
    errorEl.textContent = message;
    errorEl.classList.add('show');
    
    if (ipInput) {
        ipInput.classList.add('input-error');
    }
}

function hideError(message) {
    let errorEl = document.getElementById('ip-error-message');

    if (errorEl) {
        errorEl.classList.remove('show');
    }
    if (ipInput) {
        ipInput.classList.remove('input-error');
    }
}

function setLoadingState(isLoading) {
    if (searchBtn) {
        searchBtn.disabled = isLoading;

        if (isLoading) {
            searchBtn.innerHTML = `
                <svg class="spinner" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle class="spinner-circle" cx="12" cy="12" r="10" stroke-width="3" fill="none"/>
                </svg>
            `;
        } else {
            searchBtn.innerHTML = `
                <svg class="arrow-icon" viewBox="-19.04 0 75.804 75.804" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(-831.568 -384.448)">
                        <path d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z"
                        fill="currentColor"/>
                    </g>
                </svg>
            `;
        }
    }

    if (ipInput) {
        ipInput.disabled = isLoading;
    }

    if (isLoading) {
        userIpAddress.textContent = 'Loading...';
        userLocation.textContent = 'Loading...';
        userTimezone.textContent = 'Loading...';
        userISP.textContent = 'Loading...';
    }
}

async function handleSearchIP(ip = '') {
    try {
       hideError();

       ip = ip.trim();

       if (ip && !validateIP(ip)) {
        showError('Please enter a valid IP address (e.g., 8.8.8.8)');
        return;
       }

       setLoadingState(true)

        const data = await fetchIPData(ip);
        updateUI(data);

    } catch (error) {
        userIpAddress.textContent = 'Error';
        userLocation.textContent = 'N/A';
        userTimezone.textContent = 'N/A';
        userISP.textContent = 'N/A';
        
        showError('Unable to find this IP address. Please check and try again.');
    } finally {
        setLoadingState(false);
    }
}

function updateUI(data) {

    userIpAddress.textContent = data.ip || 'N/A';

    const locationParts = [data.city, data.country, data.postal].filter(Boolean).join(', ');
    userLocation.textContent = locationParts || 'N/A';

    userTimezone.textContent = formatTimezone(data.timezone);
    userISP.textContent = data.org || 'N/A';

    if(data.loc) {
        const [lat, lng] = data.loc.split(',').map(Number);
        const location = [data.city, data.region, data.country].filter(Boolean).join(', ');
        updateMap(lat, lng, location);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initMap()
    handleSearchIP();

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const ip = ipInput ? ipInput.value.trim() : '';
            handleSearchIP(ip);
        });
    }

    if (ipInput) {
        ipInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchIP(ipInput.value.trim());
            }
        });

        ipInput.addEventListener('input', () => {
            hideError();
        })
    }
});