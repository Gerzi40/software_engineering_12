import { getCourtByCourtId, getScheduleByCourtIdAndDate, getScheduleTypes, getUserByUserId, insertSchedule } from "./module.js"

const scheduleDiv = document.getElementById('scheduleDiv')

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

    if(localStorage.getItem('user') != null && localStorage.getItem('user-role') != 'renter') {
        document.getElementById('bookButton').disabled = true
        document.getElementById('bookButton').style.backgroundColor = '#EBECEE'
        document.getElementById('bookButton').style.color = '#C0C1C6'
        document.getElementById('bookButton').style.cursor = 'default'
    }

    const courtId = getParam('court-id');

    if(courtId == "" || courtId == undefined) {
        window.location.href = "./court.html"
    }

    const court = await getCourtByCourtId(courtId)
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
    // document.getElementById("courtDetailDiv").innerHTML = `
    //     <h1 class="page-title">${court[0].courtName}</h1>
    //     <div id="imageDiv">
    //         <img src="${court[0].courtImage}" />
    //     </div<
    //     <div>court id: ${court[0].courtId}</div>
    //     <div>address: ${court[0].courtAddress}</div>
    //     <div>type: ${court[0].courtTypeName}</div>
    //     <div>price: ${court[0].courtPrice}</div>
    //     <div>rating: ${court[0].courtRating}</div>
    //     <div>rating count: ${court[0].courtRatingCount}</div>
    // `

    fillDateDiv()

    // tanggal yang diselect di calender minimal hari ini
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    fillScheduleDiv(formattedDate)

}

document.getElementById("bookButton").addEventListener("click", async () => {

    const userId = localStorage.getItem("user")

    if(userId == null) {
        document.getElementById('background').style.display = 'block'
        document.getElementById('login').style.display = 'flex'
        return
    }

    const courtId = getParam('court-id');

    const date = document.querySelector('input[name="date"]:checked').value;
    // console.log(selectedOption)

    let checkBoxs = document.querySelectorAll('input[type="checkbox"]:checked');
    let checkBoxsValue = Array.from(checkBoxs).map(checkBox => checkBox.value);

    // console.log(checkBoxsValue);

    window.location.href = `payment.html?court-id=${courtId}&date=${date}&schedule=${checkBoxsValue.toString()}`
})

const fillScheduleDiv = async (date) => {

    const courtId = getParam("court-id")

    const scheduleTypes = await getScheduleTypes()
    let scheduleTypeIds = await getScheduleByCourtIdAndDate(courtId, date)
    scheduleTypeIds = scheduleTypeIds.map(scheduleType => {return scheduleType.scheduleTypeId})
    
    const currentDate = new Date()
    const currentTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`
    
    scheduleDiv.innerHTML = ""

    // value checkbox merupakan scheduletypeid
    scheduleTypes.forEach((scheduleType, index) => {


        // gada di table schedule ato uda melewati waktu
        if(scheduleTypeIds.indexOf(index + 1) == -1 && (currentTime < scheduleType.startTime || date > currentDate.toLocaleDateString('en-CA'))) {

            const div = document.createElement("div")
            const checkBox = document.createElement("input")
            checkBox.type = 'checkbox'
            checkBox.id = `checkBox${index + 1}`
            checkBox.value = index + 1
            checkBox.addEventListener('change', async() => {

                let checkBoxs = document.querySelectorAll('input[type="checkbox"]:checked');
                const amount = checkBoxs.length
                const court = await getCourtByCourtId(courtId)
                const totalCourtPriceInInt = parseInt(court[0].courtPrice, 10) * amount;
                let totalCourtPriceInString = (totalCourtPriceInInt / 1000).toLocaleString('id-ID', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3
                  }).replace(',', '.')
                document.getElementById("totalPrice").innerHTML = `Rp ${totalCourtPriceInString}`
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
            label.className = 'disabledLabel'
            label.innerHTML = `${scheduleType.startTime.slice(0, 5)} - ${scheduleType.endTime.slice(0, 5)}`

            div.appendChild(label)
            scheduleDiv.appendChild(div)

        }
    });

}