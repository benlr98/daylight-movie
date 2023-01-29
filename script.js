

const movieList = [
  "Lord of the Rings",
  "Shrek",
  "Forrest Gump",
  "Finding Nemo",
  "Tangled",
  "Mission Impossible",
  "Dumb and Dumber",
  "Avatar",
  "The Bourne Identity",
];



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
    let daylightResponse = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${userLat}&lng=${userLong}&date=${date}`
    );

    let dayData = await daylightResponse.json();

    insertDayLengthHTML(dayData.results.day_length);
    fetchMovieData(dayData.results.day_length);
    
  } catch (error) {
    console.log(error);
  }
}


// create a UTC date from '7:22:00 AM' string 
function createUTCDate(date) {
  let timeSplit = date.split(':');
  let isPM = timeSplit[2].split(' ')[1] === 'PM';
  
  let hours = isPM ? parseInt(timeSplit[0]) + 12 : timeSplit[0]
  let minutes = timeSplit[1]
  let seconds = timeSplit[2].split(' ')[0];
  
  let today = new Date();
  let convertedDate = new Date(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes,
      seconds
      )
      );
      
      return convertedDate;
}

// dayLength format: "00:00:00"
function insertDayLengthHTML(dayLength) {
  let hrSpanElement = document.getElementById('day-hr');
  let minSpanElement = document.getElementById('day-min');
  let secSpanElement = document.getElementById('day-sec');
  
  let timeSplit = dayLength.split(':');
  
  let newHrSpanElement = document.createElement('span');
  let newMinSpanElement = document.createElement('span');
  let newSecSpanElement = document.createElement('span');

  newHrSpanElement.innerHTML = timeSplit[0]
  newMinSpanElement.innerHTML = timeSplit[1]
  newSecSpanElement.innerHTML = timeSplit[2]

  hrSpanElement.replaceWith(newHrSpanElement);
  minSpanElement.replaceWith(newMinSpanElement);
  secSpanElement.replaceWith(newSecSpanElement);
  
}

// dayLength format: "00:00:00"
async function fetchMovieData(dayLength) {
  let timeSplit = dayLength.split(":");
  // (hrs * 60) + minutes
  let dayLengthMinutes = (parseInt(timeSplit[0] * 60)) + parseInt(timeSplit[1])

  
  let shuffledMovies = shuffle(movieList);
  let htmlListLength = 3;
  // TODO: remove api key
  let fetchMovieUrl = `https://www.omdbapi.com/?apikey=7992adaa&t=`;

  // [{}]
  let moviesToList = []

  for (let i = 0; i < htmlListLength; i++) {
    let movieTitle = shuffledMovies[i];
    let movieResponse = await fetch(fetchMovieUrl + movieTitle);
    let movieData = await movieResponse.json();

    let title = await movieData.Title;
    let runtime = await movieData.Runtime;

    let movie = {
      title,
      runtime
    }

    moviesToList.push(movie);
  }

  insertMovieListHTML(await moviesToList, dayLengthMinutes);



}

function insertMovieListHTML(movieDataList, daylightMins) {
  let ulElement = document.getElementById('movie-list');
  let liElementsString = '';
  movieDataList.forEach(movie => {

    let watchableAmount = Math.floor(daylightMins / parseInt(movie.runtime));

    liElementsString = liElementsString + `<li>Watch ${movie.title} ${watchableAmount} times.</li>`;
  });

  ulElement.innerHTML = liElementsString;
}
    
 
    
    
getSunriseSunset();


// helper Functions 
// https://javascript.info/task/shuffle 
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
