import { signUpUser, signInUser, signOutUser, getCurrentUser, getCurrentSession } from "./auth.js"
import { addShift, getShifts, modifyShift, deleteShift } from "./database.js";
import { getEditFormData, getFormData, renderShifts, toggleEditMenu, showToast , loadHistorySection} from "./ui.js";



const loginView = document.getElementById("loginView");
const appView = document.getElementById("app_view");

const loginEmail = document.getElementById("emailInput");
const loginPassword = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

function showLogin() {
    loginView.hidden = false;
    appView.hidden = true;
}

function showApp() {
    loginView.hidden = true;
    appView.hidden = false;
}


async function startApp(user) {

    const EXAMPLE_SHIFT = {
        user_id: user.id,
        shift_date: "2026-05-13",
        start_time: "10:30:00",
        end_time: "16:30:00",
        hourly_rate: 19.2
    }   


    // Add a shift

    const form = document.getElementById("form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = getFormData();
        console.log("Form data : ", data);

        const fullShiftData = {
            ...data,
            user_id: user.id,
            hourly_rate: 19.2
        };

        const success = await addShift(fullShiftData);
        console.log(success)

        const shifts = await getShifts();
        loadHistorySection(shifts);
        showToast("Shift ajouté avec succès", "success")
        console.log(shifts); 
    });



    // Modify a shift

    const editForm = document.getElementById("form_modify");
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = getEditFormData();

        const newShiftData = {
            ...data,
            user_id: user.id,
            hourly_rate: 19.2
        }

        const success = await modifyShift(e.target.dataset.selectedShiftId, newShiftData);
        console.log(success);

        if (success) {
            showToast("Shift modifié avec succès", "success");
        } else {
            showToast("Erreur lors de la modification du shift", "error");
    }

        toggleEditMenu();
        
        const shifts = await getShifts();
        loadHistorySection(shifts)
    })

    const black_overlay = document.getElementById("black_overlay");
    black_overlay.addEventListener("click", () => {
        toggleEditMenu();
    })



    // Delete a shift
    const deleteBtn = document.getElementById("delete_btn");
    deleteBtn.addEventListener("click", async () => {
        const shiftId = editForm.dataset.selectedShiftId;
        const success = await deleteShift(shiftId);

        if (success) {
            console.log("Shift supprimé : ", success);
        } else {
            console.log("Le shift n'a pas été supprimé")
        }

        const shifts = await getShifts();
        loadHistorySection(shifts);
        toggleEditMenu();
        showToast("Shift supprimé avec succès", "success")
    })


    // Filter selection
    const startDate = document.getElementById("beginning_date_div");
    const endDate = document.getElementById("end_date_div");

    [startDate, endDate].forEach((input) => {
        input.addEventListener("change", async () => {
            const shifts = await getShifts();
            loadHistorySection(shifts)
        })
    })



    // First load

    const shifts = await getShifts();
    console.log(shifts);
    loadHistorySection(shifts)
};

async function initAuth() {
    const session = await getCurrentSession();

    if (session) {
        const user = await getCurrentUser();

        if (!user) {
            showLogin();
            return;
        }

        showApp();
        await startApp(user);
        return;
    }

    showLogin();
}


loginBtn.addEventListener("click", async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    const result = await signInUser(email, password);

    if (!result.success) {
        loginError.textContent = "Connexion impossible.";
        return;
    }

    const user = await getCurrentUser();

    if (!user) {
        loginError.textContent = "Utilisateur introuvable.";
        return;
    }

    loginError.textContent = "";
    showApp();
    await startApp(user);
});

initAuth();