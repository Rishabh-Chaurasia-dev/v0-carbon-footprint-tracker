"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sun,
  ShoppingBag,
  Car,
  Bus,
  Bike,
  TreeDeciduous,
  Trash,
  Leaf,
  Recycle,
  Salad,
  Flower,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react"
import type { ActivityType } from "@/lib/types"
import Image from "next/image"

interface ActivityLogFormProps {
  activityTypes: ActivityType[]
}

const iconMap: Record<string, LucideIcon> = {
  sun: Sun,
  "shopping-bag": ShoppingBag,
  car: Car,
  bus: Bus,
  bike: Bike,
  "tree-deciduous": TreeDeciduous,
  trash: Trash,
  leaf: Leaf,
  recycle: Recycle,
  salad: Salad,
  flower: Flower,
}

export function ActivityLogForm({ activityTypes }: ActivityLogFormProps) {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null)
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleTypeSelect = (typeId: string) => {
    const type = activityTypes.find((t) => t.id === typeId)
    setSelectedType(type || null)
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be less than 5MB")
        return
      }
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const calculatePoints = () => {
    if (!selectedType || !quantity) return 0
    return Math.round(Number(quantity) * selectedType.points_per_unit)
  }

  const calculateCarbonSaved = () => {
    if (!selectedType || !quantity) return 0
    return Number(quantity) * Number(selectedType.carbon_factor)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType || !quantity) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      let photoUrl = null

      // Upload photo if present
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("activity-photos")
          .upload(fileName, photoFile)

        if (uploadError) {
          // If bucket doesn't exist, continue without photo
          console.warn("Photo upload skipped:", uploadError.message)
        } else if (uploadData) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("activity-photos").getPublicUrl(fileName)
          photoUrl = publicUrl
        }
      }

      // 1. Insert activity
      const points = calculatePoints()
      const carbonSaved = calculateCarbonSaved()

      const { error: insertError } = await supabase.from("activities").insert({
        user_id: user.id,
        activity_type_id: selectedType.id,
        quantity: Number(quantity),
        points_earned: points,
        carbon_saved_kg: carbonSaved,
        notes: notes || null,
        photo_url: photoUrl,
      })

      if (insertError) throw insertError

      // 2. Manually update profile stats (Fix for points not increasing)
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("total_points, carbon_saved_kg")
        .eq("id", user.id)
        .single()

      if (currentProfile) {
        await supabase
          .from("profiles")
          .update({
            total_points: (currentProfile.total_points || 0) + points,
            carbon_saved_kg: (currentProfile.carbon_saved_kg || 0) + carbonSaved,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log activity")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Activity Logged!</h2>
            <p className="text-muted-foreground mb-2">
              You earned <span className="font-semibold text-primary">+{calculatePoints()} points</span>
            </p>
            <p className="text-sm text-muted-foreground">Carbon saved: {calculateCarbonSaved().toFixed(2)} kg CO2</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Record Your Eco-Action</CardTitle>
        <CardDescription>Select an activity type and enter the details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Type Selection */}
          <div className="space-y-2">
            <Label>Activity Type</Label>
            <Select onValueChange={handleTypeSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select an activity" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => {
                  const Icon = iconMap[type.icon || "leaf"] || Leaf
                  return (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" />
                        <span>{type.name}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {selectedType && <p className="text-sm text-muted-foreground">{selectedType.description}</p>}
          </div>

          {/* Quantity Input */}
          {selectedType && (
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity ({selectedType.unit}
                {selectedType.unit !== "hour" ? "s" : "s"})
              </Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0.1"
                placeholder={`Enter ${selectedType.unit}s`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                {selectedType.points_per_unit} points per {selectedType.unit}
              </p>
            </div>
          )}

          {/* Photo Upload (for activities that require it) */}
          {selectedType?.requires_photo && (
            <div className="space-y-2">
              <Label>Photo Evidence</Label>
              {!photoPreview ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Click to upload a photo</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={photoPreview || "/placeholder.svg"}
                    alt="Activity preview"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removePhoto}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Preview */}
          {selectedType && quantity && (
            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Activity Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Points to earn:</span>
                  <p className="font-semibold text-primary">+{calculatePoints()} pts</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Carbon saved:</span>
                  <p className="font-semibold text-foreground">{calculateCarbonSaved().toFixed(2)} kg CO2</p>
                </div>
              </div>
            </div>
          )}

          {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}

          <Button type="submit" className="w-full" disabled={!selectedType || !quantity || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging activity...
              </>
            ) : (
              "Log Activity"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
