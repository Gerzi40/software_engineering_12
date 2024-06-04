import { getCourts, getUserByUserId } from "./module.js";

window.onload = async () => {
    const userId = localStorage.getItem("user");

    if (userId != null) {
        const user = await getUserByUserId(userId);

        if (user[0].userRole != "renter") {
            window.location.href = "./index.html";
        }
    }

    const courts = await getCourts();
    displayCourts(courts);
    initializeSearch(courts);
};

const searchCourts = (courts, toFind) => {
    const toFindLowerCase = toFind.toLowerCase();
    return courts.filter(court => court.courtName.toLowerCase().includes(toFindLowerCase));
};

const displayCourts = (courtsToDisplay) => {
    const courtListDiv = document.getElementById("courtListDiv");
    courtListDiv.innerHTML = "";
    courtsToDisplay.forEach(court => {
        courtListDiv.innerHTML += `
            <div onclick="window.location.href = 'court-detail.html?court-id=${court.courtId}'">
                ${court.courtName}
            </div>
        `;
    });
};

const initializeSearch = (courts) => {
    const searchInput = document.getElementsByClassName('search-input')[0];
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = event.target.value;
            const filteredCourts = searchCourts(courts, query);
            displayCourts(filteredCourts);
        }
    });
};

