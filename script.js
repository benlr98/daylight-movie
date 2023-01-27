
let userLocation;


function getUserPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      options
    );
  });
}

async function getSunriseSunset() {
  try {
    let userLocation = await getUserPosition();
    // TODO: let user type in specific coordinates if wanted 
    let userLat = await userLocation.coords.latitude;
    let userLong = await userLocation.coords.longitude;
    // TODO: let a user enter in a date
    let date = false || "today"
    let daylightData = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${userLat}&lng=${userLong}&date=${date}`
    );

    console.log(daylightData);
  } catch (error) {
    console.log(error);
  }
}

getSunriseSunset();
