const navBar = document.querySelector("nav");
const cartLink = navBar.firstElementChild;
const bookingsLink = cartLink.nextElementSibling;
const userLink = navBar.querySelector("#user-status");
const userName = userLink.querySelector("a");

async function updateNavBar() {
  if (!window.localStorage.getItem("userId")) {
    cartLink.classList.add("hidden");
    bookingsLink.classList.add("hidden");
    userName.textContent = "Sign Up / Sign In";
  } else {
    cartLink.classList.remove("hidden");
    bookingsLink.classList.remove("hidden");
    const response = await fetch(
      `https://tickethack-back-ten.vercel.app/users/${window.localStorage.getItem(
        "userId"
      )}`
    ).then((r) => r.json());
    if (response.result) {
      const profilePicture = document.createElement("img");
      profilePicture.src = response.user.profilePictureURL;
      profilePicture.classList.add(
        "rounded-full",
        "size-8",
        "border-[#215cae]",
        "border-2"
      );
      userName.textContent = response.user.firstname;
      userLink.insertBefore(profilePicture, userName);
    }
  }
}

updateNavBar();

userLink.addEventListener("click", () => {
  if (window.localStorage.getItem("userId")) {
    localStorage.clear();
    updateNavBar();
  }
});
