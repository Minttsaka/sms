"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Building2, Save, MapPin, Phone, Mail, Globe, CreditCard, Users, Shield, Bell } from "lucide-react"

export default function SettingsPage() {
  let user : any;
  const [isLoading, setIsLoading] = useState(false)
  const [institutionData, setInstitutionData] = useState({
    name: "",
    type: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
    website: "",
  })

  // Load institution data
  useEffect(() => {
    if (user && user.institutions.length > 0) {
      const institution = user.institutions[0]
      setInstitutionData({
        name: institution.name || "",
        type: institution.type || "",
        address: institution.address || "",
        city: institution.city || "",
        state: institution.state || "",
        country: institution.country || "",
        phone: institution.phone || "",
        email: institution.email || "",
        website: institution.website || "",
      })
    }
  }, [user])

  const handleSaveInstitution = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/institution/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionId: user?.institutions[0]?.id,
          ...institutionData,
        }),
      })

      if (response.ok) {
        toast.success("Institution settings updated successfully")
      } else {
        throw new Error("Failed to update")
      }
    } catch (error) {
      console.error("[v0] Update error:", error)
      toast.error("Failed to update institution settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            style={{ fontFamily: "Cambria, serif" }}
          >
            Settings
          </h1>
          <p className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
            Manage your institution settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="institution" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="institution" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Building2 className="w-4 h-4 mr-2" />
            Institution
          </TabsTrigger>
          <TabsTrigger value="subscription" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Institution Settings */}
        <TabsContent value="institution" className="space-y-6">
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                  Institution Information
                </h2>
                <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                  Update your institution's basic information
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                  institution Name *
                </Label>
                <Input
                  id="name"
                  value={institutionData.name}
                  onChange={(e) => setInstitutionData({ ...institutionData, name: e.target.value })}
                  className="h-12 bg-white border-gray-300"
                  style={{ fontFamily: "Cambria, serif" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                  institution Type *
                </Label>
                <select
                  id="type"
                  value={institutionData.type}
                  onChange={(e) => setInstitutionData({ ...institutionData, type: e.target.value })}
                  className="w-full h-12 px-3 rounded-md border border-gray-300 bg-white"
                  style={{ fontFamily: "Cambria, serif" }}
                >
                  <option value="">Select type</option>
                  <option value="primary">Primary institution</option>
                  <option value="secondary">Secondary institution</option>
                  <option value="high">High institution</option>
                  <option value="college">College</option>
                  <option value="university">University</option>
                  <option value="vocational">Vocational Training</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address" className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Street Address
                </Label>
                <Input
                  id="address"
                  value={institutionData.address}
                  onChange={(e) => setInstitutionData({ ...institutionData, address: e.target.value })}
                  className="h-12 bg-white border-gray-300"
                  style={{ fontFamily: "Cambria, serif" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                  City
                </Label>
                <Input
                  id="city"
                  value={institutionData.city}
                  onChange={(e) => setInstitutionData({ ...institutionData, city: e.target.value })}
                  className="h-12 bg-white border-gray-300"
                  style={{ fontFamily: "Cambria, serif" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                  State/Province
                </Label>
                <Input
                  id="state"
                  value={institutionData.state}
                  onChange={(e) => setInstitutionData({ ...institutionData, state: e.target.value })}
                  className="h-12 bg-white border-gray-300"
                  style={{ fontFamily: "Cambria, serif" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                  Country
                </Label>
                <Input
                  id="country"
                  value={institutionData.country}
                  onChange={(e) => setInstitutionData({ ...institutionData, country: e.target.value })}
                  className="h-12 bg-white border-gray-300"
                  style={{ fontFamily: "Cambria, serif" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={institutionData.phone}
                  onChange={(e) => setInstitutionData({ ...institutionData, phone: e.target.value })}
                  className="h-12 bg-white border-gray-300"
                  style={{ fontFamily: "Cambria, serif" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={institutionData.email}
                  onChange={(e) => setInstitutionData({ ...institutionData, email: e.target.value })}
                  className="h-12 bg-white border-gray-300"
                  style={{ fontFamily: "Cambria, serif" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={institutionData.website}
                  onChange={(e) => setInstitutionData({ ...institutionData, website: e.target.value })}
                  className="h-12 bg-white border-gray-300"
                  style={{ fontFamily: "Cambria, serif" }}
                  placeholder="https://www.yourinstitution.edu"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={handleSaveInstitution}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Subscription Settings */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                  Subscription Plan
                </h2>
                <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                  Manage your subscription and billing
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      {user?.institutions[0]?.plan || "Trial"} Plan
                    </h3>
                    <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                      Status:{" "}
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {user?.institutions[0]?.subscriptionStatus || "Active"}
                      </Badge>
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Upgrade Plan
                  </Button>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                      Students
                    </p>
                    <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      Unlimited
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                      Teachers
                    </p>
                    <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      Unlimited
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                      Storage
                    </p>
                    <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      100 GB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Users & Roles */}
        <TabsContent value="users" className="space-y-6">
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                  User Roles & Permissions
                </h2>
                <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                  Manage user access and permissions
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { role: "Admin", count: 3, color: "blue", permissions: "Full access to all features" },
                { role: "Teacher", count: 87, color: "purple", permissions: "Manage classes, grades, and attendance" },
                { role: "Student", count: 1234, color: "green", permissions: "View own data and submit assignments" },
                { role: "Parent", count: 856, color: "yellow", permissions: "View children data and communicate" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                      <Users className={`w-6 h-6 text-${item.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                        {item.role}
                      </h3>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                        {item.permissions}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      {item.count}
                    </p>
                    <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                      users
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                  Notification Preferences
                </h2>
                <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                  Configure how you receive notifications
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { title: "Email Notifications", description: "Receive updates via email" },
                { title: "SMS Notifications", description: "Get important alerts via SMS" },
                { title: "Push Notifications", description: "Browser push notifications" },
                { title: "Weekly Reports", description: "Receive weekly summary reports" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                      {item.description}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
