"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Save,
  Building,
  CreditCard,
  FileText,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import { LoginDialog } from "@/components/auth/login-dialog";

const ProfileHeader = () => (
  <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm app-header agent-header-mobile">
    <div className="mx-auto flex max-w-2xl items-center justify-between p-2 xs:p-4 app-header-content">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon" className="touch-target">
          <ArrowLeft className="h-4 w-4 xs:h-5 xs:w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <h1 className="text-lg xs:text-xl font-bold text-foreground font-headline text-responsive-lg">
        My Profile
      </h1>
      <div className="w-8 xs:w-10"></div>
    </div>
  </header>
);

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  emergencyPhone: string;
  // Business traveler fields
  isBusinessTraveler: boolean;
  companyName: string;
  designation: string;
  gstin: string;
  companyAddress: string;
  // Preferences
  dietaryPreferences: string;
  specialRequirements: string;
  preferredCurrency: string;
  newsletter: boolean;
  smsNotifications: boolean;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = React.useState<ProfileData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyPhone: "",
    isBusinessTraveler: false,
    companyName: "",
    designation: "",
    gstin: "",
    companyAddress: "",
    dietaryPreferences: "",
    specialRequirements: "",
    preferredCurrency: "INR",
    newsletter: true,
    smsNotifications: true,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  // Load profile data (in real app, this would come from an API)
  React.useEffect(() => {
    if (user) {
      // Simulate loading saved profile data
      const savedProfile = localStorage.getItem(`profile_${user.email}`);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfileData((prev) => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error("Error loading profile:", error);
        }
      }
    }
  }, [user]);

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | boolean,
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const validateGSTIN = (gstin: string): boolean => {
    // Basic GSTIN validation (15 characters, alphanumeric)
    const gstinRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Validate required fields
    if (!profileData.name || !profileData.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate GSTIN if business traveler
    if (
      profileData.isBusinessTraveler &&
      profileData.gstin &&
      !validateGSTIN(profileData.gstin)
    ) {
      toast({
        title: "Invalid GSTIN",
        description: "Please enter a valid 15-character GSTIN number.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem(
        `profile_${user?.email}`,
        JSON.stringify(profileData),
      );

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-background text-foreground">
        <div className="mx-auto max-w-2xl">
          <div className="flex min-h-screen w-full flex-col">
            <ProfileHeader />
            <main className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <User className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  Sign in to view your profile
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Manage your personal information, travel preferences, and
                  business details.
                </p>
                <LoginDialog />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-2xl">
        <div className="flex min-h-screen w-full flex-col">
          <ProfileHeader />
          <main className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter your email"
                      disabled
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter your street address"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={profileData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    value={profileData.pincode}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                    placeholder="400001"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergency-contact">Contact Name</Label>
                    <Input
                      id="emergency-contact"
                      value={profileData.emergencyContact}
                      onChange={(e) =>
                        handleInputChange("emergencyContact", e.target.value)
                      }
                      placeholder="Emergency contact name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergency-phone">Contact Phone</Label>
                    <Input
                      id="emergency-phone"
                      value={profileData.emergencyPhone}
                      onChange={(e) =>
                        handleInputChange("emergencyPhone", e.target.value)
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Traveler Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Business Traveler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="business-traveler">
                      I am a business traveler
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable GST invoicing and company billing
                    </p>
                  </div>
                  <Switch
                    id="business-traveler"
                    checked={profileData.isBusinessTraveler}
                    onCheckedChange={(checked) =>
                      handleInputChange("isBusinessTraveler", checked)
                    }
                  />
                </div>

                {profileData.isBusinessTraveler && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label htmlFor="company-name">Company Name *</Label>
                      <Input
                        id="company-name"
                        value={profileData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        placeholder="Enter company name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="designation"
                          value={profileData.designation}
                          onChange={(e) =>
                            handleInputChange("designation", e.target.value)
                          }
                          placeholder="Software Engineer"
                        />
                      </div>

                      <div>
                        <Label htmlFor="gstin">GSTIN</Label>
                        <Input
                          id="gstin"
                          value={profileData.gstin}
                          onChange={(e) =>
                            handleInputChange(
                              "gstin",
                              e.target.value.toUpperCase(),
                            )
                          }
                          placeholder="22ABCDE1234F1Z5"
                          maxLength={15}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          15-character GST identification number
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company-address">Company Address</Label>
                      <Textarea
                        id="company-address"
                        value={profileData.companyAddress}
                        onChange={(e) =>
                          handleInputChange("companyAddress", e.target.value)
                        }
                        placeholder="Enter company address for GST invoice"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Travel Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Travel Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dietary">Dietary Preferences</Label>
                  <Select
                    value={profileData.dietaryPreferences}
                    onValueChange={(value) =>
                      handleInputChange("dietaryPreferences", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select dietary preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        No specific preferences
                      </SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="halal">Halal</SelectItem>
                      <SelectItem value="kosher">Kosher</SelectItem>
                      <SelectItem value="gluten-free">Gluten-free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="special-requirements">
                    Special Requirements
                  </Label>
                  <Textarea
                    id="special-requirements"
                    value={profileData.specialRequirements}
                    onChange={(e) =>
                      handleInputChange("specialRequirements", e.target.value)
                    }
                    placeholder="Any special requirements or accessibility needs"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Preferred Currency</Label>
                  <Select
                    value={profileData.preferredCurrency}
                    onValueChange={(value) =>
                      handleInputChange("preferredCurrency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (<span className="rupee-font">₹</span>)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="SGD">Singapore Dollar (S$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newsletter">
                        Newsletter Subscription
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive travel deals and updates
                      </p>
                    </div>
                    <Switch
                      id="newsletter"
                      checked={profileData.newsletter}
                      onCheckedChange={(checked) =>
                        handleInputChange("newsletter", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get booking confirmations via SMS
                      </p>
                    </div>
                    <Switch
                      id="sms"
                      checked={profileData.smsNotifications}
                      onCheckedChange={(checked) =>
                        handleInputChange("smsNotifications", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </main>
        </div>
      </div>
    </div>
  );
}
