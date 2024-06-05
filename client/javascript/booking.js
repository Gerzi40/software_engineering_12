import { getScheduleByRenterId, getUserByUserId } from "./module.js"

window.onload = async () => {

    const userId = localStorage.getItem("user")

    if(userId == null) {
        document.getElementById('background').style.display = 'block'
        document.getElementById('login').style.display = 'flex'
        return
    }

    if(localStorage.getItem('user-role') != 'renter') {
        window.location.href = "./index.html"
    }

    const schedules = await getScheduleByRenterId(userId)

    schedules.forEach(schedule => {
        const dbStartDate = new Date(`${schedule.scheduleDate}T${schedule.startTime}`)
        const dbEndDate = new Date(`${schedule.scheduleDate}T${schedule.endTime}`)
        const options = { day: 'numeric', month: 'long', year: 'numeric' }
        const formattedDate = dbStartDate.toLocaleDateString('en-GB', options)

        const currentDate = new Date()

        document.getElementById("bookingListDiv").innerHTML += `
            <br/>
            <div>
                <p>${schedule.courtName}</p>
                <p>${formattedDate}</p>
                <p>${schedule.startTime.slice(0, 5)}-${schedule.endTime.slice(0, 5)}</p>
                <p>${schedule.courtAddress}</p>
                ${currentDate < dbStartDate ? '<p>status: upcoming</p>' : '' }
                ${currentDate > dbEndDate ? '<p>status: done</p>' : '' }
                ${currentDate > dbStartDate && currentDate < dbEndDate ? '<p>status: ongoing</p>' : '' }
            </div>
        `
    });

}