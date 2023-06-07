const mapElement = document.querySelector('#map2');
const map = L.map(mapElement).setView([50.4501, 30.5234], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

map.removeControl(map.zoomControl);

const btn = document.querySelector('.btn');
const mapInfo = document.querySelector('.map-info');
const mapInfoUser = document.querySelector('.map-info-user');

btn.addEventListener('click', () => {
  map.locate({ setView: true, maxZoom: 16 });
});

map.on('locationfound', (e) => {
  const { lat, lng } = e.latlng;

  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { address } = data;

      const userAddress = `${address.road}, ${address.house_number}`;

      const userAddressElement = document.querySelector('.user-address');
      userAddressElement.textContent = userAddress;

      mapInfoUser.classList.remove('hidden');
      mapInfo.classList.replace('map-info', 'map-info-user');
    })
    .catch(error => console.log(error));
});