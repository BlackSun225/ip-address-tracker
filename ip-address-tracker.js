//const myIP = "192.168.43.45";
var defaultUrl = "https://geo.ipify.org/api/v2/country,city?apiKey=at_VvShOKYviRG5EGSEouxIFiZhneh53";
var map = L.map('map');
const ipRegexp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
const domainRegexp = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;

async function drawMap(ip) {
  if(ip && ipRegexp.test(ip)) {
    defaultUrl += `&ipAddress=${ip}`;
  }else if(ip && !ipRegexp.test(ip)) {
    defaultUrl += `&domain=${ip}`;
  }
  let response = await fetch(defaultUrl);
  let data = await response.json();

  let coords = [data.location.lat, data.location.lng];
  document.getElementById("ipaddress").lastElementChild.innerHTML = data.ip;
  document.getElementById("location").lastElementChild.innerHTML = `${data.location.city}, ${data.location.region}`;
  document.getElementById("timezone").lastElementChild.innerHTML = `UTC${data.location.timezone}`;
  document.getElementById("isp").lastElementChild.innerHTML = data.isp;
  
  map.setView(coords, 15);
  
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  
  var myIcon = L.icon({iconUrl: "images/icon-location.svg"});
  L.marker(coords, {icon: myIcon}).addTo(map);
}

drawMap();
document.getElementById("btn").addEventListener("click", function(event) {
  event.preventDefault();
  let val = document.getElementById("ipordomain").value;
  if(ipRegexp.test(val) || domainRegexp.test(val)) {
    drawMap(val);
  }else{
    document.getElementById("ipordomain").value = "invalid ip or domain name";
  }
});