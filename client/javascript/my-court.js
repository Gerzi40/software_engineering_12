import { deleteCourt, getCourtsByOwnerId, getUserByUserId } from "./module.js"

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

        const div = document.createElement('div')

        const img = document.createElement('img')
        img.src = court.courtImage
        const name = document.createElement('p')
        name.innerHTML = `name: ${court.courtName}`
        const rating = document.createElement('p')
        rating.innerHTML = `rating: ${court.courtRating}`

        const update = document.createElement('a')
        update.href = `update-court.html?court-id=${court.courtId}`
        update.innerHTML = 'Update'
        const manual = document.createElement('a')
        manual.href = `schedule-management.html?court-id=${court.courtId}`
        manual.innerHTML = 'Manual Booking'
        const button = document.createElement('button')
        button.textContent = 'Delete'
        button.addEventListener('click', async () => {
            const res = await deleteCourt(court.courtId)
            if(res.message == 'Delete Court Success'){
                window.location.reload()
            } else  {
                alert("Ada reference di tabel lain")
            }
        })

        div.appendChild(img)
        div.appendChild(name)
        // div.appendChild(rating)
        div.appendChild(update)
        div.appendChild(manual)
        div.appendChild(button)

        document.getElementById("courtListDiv").appendChild(div)
    });

}