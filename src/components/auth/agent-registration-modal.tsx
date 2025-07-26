"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase, supabaseHelpers } from "@/lib/supabaseClient";
import { activityLogger } from "@/lib/services/activity-logger";

interface AgentRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentRegistrationModal({ open, onOpenChange }: AgentRegistrationModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company Information
    companyName: "",
    businessType: "",
    gstinNumber: "",
    panNumber: "",
    registrationNumber: "",

    // Contact Information
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    businessAddress: "",
    city: "",
    state: "",
    pincode: "",

    // Agreement
    agreedToTerms: false,
    agreedToProcessing: false,
  });

  const [emailError, setEmailError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time email validation
    if (field === "primaryContactEmail" && typeof value === "string") {
      if (value.trim() === "") {
        setEmailError("");
        setIsEmailValid(true);
      } else if (!validateEmail(value)) {
        setEmailError("Please enter a valid email address (e.g., user@company.com)");
        setIsEmailValid(false);
      } else {
        setEmailError("");
        setIsEmailValid(true);
      }
    }
  };

  const nextStep = () => {
    // Additional validation for step 2 (email validation)
    if (currentStep === 2) {
      if (!isEmailValid || formData.primaryContactEmail.trim() === "") {
        setEmailError("Please enter a valid email address before proceeding");
        setIsEmailValid(false);
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Final validation before submission
    if (!isEmailValid || formData.primaryContactEmail.trim() === "") {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address before submitting.",
        variant: "destructive",
      });
      setCurrentStep(2); // Go back to step 2 to fix email
      setEmailError("Please enter a valid email address");
      setIsEmailValid(false);
      return;
    }

    // Validate form
    if (!formData.agreedToTerms || !formData.agreedToProcessing) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    try {
      // First create user account
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: formData.primaryContactEmail,
        password: 'temp-password-' + Math.random(), // User will need to reset password
        options: {
          data: {
            name: formData.primaryContactName,
            role: 'agent'
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Create user record
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          id: authUser.user?.id,
          email: formData.primaryContactEmail,
          name: formData.primaryContactName,
          role: 'agent',
          phone: formData.primaryContactPhone
        })
        .select()
        .single();

      if (userError) {
        throw userError;
      }

      // Create agent profile (pending status)
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .insert({
          user_id: user.id,
          company_name: formData.companyName,
          company_address: `${formData.businessAddress}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          license_number: formData.gstinNumber,
          business_type: formData.businessType,
          status: 'pending',
          documents: {
            pan_number: formData.panNumber,
            gstin_number: formData.gstinNumber,
            registration_number: formData.registrationNumber
          }
        })
        .select()
        .single();

      if (agentError) {
        throw agentError;
      }

      // Log activity
      await activityLogger.logRegistration(user.id, 'agent', {
        company_name: formData.companyName,
        business_type: formData.businessType
      });

      // Send notification to super admins
      const { data: superAdmins } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'super_admin');

      if (superAdmins) {
        for (const admin of superAdmins) {
          await supabaseHelpers.sendNotification({
            recipient_id: admin.id,
            title: 'New Agent Registration',
            message: `New agent registration from ${formData.companyName} is pending approval.`,
            related_type: 'agent',
            related_id: agent.id,
            action_url: '/superadmin/agents/approval'
          });
        }
      }

      toast({
        title: "Registration Submitted",
        description: "Your agent registration has been submitted for review. You'll receive an email confirmation once approved.",
      });

      // Reset form and close modal
      setFormData({
        companyName: "",
        businessType: "",
        gstinNumber: "",
        panNumber: "",
        registrationNumber: "",
        primaryContactName: "",
        primaryContactEmail: "",
        primaryContactPhone: "",
        businessAddress: "",
        city: "",
        state: "",
        pincode: "",
        agreedToTerms: false,
        agreedToProcessing: false,
      });
      setEmailError("");
      setIsEmailValid(true);
      setCurrentStep(1);
      onOpenChange(false);

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setEmailError("");
    setIsEmailValid(true);
    setCurrentStep(1);
    onOpenChange(false);
  };

  const isStep1Valid = formData.companyName && formData.businessType && formData.gstinNumber && formData.panNumber;
  const isStep2Valid = formData.primaryContactName && formData.primaryContactEmail && formData.primaryContactPhone && formData.businessAddress && isEmailValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Building2 className="h-6 w-6 text-primary" />
            Agent Registration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Input
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) => handleInputChange("businessType", e.target.value)}
                    placeholder="e.g., Travel Agency, Tour Operator"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstinNumber">GSTIN Number *</Label>
                  <Input
                    id="gstinNumber"
                    value={formData.gstinNumber}
                    onChange={(e) => handleInputChange("gstinNumber", e.target.value)}
                    placeholder="Enter GSTIN number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange("panNumber", e.target.value)}
                    placeholder="Enter PAN number"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="registrationNumber">Business Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                    placeholder="Enter business registration number (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={nextStep} disabled={!isStep1Valid}>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Contact & Address Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact & Address Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryContactName">Primary Contact Name *</Label>
                  <Input
                    id="primaryContactName"
                    value={formData.primaryContactName}
                    onChange={(e) => handleInputChange("primaryContactName", e.target.value)}
                    placeholder="Enter contact person name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryContactPhone">Phone Number *</Label>
                  <Input
                    id="primaryContactPhone"
                    value={formData.primaryContactPhone}
                    onChange={(e) => handleInputChange("primaryContactPhone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="primaryContactEmail">Email Address *</Label>
                  <Input
                    id="primaryContactEmail"
                    type="email"
                    value={formData.primaryContactEmail}
                    onChange={(e) => handleInputChange("primaryContactEmail", e.target.value)}
                    placeholder="Enter email address (e.g., contact@company.com)"
                    className={!isEmailValid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                  />
                  {emailError && (
                    <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                      <X className="h-3 w-3" />
                      {emailError}
                    </p>
                  )}
                  {isEmailValid && formData.primaryContactEmail.trim() !== "" && (
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <CheckCircle className="h-3 w-3" />
                      Valid email address
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Textarea
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                    placeholder="Enter complete business address"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="Enter state"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    placeholder="Enter pincode"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={nextStep} disabled={!isStep2Valid}>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Terms & Submission */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Terms & Conditions</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked)}
                  />
                  <Label htmlFor="agreedToTerms" className="text-sm leading-6">
                    I agree to the <button className="text-primary underline">Terms and Conditions</button> and understand that my registration will be reviewed before approval.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreedToProcessing"
                    checked={formData.agreedToProcessing}
                    onCheckedChange={(checked) => handleInputChange("agreedToProcessing", checked)}
                  />
                  <Label htmlFor="agreedToProcessing" className="text-sm leading-6">
                    I consent to the processing of my personal and business information for the purpose of agent registration and account management.
                  </Label>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">What happens next?</p>
                    <ul className="mt-2 space-y-1 text-blue-700">
                      <li>• Your application will be reviewed within 2-3 business days</li>
                      <li>• We'll verify your business documents</li>
                      <li>• You'll receive an email confirmation once approved</li>
                      <li>• Access to the agent dashboard will be granted upon approval</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!formData.agreedToTerms || !formData.agreedToProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Registration
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
