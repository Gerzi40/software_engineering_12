window.onscroll = () => {
    const nav = document.getElementById('nav');
    if ( window.scrollY > 0 ) {
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
        <a id="Court" href="court.html" ${window.location.href.substring(29).startsWith('court') && 'class="active"'}>Court</a>
        <a href="about.html" ${window.location.href.substring(29).startsWith('about') && 'class="active"'}>About</a>
    </div>
    <div id="renterLink">
        <a href="court.html" ${window.location.href.substring(29).startsWith('court') && 'class="active"'}>Court</a>
        <a href="booking.html" ${window.location.href.substring(29).startsWith('booking') && 'class="active"'}>Booking</a>
        <a href="about.html" ${window.location.href.substring(29).startsWith('about') && 'class="active"'}>About</a>
    </div>
    <div id="ownerLink">
        <a href="court.html" ${window.location.href.substring(29).startsWith('court') && 'class="active"'}>Court</a>
        <a href="my-court.html" ${window.location.href.substring(29).startsWith('my-court') && 'class="active"'}>My Court</a>
        <a href="insert-court.html" ${window.location.href.substring(29).startsWith('insert-court') && 'class="active"'}>Insert Court</a>
        <a href="about.html" ${window.location.href.substring(29).startsWith('about') && 'class="active"'}>About</a>
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

    if(localStorage.getItem('user-role') == 'renter') {
        document.getElementById("renterLink").style.display = "flex"
    } else {
        document.getElementById("ownerLink").style.display = "flex"
    }
}

document.getElementById("registerButton").addEventListener("click", () => {
    document.getElementById('background').style.display = 'block'
    document.getElementById('register').style.display = 'flex'
    document.getElementById('registerUsernameInput').focus()
})

document.getElementById("loginButton").addEventListener("click", () => {
    document.getElementById('background').style.display = 'block'
    document.getElementById('login').style.display = 'flex'
    document.getElementById('loginUsernameInput').focus()
})

