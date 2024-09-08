// Store the created day boxes globally
const dayBoxes = {}; // To store day boxes
const totalPerDay = {}; // To store the total price for each day

// Array of day names
const daysofweeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Get reference to the button
const create = document.getElementById('add');

// Load saved day boxes from localStorage
function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('dayBoxes')) || {};
    Object.keys(savedData).forEach(day => {
        const { date, products, total } = savedData[day];
        CreateDayBox(day, daysofweeks.indexOf(day), date.day, date.month, date.year, products.join(', '), total, true);
    });
}

// Save data to localStorage
function saveData() {
    const dayBoxesData = {};
    Object.keys(dayBoxes).forEach(day => {
        const box = dayBoxes[day];
        const date = box.querySelector('h3').textContent.split(' ')[1];
        const products = box.querySelector('p').textContent.split(', ').filter(Boolean);
        const total = box.querySelector('input[name="Total"]').value.replace("dt", "");
        dayBoxesData[day] = {
            date: {
                day: date.split('/')[0],
                month: date.split('/')[1],
                year: date.split('/')[2]
            },
            products,
            total
        };
    });
    localStorage.setItem('dayBoxes', JSON.stringify(dayBoxesData));
}

// Attach click event to the button
create.onclick = function () {
    const currentDate = new Date();
    const currentDayIndex = currentDate.getDay();
    const currentDay = daysofweeks[currentDayIndex];
    
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    const product = document.getElementById('product').value;
    const price = parseFloat(document.getElementById('price').value) || 0;

    if (dayBoxes[currentDay]) {
        const productsbought = dayBoxes[currentDay].querySelector('p');
        productsbought.textContent += `, ${product}`;
        
        const displayprice = dayBoxes[currentDay].querySelector('input[name="Total"]');
        totalPerDay[currentDay] = (totalPerDay[currentDay] || 0) + price;
        displayprice.value = totalPerDay[currentDay].toFixed(2) + "dt";
    } else {
        CreateDayBox(currentDay, currentDayIndex, day, month, year, product, price);
    }
    
    saveData(); // Save data after adding a new box
};

// Function to create the Day Box
function CreateDayBox(currentDay, currentDayIndex, day, month, year, products, total, isLoad = false) {
    let EvenBox = document.createElement('div');
    EvenBox.style.textAlign = 'center';
    EvenBox.style.width = '300px';
    EvenBox.style.height = '200px';
    EvenBox.style.border = '3px solid black';
    EvenBox.style.borderRadius = '10px';
    EvenBox.style.marginLeft = '20px';
    EvenBox.style.marginTop = '20px';
    EvenBox.style.overflowY = 'scroll';

    let DayTitle = document.createElement('h3');
    let deletebtn = document.createElement('button');
    deletebtn.textContent = "delete";
    
    deletebtn.onclick = function() {
        // Reset the data in localStorage and totalPerDay
        totalPerDay[currentDay] = 0;
        EvenBox.remove();
        delete dayBoxes[currentDay];
        saveData();
    };

    let displayprice = document.createElement('input');
    displayprice.name = 'Total';
    displayprice.style.width = '60px';
    displayprice.value = isLoad ? total + "dt" : (totalPerDay[currentDay] || 0).toFixed(2) + "dt";
    displayprice.readOnly = false; // Make it editable

    displayprice.onchange = function() {
        totalPerDay[currentDay] = parseFloat(displayprice.value.replace("dt", "")) || 0;
        saveData(); // Save data after changing the price
    };

    DayTitle.textContent = `${daysofweeks[currentDayIndex]} ${day}/${month}/${year}`;
    
    let productsbought = document.createElement('p');
    productsbought.contentEditable = true; // Make it editable
    productsbought.textContent = products;
    
    productsbought.onblur = function() {
        saveData(); // Save data after changing the product list
    };

    EvenBox.appendChild(DayTitle);
    EvenBox.appendChild(productsbought);
    EvenBox.appendChild(displayprice);
    EvenBox.appendChild(deletebtn);
    
    let box = document.getElementById('container2');
    box.appendChild(EvenBox);

    dayBoxes[currentDay] = EvenBox;
}

// Initialize dayBoxes and totalPerDay when the page loads
window.onload = loadSavedData;