import { insertCourt } from "./module.js"

document.getElementById("insertButton").addEventListener("click", async () => {

    const name = document.getElementById("nameInput").value
    const address = document.getElementById("addressInput").value
    const type = document.getElementById("typeDdl").value
    const price = document.getElementById("priceInput").value
    const image = document.getElementById("fileInput").files[0]

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
    } else if(document.getElementById('fileInput').files[0] == undefined) {
        document.getElementById("statusLabel").innerHTML = "Image must be filled"
        return
    }

    const imageName = './asset/court_image/' + download()

    const userId = localStorage.getItem("user")

    const res = await insertCourt(userId, name, address, type, price, imageName)
    if(res.message == "Insert Court Success") {
        // window.location.href = "my-court.html"
    }
})

function download() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
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
    return file.name
}
