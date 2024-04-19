const bookingContainer = document.querySelector("#booking-container");
const bookingBottom = document.querySelector("#booking-bottom");

async function displayBookings() {
  const data = await fetch(
    `https://tickethack-back-ten.vercel.app/bookings/${window.localStorage.getItem(
      "userId"
    )}`
  ).then((r) => r.json());
  console.log(data.allTripsInBooking);
  if (data.allTripsInBooking.length !== 0) {
    bookingBottom.classList.remove("opacity-0");
    bookingContainer.innerHTML = "";
    const bookingTitle = document.createElement("p");
    bookingTitle.textContent = "My bookings";
    bookingContainer.appendChild(bookingTitle);
    data.allTripsInBooking.forEach((trip) => {
      bookingContainer.appendChild(createTrip(trip));
    });
  } else {
    bookingBottom.classList.add("opacity-0");
    bookingContainer.innerHTML = `
    <p>No booking yet.</p>
    <p>Why not plan a trip?</p>`;
  }
}

displayBookings();

function getTime(date) {
  return `${`${new Date(date).getUTCHours()}`.padStart(2, "0")}:${`${new Date(
    date
  ).getMinutes()}`.padStart(2, "0")}`;
}

function getTimeToDeparture(date) {
  const offsetInMinutes = new Date(date).getTimezoneOffset();
  const UTCdate = new Date(date).getTime() + offsetInMinutes * 60_000;
  return Math.floor((UTCdate - Date.now()) / 3_600_000);
}

function createTrip(trip) {
  const tripElement = document.createElement("div");
  tripElement.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "bg-[#f5eeee]",
    "px-2",
    "py-3",
    "rounded-sm"
  );
  tripElement.dataset.id = trip._id;

  const path = document.createElement("p");
  const time = document.createElement("p");
  const price = document.createElement("p");
  const timeToDepartureContainer = document.createElement("p");

  path.textContent = `${trip.departure} > ${trip.arrival}`;
  time.textContent = getTime(trip.date);
  price.textContent = `${trip.price}€`;
  const timeToDeparture = getTimeToDeparture(trip.date);
  if (timeToDeparture < 0) {
    timeToDepartureContainer.textContent = "Train has already left!";
  } else if (timeToDeparture === 0) {
    timeToDepartureContainer.textContent = "Departure in less than 1 hour";
  } else {
    timeToDepartureContainer.textContent = `Departure in ${timeToDeparture} ${
      timeToDeparture === 1 ? "hour" : "hours"
    }`;
  }

  tripElement.appendChild(path);
  tripElement.appendChild(time);
  tripElement.appendChild(price);
  tripElement.appendChild(timeToDepartureContainer);

  return tripElement;
}
