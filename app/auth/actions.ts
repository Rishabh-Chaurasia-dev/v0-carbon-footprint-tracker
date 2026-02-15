"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
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

  return { success: true }
}

export async function signup(formData: {
  email: string
  password: string
  fullName: string
}) {
  const supabase = await createClient()

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName,
      },
    },
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  if (data.user) {
    // Try to create profile manually in case trigger didn't work
    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        full_name: formData.fullName,
        total_points: 0,
        carbon_saved_kg: 0,
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
