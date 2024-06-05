import { getCourtByCourtId, getScheduleTypeIdsFromScheduleByCourtIdAndDate, getScheduleTypes, getUserByUserId, insertSchedule } from "./module.js"

const dateInput = document.getElementById("dateInput")
const scheduleDiv = document.getElementById('scheduleDiv')

const getParam = (parameterName) => {
    const url = window.location.href;
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);
    return params.get(parameterName);
}

window.onload = async () => {

    const userId = localStorage.getItem("user")

    if(userId != null) {
        const user = await getUserByUserId(userId)
    
        if(user[0].userRole != "renter") {
            window.location.href = "./index.html"
        }
    }

    const courtId = getParam('court-id');

    const court = await getCourtByCourtId(courtId)
    document.getElementById("courtDetailDiv").innerHTML = `
        <div>court id: ${court[0].courtId}</div>
        <div>name: ${court[0].courtName}</div>
        <div>address: ${court[0].courtAddress}</div>
        <div>type: ${court[0].courtTypeName}</div>
        <div>price: ${court[0].courtPrice}</div>
        <div>rating: ${court[0].courtRating}</div>
        <div>rating count: ${court[0].courtRatingCount}</div>
    `

    // tanggal yang diselect di calender minimal hari ini
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    dateInput.min = date;
    dateInput.value = date;

    fillScheduleDiv(date)

}

document.getElementById("dateInput").addEventListener("change", async () => {

    const courtId = getParam('court-id');
    const date = dateInput.value
    
    fillScheduleDiv(date)

})

document.getElementById("bookButton").addEventListener("click", async () => {

    const userId = localStorage.getItem("user")

    if(userId == null) {
        document.getElementById('background').style.display = 'block'
        document.getElementById('login').style.display = 'flex'
    }

    const user = await getUserByUserId(userId)

    if(user[0].userRole != "renter") {
        window.location.href = "./index.html"
    }

    const courtId = getParam('court-id');
    const date = dateInput.value

    let checkBoxs = document.querySelectorAll('input[type="checkbox"]:checked');
    let checkBoxsValue = Array.from(checkBoxs).map(checkBox => checkBox.value);

    // console.log(checkBoxsValue);

    const res = await insertSchedule(courtId, date, checkBoxsValue, userId)
    console.log(res)
    window.location.reload()
})

const fillScheduleDiv = async (date) => {

    const courtId = getParam("court-id")

    const scheduleTypes = await getScheduleTypes()
    const scheduleTypeIds = await getScheduleTypeIdsFromScheduleByCourtIdAndDate(courtId, date)

    scheduleDiv.innerHTML = ""

    // value checkbox merupakan scheduletypeid
    scheduleTypes.forEach((scheduleType, index) => {

        const currentDate = new Date()
        const currentTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`

        // gada di table schedule ato uda melewati waktu
        if(scheduleTypeIds.indexOf(index + 1) == -1 && (currentTime < scheduleType.startTime || date > currentDate.toLocaleDateString('en-CA'))) {

            const div = document.createElement("div")
            const checkBox = document.createElement("input")
            checkBox.type = 'checkbox'
            checkBox.id = `checkBox${index + 1}`
            checkBox.value = index + 1
            checkBox.addEventListener('change', () => {
                let checkBoxs = document.querySelectorAll('input[type="checkbox"]:checked');
                document.getElementById("totalPrice").innerHTML = checkBoxs.length
            })

            const label = document.createElement("label")
            label.htmlFor = `checkBox${index + 1}`
            label.innerHTML = `${scheduleType.startTime.slice(0, 5)} - ${scheduleType.endTime.slice(0, 5)}`
            
            div.appendChild(checkBox)
            div.appendChild(label)

            scheduleDiv.appendChild(div)

        } else {

            const div = document.createElement("div")
            const label = document.createElement("label")
            label.innerHTML = `${scheduleType.startTime.slice(0, 5)} - ${scheduleType.endTime.slice(0, 5)}`

            div.appendChild(label)
            scheduleDiv.appendChild(div)

        }
    });

}