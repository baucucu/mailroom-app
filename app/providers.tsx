'use client'

import { useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import handleSignUp from '@/utils/supabase/handle-signup'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClientComponentClient()

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                handleSignUp(session.user)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return <>{children} </>
}