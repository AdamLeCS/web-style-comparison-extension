// adding event listeners to the buttons
const buttons = document.getElementsByClassName('showcase__button');
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", changePicture);
}

function changePicture() {
    const buttons = document.getElementsByClassName('showcase__button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "rgb(255, 199, 114)"; // reset color of all buttons
    }
    event.target.style.backgroundColor = "rgb(204, 116, 44)"; // change color of pressed button
    // instead of passing element as a parameter to this function, event listeners will pass an "event"
    // object that has information about which element was pressed; event.target gives access to that element
    const images = document.querySelectorAll('.showcase__images img');
    for (let i = 0; i < images.length; i++) { // remove the visible class and adds hidden
        if (images[i].classList.contains('visible')) {
            images[i].classList.remove('visible');
            images[i].classList.add('hidden');
        }
    }
    // each button has data-image custom attribute connected to it which is the same as the id of its respective photo
    const imageId = event.target.dataset.image;
    document.getElementById(imageId).classList.remove('hidden');
    document.getElementById(imageId).classList.add('visible');
}

// function to add new date-times in the form
let numDateTimes = 1;
document.getElementById('new-date-time-button').addEventListener('click', addDateTime);
document.getElementById('date1').addEventListener('change', changeTimes);

function addDateTime() {
    if (numDateTimes > 2) {
        return;
    }
    numDateTimes++;
    // make the section
    const section = document.createElement('section');
    section.classList = 'date-time form-row';
    section.id = `date-time${numDateTimes}`;
    
    // make the input
    const input = document.createElement('input');
    input.classList = 'input input-small';
    input.type = 'date';
    input.id = `date${numDateTimes}`;
    // add event listener to new date input 
    input.addEventListener('change', changeTimes);

    // make the select
    const select = document.createElement('select');
    select.classList = 'input input-small';
    select.id = `time${numDateTimes}`; // note: template literals (${}) only work with backticks, not single quotes
    const option = document.createElement('option');
    option.text = 'Select a time...';
    select.appendChild(option);

    section.appendChild(input);
    section.appendChild(select);

    // add section after last date-time section
    const previousSection = document.getElementById(`date-time${numDateTimes - 1}`);
    previousSection.after(section);

}

// function to change availability times depending on the date inputted
function changeTimes() {
    /*

    IMPORTANT: add a query to the database to check and see if a specific day's timeslots have already been taken, and remove it from the list of available times that are being offered to prevent scheduling conflicts

    */

    // find which time dropdown to change
    const dateTimeNum = event.target.id.slice(-1);
    const timeToChange = document.getElementById(`time${dateTimeNum}`);

    // get date as day of the week
    let dateValue = event.target.value;
    const date = new Date(dateValue);
    let dayOfWeek = date.getDay();

    let timeOptions = [];
    if (dayOfWeek === 0 || dayOfWeek === 2) {
        timeOptions = ['Select a time...', '8:00am', '9:00am', '10:00am', '11:00am', '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm'];
    } else if (dayOfWeek === 1 || dayOfWeek === 3) {
        timeOptions = ['Select a time...', '11:00am', '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm'];
    } else {
        timeOptions = ['Select a time...', '8:00am', '9:00am', '10:00am', '11:00am', '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm', '5:00pm', '6:00pm'];
    }

    // reset the time dropdown then add new ones
    timeToChange.innerHTML = "";
    for(let i = 0; i < timeOptions.length; i++) {
        let newOption = document.createElement('option');
        newOption.text = timeOptions[i];
        // only triggers if this is the first datetime input
        if (dateTimeNum == 1 && i == 0) {
            newOption.value = "";
        }
        timeToChange.appendChild(newOption);
    }

    
}

// button to submit the form
document.getElementById('submit-form-button').addEventListener('click', submitForm);

function submitForm() {
    event.preventDefault();
    const form = document.querySelector('form');

    if (form.reportValidity()) {
        
    } else { 
        // create the invalid pseudo class if it doesn't already exist
        if (!document.getElementById('invalid-css')) {
            const invalidClass = document.createElement('style');
            invalidClass.id = 'invalid-css';
            invalidClass.textContent = `
                .input:invalid {
                border-color: red;
                background-color: rgb(255, 221, 221);
            }
            `;
            document.head.appendChild(invalidClass);
        }
    }
}