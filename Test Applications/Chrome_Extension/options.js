let page = document.getElementById("button-div");
let className = "current";
const listOfButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];
contructOptions(listOfButtonColors);
function contructOptions(buttonColors){
    chrome.storage.sync.get("color", (data) => {
        let currentColor = data.color;
        for(let buttonColor of buttonColors){
            let button = document.createElement("button");
            button.dataset.color = buttonColor;
            button.style.backgroundColor = buttonColor;
            if(buttonColor === currentColor){
                button.classList.add(className);
            }
            button.addEventListener("click", handleButtonClick);
            page.appendChild(button);
        }
    });
}

function handleButtonClick(event){
    let current = event.target.parentElement.querySelector(
        `.${className}`
    );
    if(current && current !== event.target){
        current.classList.remove(className);
    }
    let color = event.target.dataset.color;
    event.target.classList.add(className);
    chrome.storage.sync.set({color});
}