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

    if(schedules.length == 0) {
        const tr = document.createElement('tr')

        const name = document.createElement('td')
        name.innerHTML = '-'
        const type = document.createElement('td')
        type.innerHTML = '-'
        const date = document.createElement('td')
        date.innerHTML = '-'
        const time = document.createElement('td')
        time.innerHTML = '-'
        const price = document.createElement('td')
        price.innerHTML = '-'
        const status = document.createElement('td')
        status.innerHTML = '-'

        tr.appendChild(name)
        tr.appendChild(type)
        tr.appendChild(date)
        tr.appendChild(time)
        tr.appendChild(price)
        tr.appendChild(status)

        document.getElementById("bookingTable").appendChild(tr)
        return;
    }

    schedules.forEach(schedule => {
        const dbStartDate = new Date(`${schedule.scheduleDate}T${schedule.startTime}`)
        const dbEndDate = new Date(`${schedule.scheduleDate}T${schedule.endTime}`)
        const options = { day: 'numeric', month: 'long', year: 'numeric' }
        const formattedDate = dbStartDate.toLocaleDateString('en-GB', options)

        const currentDate = new Date()

        const tr = document.createElement('tr')

        const name = document.createElement('td')
        name.innerHTML = schedule.courtName

        const type = document.createElement('td')
        type.innerHTML = schedule.courtTypeName

        const date = document.createElement('td')
        date.innerHTML = formattedDate

        const time = document.createElement('td')
        time.innerHTML = `${schedule.startTime.slice(0, 5)}-${schedule.endTime.slice(0, 5)}`

        const price = document.createElement('td')
        // price.innerHTML = schedule.courtPrice

        const totalCourtPriceInInt = parseInt(schedule.courtPrice, 10);
        let totalCourtPriceInString = (totalCourtPriceInInt / 1000).toLocaleString('id-ID', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
          }).replace(',', '.')
        price.innerHTML = `Rp ${totalCourtPriceInString}`

        const status = document.createElement('td')
        if(currentDate < dbStartDate) {
            status.innerHTML = 'Upcoming'
        } else if(currentDate > dbEndDate) {
            status.innerHTML = 'Done'
        } else if(currentDate > dbStartDate && currentDate < dbEndDate) {
            status.innerHTML = 'Ongoing'
        }

        tr.appendChild(name)
        tr.appendChild(type)
        tr.appendChild(date)
        tr.appendChild(time)
        tr.appendChild(price)
        tr.appendChild(status)

        document.getElementById("bookingTable").appendChild(tr)

        // document.getElementById("bookingListDiv").innerHTML += `
        //     <br/>
        //     <div>
        //         <p>${schedule.courtName}</p>
        //         <p>${formattedDate}</p>
        //         <p>${schedule.startTime.slice(0, 5)}-${schedule.endTime.slice(0, 5)}</p>
        //         <p>${schedule.courtAddress}</p>
        //         ${currentDate < dbStartDate ? '<p>status: upcoming</p>' : '' }
        //         ${currentDate > dbEndDate ? '<p>status: done</p>' : '' }
        //         ${currentDate > dbStartDate && currentDate < dbEndDate ? '<p>status: ongoing</p>' : '' }
        //     </div>
        // `
    });

}