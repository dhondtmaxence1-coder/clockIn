import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://oraeuxzqkhfaguxmqafc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_HTnk4CdLNEOidI4ssZb8sg_KuzIBr3T";
    
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

