import { supabase } from "./supabaseClient.js";

export async function signUpUser(email, password) {
    let success = false;
    const { data, error } = await supabase
        .auth
        .signUp({ email, password });

    if (!error) {
        success = true;
        console.log("Sucessfully signed up");
    };
    
    return {
        success, 
        data: success ? data : null, 
        error
    };
};

export async function signInUser(email, password) {
    let success = false; 

    const { data, error } = await supabase
        .auth
        .signInWithPassword({
            email, 
            password
        });
    
    if (!error) {
        success = true;
        console.log("Successfuly signed in");
    };

    return {
        success, 
        error
    };
};

export async function getCurrentUser() {
    let success = false;

    const { data, error } = await supabase
        .auth
        .getUser();
    
    if (!error) {
        success = true;
        console.log("User sucessfully retrieved");
        return data.user
    };

    return null
}

export async function signOutUser() {
    let success = false;

    const { data, error } = await supabase
        .auth
        .signOut();

    if (!error) {
        console.log("Successfully logged out");
        success = true;
    };

    return {
        success,
        error
    };
};


export async function getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error("Session error:", error);
        return null;
    }

    return session;
}