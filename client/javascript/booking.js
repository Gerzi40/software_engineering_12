import { getScheduleByRenterId, getUserByUserId } from "./module.js"

window.onload = async () => {

    const userId = localStorage.getItem("user")

    if(userId == null) {
        window.location.href = "./index.html"
    }

    const user = await getUserByUserId(userId)

    if(user[0].userRole != "renter") {
        window.location.href = "./index.html"
    }

    // const userId = localStorage.getItem("user")
    // const user = await getUserByUserId(userId)
    
    const schedules = await getScheduleByRenterId(user[0].userId)
    // console.log(schedules)

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