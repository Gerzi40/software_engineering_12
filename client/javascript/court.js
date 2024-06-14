import { getCities, getCourtTypes, getCourts, getUserByUserId } from "./module.js";

window.onload = async () => {

    const courtTypes = await getCourtTypes()
    courtTypes.forEach(courtType => {
        const option = document.createElement('option')
        option.innerHTML = courtType.courtTypeName
        option.value = courtType.courtTypeName
        document.getElementById('categorySelect').appendChild(option)
    });

    const cities = await getCities()
    cities.forEach(city => {
        const option = document.createElement('option')
        option.innerHTML = city
        option.value = city
        document.getElementById('locationSelect').appendChild(option)
    });

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.size == 0) {
        const courts = await getCourts();
        displayCourts(courts);
    } else {
        const name = urlParams.get('name')
        const category = urlParams.get('category')
        const location = urlParams.get('location')
        document.getElementById('nameInput').value = name ?  name : ''
        document.getElementById('categorySelect').value = category ?  category : ''
        document.getElementById('locationSelect').value = location ?  location : ''
        const newCourts = await searchCourts(name, category, location)
        displayCourts(newCourts)
    }
};

const displayCourts = (courtsToDisplay) => {
    const courtListDiv = document.getElementById("courtListDiv");
    courtListDiv.innerHTML = "";
    courtsToDisplay.forEach(court => {

        const div = document.createElement('div')

        const img = document.createElement('img')
        img.src = court.courtImage
        const p = document.createElement('p')
        p.innerHTML = court.courtName

        div.addEventListener('click', () => {
            window.location.href = `court-detail.html?court-id=${court.courtId}`
        })

        div.appendChild(img)
        div.appendChild(p)

        courtListDiv.appendChild(div)

    });
};

document.getElementById('nameInput').addEventListener('keypress', async (event) => {
    const query = event.target.value;

    if(query == '') return

    if (event.key === 'Enter') {
        const filteredCourts = await searchCourts(query, '', '');
        displayCourts(filteredCourts);
    }
});

document.getElementById('findCourtButton').addEventListener('click', async () => {

    const name = document.getElementById('nameInput').value
    const category = document.getElementById('categorySelect').value
    const location = document.getElementById('locationSelect').value

    if(name == '' && category == '' && location == '') return

    const newCourts = await searchCourts(name, category, location)
    // console.log(newCourts)
    displayCourts(newCourts)
})

const searchCourts = async (toFind, category, location) => {
    const courts = await getCourts();
    const toFindLowerCase = toFind.toLowerCase();
    return courts.filter(court => {
        const matchesName = toFind ? court.courtName.toLowerCase().includes(toFindLowerCase) : true;
        const matchesCategory = category ? court.courtTypeName === category : true;
        const matchesLocation = location ? court.courtAddress.includes(location) : true;
        return matchesName && matchesCategory && matchesLocation;
    });
};

const categorySelect = document.getElementById('categorySelect')
categorySelect.addEventListener('change', () => {
    if(categorySelect.value != '') {
        categorySelect.style.color = 'black'
    } else {
        categorySelect.style.color = 'grey'
    }
})

const locationSelect = document.getElementById('locationSelect')
locationSelect.addEventListener('change', () => {
    if(locationSelect.value != '') {
        locationSelect.style.color = 'black'
    } else {
        locationSelect.style.color = 'grey'
    }
})