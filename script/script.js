const dateInput = document.querySelector('input[type="date"]');
const departureInput = document.querySelector("#departure");
const arrivalInput = document.querySelector("#arrival");
const searchBtn = document.querySelector("#search-btn");
const resultContainer = document.querySelector("#search-result");
const resultImg = resultContainer.querySelector("img");
const resultP = resultContainer.querySelector("p");

// Date initialization to active day
dateInput.value = `${new Date().getFullYear()}-${`${
  new Date().getMonth() + 1
}`.padStart(2, "0")}-${`${new Date().getDate()}`.padStart(2, "0")}`;

//
function createTrip(trip) {
  const tripElement = document.createElement("div");
  tripElement.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "bg-[#f5eeee]",
    "p-2",
    "rounded-sm"
  );
  tripElement.dataset.id = trip._id;

  const path = document.createElement("p");
  const time = document.createElement("p");
  const price = document.createElement("p");
  const book = document.createElement("button");

  path.textContent = `${trip.departure} > ${trip.arrival}`;
  time.textContent = `${`${new Date(trip.date).getUTCHours()}`.padStart(
    2,
    "0"
  )}:${`${new Date(trip.date).getMinutes()}`.padStart(2, "0")}`;
  price.textContent = `${trip.price}€`;
  book.textContent = "Book";
  book.classList.add(
    "text-white",
    "bg-[#5cab91]",
    "text-[0.6rem]",
    "px-2",
    "py-0.5",
    "rounded-sm"
  );

  tripElement.appendChild(path);
  tripElement.appendChild(time);
  tripElement.appendChild(price);
  tripElement.appendChild(book);

  return tripElement;
}

//Listeners
//Display data to homepage
searchBtn.addEventListener("click", async () => {
  const departure = departureInput.value;
  const arrival = arrivalInput.value;
  const date = dateInput.value;

  const data = await fetch(
    `https://tickethack-back-ten.vercel.app/trips?departure=${departure}&arrival=${arrival}&date=${date}`
  ).then((r) => r.json());
  if (data.allTripsByDestination.length !== 0) {
    resultContainer.innerHTML = "";
    resultContainer.classList.remove("gap-8", "justify-center", "items-center");
    resultContainer.classList.add("gap-4", "overflow-y-scroll");
    data.allTripsByDestination.forEach((trip) => {
      resultContainer.appendChild(createTrip(trip));
    });
  } else {
    resultContainer.classList.add("gap-8", "justify-center", "items-center");
    resultContainer.classList.remove("gap-4", "overflow-y-scroll");
    resultContainer.innerHTML = `
    <img class="size-[120px]" src="./style/images/notfound.png" alt="magnifying glass image"/>
    <div class="h-0.5 w-[200px] bg-[#5cab91]"></div>
    <p class="text-sm font-[500]">No trip found.</p>`;
  }
});

//Save data to cart
resultContainer.addEventListener("click", async (e) => {
  if ((e.target.tagName = "BUTTON")) {
    const trip_id = e.target.parentNode.dataset.id;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trip_id }),
    };
    await fetch("https://tickethack-back-ten.vercel.app/carts", options);
    window.location.assign("./pages/cart.html");
  }
});
