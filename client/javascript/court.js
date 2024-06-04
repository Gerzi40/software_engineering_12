import { getCourts, getUserByUserId } from "./module.js"

window.onload = async () => {

    const userId = localStorage.getItem("user")

    if(userId != null) {
        const user = await getUserByUserId(userId)
    
        if(user[0].userRole != "renter") {
            window.location.href = "./index.html"
        }
    }


    const courts = await getCourts()
    
    courts.forEach((court, index) => {
        document.getElementById("courtListDiv").innerHTML += `
            <div onclick="window.location.href = 'court-detail.html?court-id=${court.courtId}'">
                ${court.courtName}
            </div>
        `
    });
}

document.getElementsByClassName("court")