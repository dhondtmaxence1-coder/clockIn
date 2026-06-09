import { toggleEditMenu } from "./ui.js";


export function createShiftCard(shift) {

    // Résultat : 

    /* 
    <div class="shift_card">
        <div class="shift_info">
            <p class="card_shift_date">13 mai 2026</p>
            <p class="card_shift_day">Lundi</p>
            <p class="card_shift_time">16:30-23:00 | 6:30</p>
        </div>
        <div class="shift_card_amount">
            <p class="amount">186,00$</p>
        </div>
    </div> 
    */


    const historyDiv = document.getElementById("history");

    const shiftCard = document.createElement("div");
    shiftCard.className = "shift_card";
    shiftCard.dataset.shiftId = shift.id;

    const shiftInfoDiv = document.createElement("div");
    shiftInfoDiv.className = "shift_info";

    const shiftCardAmount = document.createElement("div");
    shiftCardAmount.className = "shift_card_amount";



    const shiftDate = document.createElement("p");
    shiftDate.className = "card_shift_date";
    shiftDate.textContent = shift.shift_date;

    const shiftDay = document.createElement("p");
    shiftDay.className = "card_shift_day";
    shiftDay.textContent = getWeekDay(shift.shift_date);

    const shiftTime = document.createElement("p");
    shiftTime.className = "card_shift_time";
    shiftTime.textContent = getShiftTimeAndDuration(shift.start_time, shift.end_time);

    const amount = document.createElement("p");
    amount.className = "amount";
    amount.textContent = getAmountEarned(shift.hourly_rate, shift.start_time, shift.end_time);

    // Div infos (Date, heures)
    shiftInfoDiv.append(shiftDate, shiftDay, shiftTime);

    // Div montant
    shiftCardAmount.append(amount);

    // Carte complète
    shiftCard.append(shiftInfoDiv,shiftCardAmount);

    // Ajouter carte au document
    historyDiv.appendChild(shiftCard);

    shiftCard.addEventListener("click", () => {
        toggleEditMenu(shift);
    });
};


function getWeekDay(dateString) {
    const date = new Date(dateString + "T00:00:00");

    const weekDay = date.toLocaleDateString("fr-FR", {
        weekday: "long"
    });

    return weekDay.charAt(0).toUpperCase() + weekDay.slice(1);
}

function getShiftDuration(start_time, end_time, format = "String") {
    const [startHour, startMinute] = start_time.split(":").map(Number);
    const [endHour, endMinute] = end_time.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    let endTotalMinutes = endHour * 60 + endMinute;

    // Si l'heure de fin est avant l'heure de début,
    // on considère que le shift finit le lendemain.
    if (endTotalMinutes < startTotalMinutes) {
        endTotalMinutes += 24 * 60;
    }

    const durationMinutes = endTotalMinutes - startTotalMinutes;

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (format == "String") {
        return `${hours}:${String(minutes).padStart(2, "0")}`;
    } else {
        return hours*60 + minutes
    }
}

function getShiftTimeAndDuration(start_time, end_time) {
    const startDisplay = start_time.slice(0, 5);
    const endDisplay = end_time.slice(0, 5);
    const duration = getShiftDuration(start_time, end_time);

    return `${startDisplay}-${endDisplay} | ${duration}`;
}

function getAmountEarned(hourlyRate, start_time, end_time) {
    const [hours, minutes] = getShiftDuration(start_time, end_time)
        .split(":")
        .map(Number);

    const durationHours = hours + minutes / 60;
    const amount = hourlyRate * durationHours;

    return `${amount.toFixed(2).replace(".", ",")}$`;
}

export function getTotalTimeMinutes(shifts) {

    let minutes = 0;

    shifts.forEach((shift) => {
        minutes += getShiftDuration(shift.start_time, shift.end_time, "Number")
    })

    return minutes
}

export function getFormattedTime(nbMinutes) {
    const hours = Math.floor(nbMinutes/60);
    const minutes = nbMinutes - hours*60

    return `${hours}:${String(minutes).padStart(2, "0")}`;
}

export function getTotalRevenue(totalMinutes, hourlyRate) {
    return (totalMinutes/60) * hourlyRate
}
