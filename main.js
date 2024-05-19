// Initialize the map
function initMap() {
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.on('click', handleMapClick);
  
    // Center the map on the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          map.setView([lat, lng], 13);
        },
        () => {
          console.error('Error getting user location');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  }
  
  // Show the vote booth
  async function showVoteBooth(lat, lng) {
    const voteBooth = document.getElementById('vote-booth');
    voteBooth.style.display = 'block';
    console.log(lat, lng);
  
    const locationData = await fetchLocationDetails(lat, lng);
    if (locationData) {
      currentLocation = {
        lat: lat,
        lng: lng,
        street: locationData.address.road || null
      };
    }
  }
  
  // Handle map click
  function handleMapClick(event) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    showVoteBooth(lat, lng);
  }
  
  // Initialize the app
  document.addEventListener('DOMContentLoaded', () => {
    initMap();
    addVoteButtonClickListeners();
  });
  
  // Your other functions (fetchLocationDetails, saveVote, handleVoteButtonClick, addVoteButtonClickListeners) remain the same
  
      

// Function to fetch location details using Nominatim API
async function fetchLocationDetails(lat, lng) {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    try {
      const response = await fetch(nominatimUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    }
  }
  
  // Save the user's vote to Firestore
  async function saveVote(vote) {
    try {
      await db.collection('votes').add(vote);
      console.log('Vote saved to Firestore.');
    } catch (error) {
      console.error('Error saving vote to Firestore:', error);
    }
  }
  
  // Handle atmosphere vote button clicks
  async function handleVoteButtonClick(atmosphere) {
    const vote = {
      userId: 'unique_user_id', // Replace this with the actual user ID
      atmosphere: atmosphere,
      location: {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        street: currentLocation.street
      },
      timestamp: firebase.firestore.Timestamp.now()
    };
  
    await saveVote(vote);
  }
  
  // Add event listeners to the vote buttons
  function addVoteButtonClickListeners() {
    const cityButton = document.getElementById('city');
    const countryButton = document.getElementById('country');
  
    cityButton.addEventListener('click', () => handleVoteButtonClick('city'));
    countryButton.addEventListener('click', () => handleVoteButtonClick('country'));
  }
