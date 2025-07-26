"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Check,
  X,
  CreditCard,
  Star,
  Zap,
  Crown,
  Calendar,
  Package,
  Camera,
  Users,
  TrendingUp,
  Shield,
  HeadphonesIcon,
} from "lucide-react";

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );
  const [currentPlan, setCurrentPlan] = useState("trial"); // This would come from API

  const plans = [
    {
      id: "trial",
      name: "Trial",
      description: "Perfect for getting started",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: Zap,
      color: "bg-gray-100 text-gray-600",
      popular: false,
      features: [
        { name: "Up to 3 packages", included: true },
        { name: "Up to 30 photos total", included: true },
        { name: "Basic listing visibility", included: true },
        { name: "WhatsApp integration", included: true },
        { name: "Email support", included: true },
        { name: "Auto-publish packages", included: false },
        { name: "Priority support", included: false },
        { name: "Advanced analytics", included: false },
        { name: "Custom branding", included: false },
        { name: "API access", included: false },
      ],
      limits: {
        packages: 3,
        photos: 30,
        bookingsPerMonth: 5,
      },
      cta: "Current Plan",
    },
    {
      id: "growth",
      name: "Growth",
      description: "For growing travel businesses",
      monthlyPrice: 349,
      yearlyPrice: 3499,
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600",
      popular: true,
      features: [
        { name: "Up to 25 packages", included: true },
        { name: "Up to 250 photos total", included: true },
        { name: "Enhanced listing visibility", included: true },
        { name: "WhatsApp integration", included: true },
        { name: "Priority email support", included: true },
        { name: "Auto-publish packages", included: true },
        { name: "Basic analytics", included: true },
        { name: "Customer reviews management", included: true },
        { name: "Advanced analytics", included: false },
        { name: "Custom branding", included: false },
        { name: "API access", included: false },
      ],
      limits: {
        packages: 25,
        photos: 250,
        bookingsPerMonth: 50,
      },
      cta: "Upgrade to Growth",
    },
    {
      id: "pro",
      name: "Pro",
      description: "For established travel companies",
      monthlyPrice: 999,
      yearlyPrice: 9999,
      icon: Crown,
      color: "bg-purple-100 text-purple-600",
      popular: false,
      features: [
        { name: "Unlimited packages", included: true },
        { name: "Unlimited photos", included: true },
        { name: "Premium listing visibility", included: true },
        { name: "WhatsApp integration", included: true },
        { name: "24/7 phone & email support", included: true },
        { name: "Auto-publish packages", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Custom branding", included: true },
        { name: "API access", included: true },
        { name: "Dedicated account manager", included: true },
      ],
      limits: {
        packages: -1, // Unlimited
        photos: -1, // Unlimited
        bookingsPerMonth: -1, // Unlimited
      },
      cta: "Upgrade to Pro",
    },
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === currentPlan) return;

    if (planId === "trial") {
      // Handle downgrade to trial
      alert("Please contact support to downgrade your plan.");
      return;
    }

    // In a real app, this would integrate with Stripe
    const plan = plans.find((p) => p.id === planId);
    const price =
      billingCycle === "yearly" ? plan?.yearlyPrice : plan?.monthlyPrice;

    alert(
      `Redirecting to Stripe Checkout for ${plan?.name} plan - ₹${price}/${billingCycle === "yearly" ? "year" : "month"}`,
    );

    // Example Stripe integration:
    // const stripe = await stripePromise;
    // const { error } = await stripe.redirectToCheckout({
    //   lineItems: [{
    //     price: planId === 'growth' ? 'price_growth_plan' : 'price_pro_plan',
    //     quantity: 1,
    //   }],
    //   mode: 'subscription',
    //   successUrl: `${window.location.origin}/agent-dashboard/subscription?success=true`,
    //   cancelUrl: `${window.location.origin}/agent-dashboard/subscription?canceled=true`,
    // });
  };

  const savings = billingCycle === "yearly" ? "Save 2 months" : null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-gray-600 mt-2">
          Select the perfect plan for your travel business
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
          <Label
            htmlFor="billing-toggle"
            className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) =>
              setBillingCycle(checked ? "yearly" : "monthly")
            }
          />
          <Label
            htmlFor="billing-toggle"
            className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
              billingCycle === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Yearly
            {savings && (
              <span className="ml-2 text-green-600 text-xs">({savings})</span>
            )}
          </Label>
        </div>
      </div>

      {/* Current Plan Status */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Current Plan</h3>
              <p className="text-blue-700">
                You are currently on the{" "}
                <strong>{plans.find((p) => p.id === currentPlan)?.name}</strong>{" "}
                plan
              </p>
            </div>
            <Badge variant="secondary">
              {currentPlan === "trial" && "Trial"}
              {currentPlan === "growth" && "Growth"}
              {currentPlan === "pro" && "Pro"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price =
            billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          const isCurrentPlan = currentPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? "ring-2 ring-blue-500 shadow-lg" : ""} ${
                isCurrentPlan ? "bg-green-50 border-green-200" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${plan.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    <span className="rupee-font">₹</span>
                    {price.toLocaleString()}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === "yearly" ? "year" : "month"}
                  </span>
                  {billingCycle === "yearly" && plan.id !== "trial" && (
                    <div className="text-sm text-green-600 mt-1">
                      Save <span className="rupee-font">₹</span>{(
                        plan.monthlyPrice * 12 -
                        plan.yearlyPrice
                      ).toLocaleString()} {" "}
                      annually
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Button
                  className={`w-full ${isCurrentPlan ? "bg-green-600 hover:bg-green-700" : ""}`}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Current Plan" : plan.cta}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm uppercase tracking-wide text-gray-500">
                    Features & Limits
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        )}
                        <span
                          className={
                            feature.included ? "text-gray-700" : "text-gray-400"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Limits Summary */}
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-xs uppercase tracking-wide text-gray-500 mb-2">
                    Monthly Limits
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <Package className="h-3 w-3 mr-1 text-gray-400" />
                      <span>
                        {plan.limits.packages === -1
                          ? "Unlimited"
                          : plan.limits.packages}{" "}
                        packages
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Camera className="h-3 w-3 mr-1 text-gray-400" />
                      <span>
                        {plan.limits.photos === -1
                          ? "Unlimited"
                          : plan.limits.photos}{" "}
                        photos
                      </span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <Users className="h-3 w-3 mr-1 text-gray-400" />
                      <span>
                        {plan.limits.bookingsPerMonth === -1
                          ? "Unlimited"
                          : plan.limits.bookingsPerMonth}{" "}
                        bookings/month
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">How does billing work?</h4>
            <p className="text-sm text-gray-600">
              You can choose between monthly and yearly billing. Yearly plans
              offer significant savings. All plans auto-renew unless cancelled.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Can I change my plan anytime?</h4>
            <p className="text-sm text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes
              take effect at the next billing cycle.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">
              What is the commission structure?
            </h4>
            <p className="text-sm text-gray-600">
              We charge a 15% platform fee on successful bookings. This is
              deducted from payouts after trip completion and customer
              satisfaction confirmation.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Is there a setup fee?</h4>
            <p className="text-sm text-gray-600">
              No setup fees! You only pay the monthly/yearly subscription fee.
              The Trial plan is completely free to get started.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <HeadphonesIcon className="h-8 w-8 mx-auto text-blue-600 mb-3" />
          <h3 className="font-semibold mb-2">Need Help Choosing?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Our team is here to help you find the perfect plan for your business
            needs.
          </p>
          <Button variant="outline">Contact Support</Button>
        </CardContent>
      </Card>
    </div>
  );
}
