window.onscroll = () => {
    const nav = document.getElementById('nav');
    if ( window.pageYOffset > 0 ) {
        nav.classList.add("backgroundWhite");
    } else {
        nav.classList.remove("backgroundWhite");
    }
}

document.getElementById("nav").innerHTML = `
    <div id="navLogo">
        <a href="index.html">BOOKSPORT</a>
    </div>
    <div id="guestLink">
        <a href="court.html">Court</a>
        <a href="about.html">About</a>
    </div>
    <div id="renterLink">
        <a href="court.html">Court</a>
        <a href="booking.html">Booking</a>
        <a href="about.html">About</a>
    </div>
    <div id="ownerLink">
        <a href="my-court.html">My Court</a>
        <a href="manual-booking.html">Manual Booking</a>
        <a href="about.html">About</a>
    </div>

    <div>
        <a id="loginButton">Sign In</a>
        <a id="registerButton">Sign Up</a>
        <a href="my-account.html" id="myAccountButton">My Account</a>
    </div>
`

if(localStorage.getItem("user") != null) {
    document.getElementById("registerButton").style.display = "none"
    document.getElementById("loginButton").style.display = "none"
    document.getElementById("myAccountButton").style.display = "inline"

    document.getElementById("guestLink").style.display = "none"
    document.getElementById("renterLink").style.display = "flex"
    document.getElementById("ownerLink").style.display = "flex"
}

document.getElementById("registerButton").addEventListener("click", () => {
    document.getElementById('background').style.display = 'block'
    document.getElementById('register').style.display = 'flex'
})

document.getElementById("loginButton").addEventListener("click", () => {
    document.getElementById('background').style.display = 'block'
    document.getElementById('login').style.display = 'flex'
})