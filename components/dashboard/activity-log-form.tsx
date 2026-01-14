"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
  Flower,
  X,
  Loader2,
  CheckCircle2,
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  Camera,
  RefreshCw,
  type LucideIcon,
} from "lucide-react"
import type { ActivityType, LocationData } from "@/lib/types"
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

  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [dailyCount, setDailyCount] = useState<number>(0)
  const [dailyLimitReached, setDailyLimitReached] = useState(false)
  const [locationAttempted, setLocationAttempted] = useState(false)

  useEffect(() => {
    if (!locationAttempted) {
      requestLocation()
    }
  }, [locationAttempted])

  useEffect(() => {
    if (selectedType) {
      checkDailyLimit(selectedType.id)
    }
  }, [selectedType])

  const requestLocation = useCallback(() => {
    setLocationLoading(true)
    setLocationError(null)
    setLocationAttempted(true)

    console.log("[v0] Requesting location access...")

    if (!navigator.geolocation) {
      console.log("[v0] Geolocation not supported")
      setLocationError("Geolocation is not supported by your browser")
      setLocationLoading(false)
      return
    }

    if (typeof window !== "undefined" && window.isSecureContext === false) {
      console.log("[v0] Not in secure context - location requires HTTPS")
      setLocationError("Location access requires a secure connection (HTTPS)")
      setLocationLoading(false)
      return
    }

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          console.log("[v0] Geolocation permission status:", result.state)
          if (result.state === "denied") {
            setLocationError(
              "Location permission is blocked. Please enable location access in your browser settings and refresh the page.",
            )
            setLocationLoading(false)
            return
          }
          getPosition()
        })
        .catch(() => {
          console.log("[v0] Permissions API failed, trying geolocation directly")
          getPosition()
        })
    } else {
      getPosition()
    }
  }, [])

  const getPosition = () => {
    console.log("[v0] Calling getCurrentPosition...")

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("[v0] Location received:", position.coords)
        const { latitude, longitude, accuracy } = position.coords

        let address = ""
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "User-Agent": "CarbonFootprintTracker/1.0",
              },
            },
          )
          if (response.ok) {
            const data = await response.json()
            address = data.display_name || ""
            console.log("[v0] Address resolved:", address)
          }
        } catch (e) {
          console.log("[v0] Address lookup failed:", e)
        }

        setLocation({
          latitude,
          longitude,
          accuracy,
          address,
        })
        setLocationLoading(false)
        setLocationError(null)
        console.log("[v0] Location set successfully")
      },
      (error) => {
        console.log("[v0] Geolocation error:", error.code, error.message)
        let errorMessage = ""
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please click the location icon in your browser's address bar to enable access, then click 'Retry'."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please check your device's location settings."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please check your connection and try again."
            break
          default:
            errorMessage = "Unable to get your location. Please try again."
        }
        setLocationError(errorMessage)
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    )
  }

  const checkDailyLimit = async (activityTypeId: string) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { count, error } = await supabase
        .from("activities")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("activity_type_id", activityTypeId)
        .gte("created_at", today.toISOString())

      if (error) throw error

      const currentCount = count || 0
      setDailyCount(currentCount)

      const type = activityTypes.find((t) => t.id === activityTypeId)
      const limit = type?.daily_limit || 3
      setDailyLimitReached(currentCount >= limit)
    } catch (err) {
      console.error("Error checking daily limit:", err)
    }
  }

  const handleTypeSelect = (typeId: string) => {
    const type = activityTypes.find((t) => t.id === typeId)
    setSelectedType(type || null)
    setPhotoFile(null)
    setPhotoPreview(null)
    setDailyLimitReached(false)
    setDailyCount(0)
  }

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "video/mp4", "video/quicktime"]
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image (JPEG, PNG, WebP) or video (MP4, MOV)")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File must be less than 10MB")
        return
      }
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
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

  const canSubmit = () => {
    if (!selectedType || !quantity) return false
    if (!photoFile) return false
    if (!location) return false
    if (dailyLimitReached) return false
    return true
  }

  const getValidationStatus = () => {
    const checks = [
      {
        label: "Photo/Video Proof",
        passed: !!photoFile,
        icon: Camera,
        message: photoFile ? "Evidence uploaded" : "Required: Upload photo or video proof",
      },
      {
        label: "GPS Location",
        passed: !!location,
        icon: MapPin,
        message: locationLoading
          ? "Verifying location..."
          : location
            ? "Location verified"
            : locationError || "Required: Enable location access",
      },
      {
        label: "Daily Limit",
        passed: !dailyLimitReached,
        icon: Clock,
        message: selectedType
          ? dailyLimitReached
            ? `Daily limit reached (${selectedType.daily_limit}/${selectedType.daily_limit})`
            : `${dailyCount}/${selectedType.daily_limit} logged today`
          : "Select activity to check",
      },
      {
        label: "Review Status",
        passed: true,
        icon: Shield,
        message: "Activity will be reviewed before points are awarded",
      },
    ]
    return checks
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit()) return

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

      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("activity-photos")
          .upload(fileName, photoFile)

        if (uploadError) {
          throw new Error("Failed to upload proof: " + uploadError.message)
        }

        if (uploadData) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("activity-photos").getPublicUrl(fileName)
          photoUrl = publicUrl
        }
      }

      const { error: insertError } = await supabase.from("activities").insert({
        user_id: user.id,
        activity_type_id: selectedType!.id,
        quantity: Number(quantity),
        points_earned: calculatePoints(),
        carbon_saved_kg: calculateCarbonSaved(),
        notes: notes || null,
        photo_url: photoUrl,
        status: "pending",
        latitude: location?.latitude,
        longitude: location?.longitude,
        location_accuracy: location?.accuracy,
        location_address: location?.address || null,
        submitted_at: new Date().toISOString(),
      })

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 2000)
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
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Activity Submitted for Review!</h2>
            <p className="text-muted-foreground mb-4">Your activity has been submitted and is pending verification.</p>
            <div className="bg-secondary/50 rounded-lg p-4 max-w-sm mx-auto">
              <p className="text-sm text-muted-foreground mb-1">Potential points:</p>
              <p className="font-semibold text-primary text-lg">+{calculatePoints()} points</p>
              <p className="text-xs text-muted-foreground mt-2">
                Points will be awarded once your activity is verified.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Verification Requirements
          </CardTitle>
          <CardDescription>All activities require proof to prevent fake submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {getValidationStatus().map((check) => (
              <div
                key={check.label}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  check.passed ? "bg-primary/5" : "bg-destructive/5"
                }`}
              >
                <div className={`p-2 rounded-full ${check.passed ? "bg-primary/10" : "bg-destructive/10"}`}>
                  <check.icon className={`w-4 h-4 ${check.passed ? "text-primary" : "text-destructive"}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${check.passed ? "text-foreground" : "text-destructive"}`}>
                    {check.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{check.message}</p>
                </div>
                {check.label === "GPS Location" && locationLoading ? (
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                ) : check.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                )}
              </div>
            ))}
          </div>

          {locationError && !location && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Location Access Required</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-3">{locationError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestLocation}
                  disabled={locationLoading}
                  className="bg-background"
                >
                  {locationLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Retry Location Access
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!location && !locationLoading && !locationError && (
            <Button variant="outline" size="sm" className="mt-4 bg-transparent" onClick={requestLocation}>
              <MapPin className="w-4 h-4 mr-2" />
              Enable Location Access
            </Button>
          )}

          {locationLoading && !locationError && (
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Getting your location...
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Record Your Eco-Action</CardTitle>
          <CardDescription>Select an activity type and provide proof</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              {selectedType && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{selectedType.description}</p>
                  <Badge variant="outline" className="text-xs">
                    Max {selectedType.daily_limit}/day
                  </Badge>
                </div>
              )}
            </div>

            {dailyLimitReached && selectedType && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Daily Limit Reached</AlertTitle>
                <AlertDescription>
                  You have already logged {selectedType.daily_limit} {selectedType.name.toLowerCase()} activities today.
                  Please try again tomorrow or choose a different activity.
                </AlertDescription>
              </Alert>
            )}

            {selectedType && !dailyLimitReached && (
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

            {selectedType && !dailyLimitReached && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Photo/Video Evidence
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                </Label>
                {!photoPreview ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      capture="environment"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Click to capture or upload proof</p>
                      <p className="text-xs text-muted-foreground mt-1">Photo or video up to 10MB (JPEG, PNG, MP4)</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    {photoFile?.type.startsWith("video/") ? (
                      <video src={photoPreview} controls className="w-full h-48 object-cover rounded-lg" />
                    ) : (
                      <Image
                        src={photoPreview || "/placeholder.svg"}
                        alt="Activity preview"
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removePhoto}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Badge className="absolute bottom-2 left-2 bg-background/80">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Proof uploaded
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {location && (
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Location Verified</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details about your activity..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {selectedType && quantity && !dailyLimitReached && (
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Activity Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Potential points:</span>
                    <p className="font-semibold text-primary">+{calculatePoints()} pts</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Carbon saved:</span>
                    <p className="font-semibold text-foreground">{calculateCarbonSaved().toFixed(2)} kg CO2</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Points will be awarded after manual review
                </p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={!canSubmit() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting for review...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Submit Activity for Verification
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
