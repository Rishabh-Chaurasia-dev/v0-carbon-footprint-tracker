"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { UserRole } from "@/lib/types"

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    if (error.message === "Invalid login credentials") {
      return { error: "Invalid email or password. Please check your credentials or sign up for a new account." }
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please check your email and confirm your account before signing in." }
    }
    return { error: error.message }
  }

  // Get role from user metadata (stored during signup)
  let role: UserRole = "individual"
  if (data.user?.user_metadata?.role) {
    role = data.user.user_metadata.role as UserRole
  }

  return { success: true, role }
}

export async function signup(formData: {
  email: string
  password: string
  fullName: string
  role: UserRole
  companyName?: string
}) {
  const supabase = await createClient()

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName,
        role: formData.role,
        company_name: formData.companyName || null,
      },
    },
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  if (data.user) {
    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        full_name: formData.fullName,
        total_points: 0,
        carbon_saved_kg: 0,
        role: formData.role,
        company_name: formData.companyName || null,
      },
      { onConflict: "id" }
    )
  }

  return { success: true }
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
