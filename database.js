import { supabase } from "./supabaseClient.js";

export async function addShift(shift) {
    let success = false;

    /*
    Shift Object example : 
    shift = {
        user_id:                "b#######-###c-#f##-###e-##f#b#####f#"
        shift_date: 20260513,   "YYYY-MM-DD"
        start_time: 1030,       "HH:mm:ss"
        end_time: 1630,         "HH:mm:ss"
        hourly_rate: 19,20      ###0.00       
    }
    */

    const { data, error } = await supabase
        .from("shifts")
        .insert(shift)
        .select()
        .single();

    if (!error) {
        console.log("shift ajouté avec succès");
        success = true
    };

    return success
};

export async function getShifts() {
    let success = false;
    let query = supabase
        .from("shifts")
        .select("*")

    const startDate = document.getElementById("beginning_date_selector").value;
    const endDate = document.getElementById("end_date_selector").value;

    if (startDate) {
        query = query.gte("shift_date", startDate);
    }

    if (endDate) {
        query = query.lte("shift_date", endDate);
    }

    const { data: shifts, error } = await query
        .order("shift_date", {ascending: false})
        .order("start_time", { ascending: false });

    if (!error) {
        console.log("Shifts récupérés");
        success = true;
    };

    return shifts
};

export async function modifyShift(shiftId, fields) {
    let success = false;

    const { data, error } = await supabase
        .from("shifts")
        .update(fields)
        .eq("id", shiftId)
        .select()
        .single();

    if (!error) {
        console.log("Successfully updated note");
        success = true;
    };

    return success
}

export async function deleteShift(shiftId) {
    let success = false;

    const { data, error } = await supabase
        .from("shifts")
        .delete()
        .eq("id", shiftId);

    console.log('error : ', error)

    if (!error) {
        console.log("Shift supprimé avec succès");
        success = true;
    };

    return success
}