import { getCourtsByOwnerId, getUserByUserId } from "./module.js"

window.onload = async () => {

    const userId = localStorage.getItem("user")

    if(userId == null) {
        document.getElementById('background').style.display = 'block'
        document.getElementById('login').style.display = 'flex'
        return
    }

    if(localStorage.getItem('user-role') != 'owner') {
        window.location.href = "./index.html"
    }

    const courts = await getCourtsByOwnerId(userId)

    courts.forEach(court => {
        document.getElementById("courtListDiv").innerHTML += `
            <br/>
            <div>
                <p>name: ${court.courtName}</p>
                <p>rating: ${court.courtRating}</p>
                <a href="update-court.html?court-id=${court.courtId}">Update</a>
                <a href="manual-booking.html?court-id=${court.courtId}">Manual Booking</a>
            </div>
        `
    });

}