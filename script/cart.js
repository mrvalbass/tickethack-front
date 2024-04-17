const cartContainer = document.querySelector("#cart-container");
const totals = document.querySelector("#totals");
const total = totals.querySelector("#total");

async function displayCart() {
  const data = await fetch(
    "https://tickethack-back-ten.vercel.app/carts/"
  ).then((r) => r.json());
  if (data.allTripsInCart.length !== 0) {
    totals.classList.remove("opacity-0");
    cartContainer.innerHTML = "";
    const cartTitle = document.createElement("p");
    cartTitle.textContent = "My cart";
    cartContainer.appendChild(cartTitle);
    data.allTripsInCart.forEach((trip) => {
      cartContainer.appendChild(createTrip(trip));
    });
    const totalAmount = data.allTripsInCart.reduce(
      (acc, val) => acc + val.price,
      0
    );
    total.textContent = totalAmount;
  } else {
    totals.classList.add("opacity-0");
    cartContainer.innerHTML = `
    <p>No tickets in your cart.</p>
    <p>Why not plan a trip?</p>`;
  }
}

displayCart();

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
  const book = document.createElement("button");

  path.textContent = `${trip.departure} > ${trip.arrival}`;
  time.textContent = `${`${new Date(trip.date).getUTCHours()}`.padStart(
    2,
    "0"
  )}:${`${new Date(trip.date).getMinutes()}`.padStart(2, "0")}`;
  price.textContent = `${trip.price}€`;
  book.textContent = "X";
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

cartContainer.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    const options = { method: "DELETE" };
    const trip_id = e.target.parentNode.dataset.id;
    const response = await fetch(
      `https://tickethack-back-ten.vercel.app/carts/${trip_id}`,
      options
    ).then((r) => r.json());
    if (cartContainer.children.length <= 2) await displayCart();
    const totalAmount = await fetch(
      "https://tickethack-back-ten.vercel.app/carts/"
    )
      .then((r) => r.json())
      .then((data) =>
        data.allTripsInCart.reduce((acc, val) => acc + val.price, 0)
      );
    total.textContent = totalAmount;
    if (response.result) e.target.parentNode.remove();
  }
});

totals.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    const trip_id = Array.from(cartContainer.children)
      .slice(1)
      .map((elem) => elem.dataset.id)
      .join(",");
    const bookingsOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trip_id }),
    };
    await fetch(
      `https://tickethack-back-ten.vercel.app/bookings/`,
      bookingsOptions
    );
    const cartOptions = { method: "DELETE" };
    await fetch(`https://tickethack-back-ten.vercel.app/carts/`, cartOptions);
    window.location.assign("./bookings.html");
  }
});
