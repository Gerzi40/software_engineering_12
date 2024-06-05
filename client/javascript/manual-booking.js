import { getCourtByCourtId, getScheduleTypeIdsFromScheduleByCourtIdAndDate, getScheduleTypes, getUserByUserId, insertSchedule, getSchedule} from "./module.js"

const dateInput = document.getElementById("dateInput")
const scheduleDiv = document.getElementById('scheduleDiv')
const TodayDate = document.getElementById("todayDate")
const paragraf = document.getElementById("paragraf")
const infoAndBook = document.getElementById("infoAndBook")


const getParam = (parameterName) => {
    const url = window.location.href;
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);
    return params.get(parameterName);
}

window.onload = async () => {
    
    const ownerId = localStorage.getItem("owner")

    if(ownerId != null) {
        const owner = await getUserByUserId(ownerId)
        
        if(owner[0].userRole != "renter") {
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
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const date = today.toISOString().split('T')[0];
    dateInput.min = date;
    dateInput.value = date;

    fillScheduleDiv(date)
    
    TodayDate.textContent = `${day}/${month}/${year}`;
}

function extractNumbersFromString(str) {
    return str.replace(/\D/g, "");
}




const fillScheduleDiv = async (date) => {

    const courtId = getParam("court-id")

    const Schedule = await getSchedule()
    const scheduleTypes = await getScheduleTypes()
    const scheduleTypeIds = await getScheduleTypeIdsFromScheduleByCourtIdAndDate(courtId, date)
    
    console.log(scheduleTypeIds)

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const dateFormat = `${year}-${month}-${day}`;
    // console.log(dateFormat)
    // console.log(Schedule)
    scheduleDiv.innerHTML = ""
    // Schedule.forEach((Schedule) => {
    //     console.log(Schedule.courtId)
    // })
    
    scheduleTypes.forEach((scheduleType, index) => {
        
        // mau bikin button biar owner bisa cek di jam segini udah ada yg book apa blm
        const div = document.createElement("div")
        const button = document.createElement("button")
        button.id = `button${index + 1}`
        button.textContent = `${scheduleType.startTime.slice(0, 5)} - ${scheduleType.endTime.slice(0, 5)}`
        
        button.addEventListener('click', async () => {
            // console.log("hello")
            const clickedButtonId = extractNumbersFromString(button.id);
            // Loop through each schedule
            let booked = false;

            // Loop through each schedule
            for (const schedule of scheduleTypeIds) {
                console.log(index + 1)
                console.log(schedule.scheduleTypeId)
                console.log(dateFormat)
                console.log(schedule.scheduleDate)
                // Compare schedule date and schedule type ID with the clicked button ID and current date
                if (index + 1 == schedule.scheduleTypeId && dateFormat == schedule.scheduleDate) {
                    infoAndBook.style.display = "none";
                    // console.log(1);
                    paragraf.textContent = `The Court is booked by ${schedule.renterId}`;
                    booked = true;
                    break;
                }
            }
            // If not booked, set paragraph text accordingly
            if (!booked) {
                paragraf.textContent = "Manual Book Available";
                await manual_Book(scheduleType.scheduleTypeId)
            }
        });
        
        div.appendChild(button)
        scheduleDiv.appendChild(div)
        
    });
}

// masukin manual book kyk user aja
const manual_Book = async (clickedButtonId) => {
    // console.log(clickedButtonId)
    infoAndBook.style.display = "block";
    infoAndBook.addEventListener('click', async () => {
    
        const ownerId = localStorage.getItem("user")
    
        if(ownerId == null) {
            window.location.href = "./index.html"
        }
    
        const user = await getUserByUserId(ownerId)
    
        if(user[0].userRole != "owner") {
            window.location.href = "./index.html"
        }
    
        const courtId = getParam('court-id');
        const date = dateInput.value
    
        // let checkBoxs = document.querySelectorAll('input[type="checkbox"]:checked');
        // let checkBoxsValue = Array.from(checkBoxs).map(checkBox => checkBox.value);
    
        // console.log(checkBoxsValue);
    
        console.log(courtId)
        console.log(date)
        console.log(clickedButtonId)
        console.log(ownerId)
    
        const res = await insertSchedule(courtId, date, [clickedButtonId], ownerId)
        console.log(res)
        // window.location.reload()
    });
}
