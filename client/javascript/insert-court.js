import { getCourtTypes, getUserByUserId, insertCourt } from "./module.js"

window.onload = async () => {

    if(localStorage.getItem("user") == null) {
        document.getElementById('background').style.display = 'block'
        document.getElementById('login').style.display = 'flex'
        return
    }

    if(localStorage.getItem('user-role') != 'owner') {
        window.location.href = "./index.html"
    }

    const courtTypes = await getCourtTypes()
    
    courtTypes.forEach(courtType => {
        document.getElementById("typeDdl").innerHTML += `
            <option value=${courtType.courtTypeId}>
                ${courtType.courtTypeName}
            </option>
        `
    });

}

document.getElementById("insertButton").addEventListener("click", async () => {

    const name = document.getElementById("nameInput").value
    const address = document.getElementById("addressInput").value
    const type = document.getElementById("typeDdl").value
    const price = document.getElementById("priceInput").value
    const image = document.getElementById("imageInput").value

    if(name == "") {
        document.getElementById("statusLabel").innerHTML = "Name must be filled"
        return
    } else if(address == "") {
        document.getElementById("statusLabel").innerHTML = "Address must be filled"
        return
    } else if(type == "") {
        document.getElementById("statusLabel").innerHTML = "Type must be filled"
        return
    } else if(price == "") {
        document.getElementById("statusLabel").innerHTML = "Price must be filled"
        return
    } else if(isNaN(parseInt(price))) {
        document.getElementById("statusLabel").innerHTML = "Price must be a number"
        return
    } else if(image == "") {
        document.getElementById("statusLabel").innerHTML = "Image must be filled"
        return
    }

    const userId = localStorage.getItem("user")

    const res = await insertCourt(userId, name, address, type, price, image)
    if(res.message == "Insert Court Success") {
        window.location.href = "my-court.html"
    }
})

function download() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    console.log(file)
return
    if (!file) {
        alert('No file selected!');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const fileContents = event.target.result;
        const blob = new Blob([fileContents], { type: file.type });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    reader.readAsArrayBuffer(file);
}
