import { getCourtByCourtId, getScheduleByCourtIdAndDate, getScheduleTypes, getUserByUserId, insertSchedule } from "./module.js"

const dateInput = document.getElementById("dateInput")
const scheduleDiv = document.getElementById('scheduleDiv')
const paragraf = document.getElementById('paragraf')
const hiddenInput = document.getElementById('hiddenInput')
const manualBookButton = document.getElementById('manualBookButton')

const getParam = (parameterName) => {
    const url = window.location.href;
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);
    return params.get(parameterName);
}

const dateDiv = document.getElementById('dateDiv')

const fillDateDiv = () => {

    
    for(let i=0; i<6; i++) {
        let currentDate = new Date()
        // console.log(currentDate)
        currentDate.setDate(currentDate.getDate() + i)

        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

        const formattedCurrentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate()}`

        let dayOfWeek = currentDate.toLocaleString('default', { weekday: 'long' }); // Short day name (e.g., "Tue")
        let month = currentDate.toLocaleString('default', { month: 'short' }); // Short month name (e.g., "Jun")
        let date = currentDate.getDate().toString().padStart(2, '0'); // Day of the month
        let year = currentDate.getFullYear(); // Full year

        // console.log(dayOfWeek)
        // console.log(date)

        // console.log(dateFromCurrentDate)

        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.id = 'radio' + i + 1
        radio.value = formattedCurrentDate
        radio.name = 'date'
        radio.checked = i == 0
        radio.addEventListener('change', (event) => {

            const dateee = event.target.value
            fillScheduleDiv(dateee)

        })

        const label = document.createElement('label')
        label.innerHTML = `
            ${date} ${month}
            <br/>
            <b>${dayOfWeek}</b>
        `
        label.htmlFor = 'radio' + i + 1

        dateDiv.appendChild(radio)
        dateDiv.appendChild(label)

    }

}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

    const courtId = getParam('court-id');

    if(courtId == "" || courtId == undefined) {
        window.location.href = "./my-court.html"
    }

    const court = await getCourtByCourtId(courtId)

    if(court[0].ownerId != userId) {
        window.location.href = "./my-court.html"
        return
    }

    document.getElementById("courtDetailDiv").innerHTML = `
        <div>
            <img src="${court[0].courtImage}" />
        </div>
        <div class="detail_court">
            <h1>${court[0].courtName}</h1>
            <br>
            <div>Address: ${court[0].courtAddress}</div>
            <div>Sport Type: ${court[0].courtTypeName}</div>
            <div>Court Price: Rp. ${formatNumber(court[0].courtPrice)}</div>
            <div class="ratingsssss">
                <p>Rating: ${court[0].courtRating}</p>
                <p id="bintang">★</p>
            </div>
        </div>
    `

    fillDateDiv()

    // tanggal yang diselect di calender minimal hari ini
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    fillScheduleDiv(formattedDate)
    
}

// document.getElementById("dateInput").addEventListener("change", async () => {

//     const date = dateInput.value
//     fillScheduleDiv(date)

//     paragraf.innerHTML = ''
//     hiddenInput.value = ''

// })

const fillScheduleDiv = async (date) => {

    const courtId = getParam("court-id")

    const scheduleTypes = await getScheduleTypes()
    let scheduleTypeIds = await getScheduleByCourtIdAndDate(courtId, date)
    let scheduleTypeIds2 = scheduleTypeIds.map(scheduleType => {return scheduleType.scheduleTypeId})
    
    const currentDate = new Date()
    const currentTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`
    
    scheduleDiv.innerHTML = ""

    // value checkbox merupakan scheduletypeid
    scheduleTypes.forEach(async (scheduleType, index) => {


        // gada di table schedule ato uda melewati waktu
        if(scheduleTypeIds2.indexOf(index + 1) == -1) {

            const div = document.createElement("div")
            const checkBox = document.createElement("input")
            checkBox.type = 'radio'
            checkBox.id = `checkBox${index + 1}`
            checkBox.value = index + 1
            checkBox.name = 'hour'
            checkBox.addEventListener('change', async (event) => {

                if(currentTime < scheduleType.startTime || date > currentDate.toLocaleDateString('en-CA')) {
                    hiddenInput.value = event.target.value
                    document.getElementById('manualBookButton').style.display = 'block'
                    document.getElementById('waktu_lewat').style.display = 'none'
                    document.getElementById('renterinfo').style.display = 'none'
                } else {
                    document.getElementById('manualBookButton').style.display = 'none'
                    document.getElementById('waktu_lewat').style.display = 'block'
                    document.getElementById('renterinfo').style.display = 'none'
                }
            })

            const label = document.createElement("label")
            label.htmlFor = `checkBox${index + 1}`
            label.innerHTML = `${scheduleType.startTime.slice(0, 5)} - ${scheduleType.endTime.slice(0, 5)}`
            
            div.appendChild(checkBox)
            div.appendChild(label)

            scheduleDiv.appendChild(div)

        } else {

            const dates = document.querySelector('input[name="date"]:checked').value
            const [a, b, c] = dates.split('-');

            // Create a new Date object (note: month is zero-based in JavaScript Date)
            const dateObject = new Date(a, b - 1, c);

            let dayOfWeek = dateObject.toLocaleString('default', { weekday: 'long' }); // Short day name (e.g., "Tue")
            let month = dateObject.toLocaleString('default', { month: 'long' }); // Short month name (e.g., "Jun")
            let date = dateObject.getDate().toString().padStart(2, '0'); // Day of the month
            let year = dateObject.getFullYear(); // Full year


            const div = document.createElement("div")
            const label = document.createElement("label")
            label.className = 'disabledLabel'
            label.innerHTML = `${scheduleType.startTime.slice(0, 5)} - ${scheduleType.endTime.slice(0, 5)}`

            const theSchedule = scheduleTypeIds.find(schedule => schedule.scheduleTypeId == scheduleType.scheduleTypeId)
            console.log(theSchedule)

            // const user = await getUserByUserId(theSchedule.renterId)

            div.addEventListener('click', () => {
                document.getElementById('renterinfo').innerHTML = `
                        <div>
                            <div>Date</div>
                            <div>: ${date} ${month} ${year}</div>
                        </div>
                        <div>
                            <div>Hour</div>
                            <div>: ${scheduleType.startTime.slice(0, 5)} - ${scheduleType.endTime.slice(0, 5)}</div>
                        </div>
                        <div>
                            <div>Renter Id</div>
                            <div>: ${theSchedule.renterId}</div>
                        </div>
                        <div>
                            <div>Renter Name</div>
                            <div>: ${theSchedule.userName}</div>
                        </div>
                `

                document.getElementById('manualBookButton').style.display = 'none'
                document.getElementById('waktu_lewat').style.display = 'none'
                document.getElementById('renterinfo').style.display = 'block'
            })

            

            div.appendChild(label)
            scheduleDiv.appendChild(div)
            

        }
    });

}

manualBookButton.addEventListener('click', async () => {

    const courtId = getParam('court-id')
    // const date = dateInput.value
    const date = document.querySelector('input[name="date"]:checked').value;
    const typeId = hiddenInput.value
    const userId = localStorage.getItem('user')

    const res = await insertSchedule(courtId, date, [typeId], userId)
    console.log(res)

    if(res.message == 'Insert Schedule Success') {
        window.location.reload()
    }

})