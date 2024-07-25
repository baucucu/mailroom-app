import { createClient } from "@/utils/supabase/server";

async function handleSignUp(user) {
    const supabase = createClient();
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select()
        .eq('id', user.id)
        .single()

    if (fetchError) {
        console.error('Error fetching user:', fetchError)
        return
    }

    if (!existingUser) {
        // Create user record
        const { error: userError } = await supabase
            .from('users')
            .insert({ id: user.id, email: user.email })

        if (userError) {
            console.error('Error creating user:', userError)
            return
        }

        // Create account record
        const { data: account, error: accountError } = await supabase
            .from('accounts')
            .insert({ name: `${user.email}'s Account` })
            .select()
            .single()

        if (accountError) {
            console.error('Error creating account:', accountError)
            return
        }

        // Create user_accounts record
        const { error: userAccountError } = await supabase
            .from('user_accounts')
            .insert({ user_id: user.id, account_id: account.id })

        if (userAccountError) {
            console.error('Error creating user_account:', userAccountError)
        }
    }
}

export default handleSignUp