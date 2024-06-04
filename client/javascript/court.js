import { getCourts, getUserByUserId, getCities, getCourtTypes } from "./module.js"

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

    const cities = await getCities()
    const courtTypes = await getCourtTypes()

    cities.forEach(city => {
        document.getElementById("locationSelect").innerHTML += `
            <option value="${city}">${city}</option>
        `
    });

    courtTypes.forEach(courtType => {
        document.getElementById("categorySelect").innerHTML += `
            <option value="${courtType.courtTypeName}">${courtType.courtTypeName}</option>
        `
    });
}

document.getElementById('findCourtButton').addEventListener('click', () => {
    window.location.href = 'court.html?name=b'
})