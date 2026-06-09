// DB password : Ej7SDxIZhUdo4qFj
import { createShiftCard, 
        getTotalTimeMinutes, 
        getFormattedTime, 
        getTotalRevenue } from "./utils.js";



// Get data from forms
export function getFormData() {
    return {
        shift_date: document.getElementById("shift_date_selector").value,
        start_time: document.getElementById("start_hour_selector").value,
        end_time: document.getElementById("end_hour_selector").value
    };
}

export function getEditFormData() {
    return {
        shift_date: document.getElementById("shift_date_selector_modify").value,
        start_time: document.getElementById("start_hour_selector_modify").value,
        end_time: document.getElementById("end_hour_selector_modify").value
    };
}



// Visual changes

export function toggleEditMenu(shift = undefined) {
    const black_overlay = document.getElementById("black_overlay");
    const menu = document.getElementById("edit_menu");
    const isHidden = menu.hasAttribute("hidden");

    const date_input = document.getElementById("shift_date_selector_modify");
    const start_input = document.getElementById("start_hour_selector_modify");
    const end_input = document.getElementById("end_hour_selector_modify");

    if (isHidden) {

        date_input.value = shift.shift_date;
        start_input.value = shift.start_time;
        end_input.value = shift.end_time;

        const editForm = document.getElementById("form_modify");
        editForm.dataset.selectedShiftId = shift.id

        black_overlay.hidden = false;
        menu.hidden = false;
        
    } else {
        black_overlay.hidden = true;
        menu.hidden = true;
    }
}



// Render
export function renderShifts(shifts) {
    const histDiv = document.getElementById("history");
    histDiv.replaceChildren();

    const errorMessage = document.getElementById("no_shift_to_show");

    if (shifts.length === 0) {
        errorMessage.hidden = false;
    }

    shifts.forEach((shift) => {
        errorMessage.hidden = true;
        createShiftCard(shift)
    });
}



// Success notification
let toastTimeout;

export function showToast(message, type = "success") {
    const toast = document.getElementById("toast");

    console.log(toast)

    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    console.log(toast)

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
}

export function showTotals(shifts) {
    const totalMinutes = getTotalTimeMinutes(shifts);
    const formattedTime = getFormattedTime(totalMinutes);
    const totalRevenue = getTotalRevenue(totalMinutes, 18);

    const histDiv = document.getElementById("history_section");

    const title = document.createElement("h3");
    title.textContent = "Historique";
    title.id = "title"

    const totals = document.createElement("h3");
    totals.textContent = `${formattedTime} - ${totalRevenue}$`;
    totals.id = "totals"

    histDiv.prepend(title, totals);
}

export function loadHistorySection(shifts) {
    const histDiv = document.getElementById("history_section");
    const title = document.getElementById("title");
    const totals = document.getElementById("totals");

    histDiv.removeChild(title);
    histDiv.removeChild(totals);

    renderShifts(shifts);
    showTotals(shifts);
}