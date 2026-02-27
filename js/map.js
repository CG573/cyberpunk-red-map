// Image dimensions
const imageWidth = 3615;
const imageHeight = 2408;

// Create CRS (simple pixel-based system)
const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: -2
});

// Image bounds
const bounds = [[0, 0], [imageHeight, imageWidth]];

// Add image overlay
L.imageOverlay("map/nightcity.png", bounds).addTo(map);

// Fit map to image
map.fitBounds(bounds);

// Load locations from JSON
fetch("data/locations.json")
  .then(response => response.json())
  .then(locations => {
    locations.forEach(location => {
      if (!location.discovered) return;

      const marker = L.marker([location.y, location.x]).addTo(map);

      marker.bindPopup(`
        <strong>${location.name}</strong><br/>
        Faction: ${location.faction}<br/>
        ${location.description}
      `);
    });
  })
  .catch(error => {
    console.error("Error loading locations:", error);
  });

  // Coordinate display
const coordBox = document.getElementById("coord-box");
let frozen = false;

// Update on mouse move
map.on("mousemove", function (e) {
  if (frozen) return;

  const x = Math.round(e.latlng.lng);
  const y = Math.round(e.latlng.lat);

  coordBox.textContent = `X: ${x} | Y: ${y}`;
});

// Click to freeze/unfreeze coordinates
map.on("click", function () {
  frozen = !frozen;
});