const firstNameElement = document.querySelector("#first-name");
const lastNameElement = document.querySelector("#last-name");
const ageElement = document.querySelector("#age");
const signUpEmailElement = document.querySelector("#email-signup");
const signUpPasswordElement = document.querySelector("#password-signup");
const signInEmailElement = document.querySelector("#email-signin");
const signInPasswordElement = document.querySelector("#password-signin");

const signUpBtn = document.querySelector("#sign-up");
const signInBtn = document.querySelector("#sign-in");

async function signInAndMove(res) {
  window.localStorage.setItem("userId", res.user._id);
  updateNavBar();
  if (window.localStorage.getItem("tripId")) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trip_id: window.localStorage.getItem("tripId"),
        user_id: window.localStorage.getItem("userId"),
      }),
    };
    await fetch("https://tickethack-back-ten.vercel.app/carts", options);
    window.location.assign("./cart.html");
  } else {
    window.location.assign("../index.html");
  }
}

signUpBtn.addEventListener("click", async () => {
  const firstname = firstNameElement.value;
  const lastname = lastNameElement.value;
  const age = ageElement.value;
  const email = signUpEmailElement.value;
  const password = signUpPasswordElement.value;
  const profilePictureURL = `https://robohash.org/${firstname + lastname}.png`;
  options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstname,
      lastname,
      age,
      email,
      password,
      profilePictureURL,
    }),
  };
  const res = await fetch(
    "https://tickethack-back-ten.vercel.app/users",
    options
  ).then((r) => r.json());
  if (res.result) {
    signUpBtn.textContent = "✅";
    signInAndMove(res);
  } else {
    alert(res.error);
  }
});

signInBtn.addEventListener("click", async () => {
  const email = signInEmailElement.value;
  const password = signInPasswordElement.value;
  options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  };
  const res = await fetch(
    "https://tickethack-back-ten.vercel.app/users/signin",
    options
  ).then((r) => r.json());
  if (res.result) {
    signInAndMove(res);
  } else {
    alert(res.error);
  }
});
