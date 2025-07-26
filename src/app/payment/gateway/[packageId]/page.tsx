"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { packages as allPackages } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Shield, 
  ArrowLeft, 
  CheckCircle,
  Lock,
  Users,
  Calendar,
  MapPin
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PaymentGatewayPage({ params }: { params: { packageId: string } }) {
  const router = useRouter();
  // Next.js 15+ params may be a promise, so unwrap with React.use if needed
  let packageId: string;
  if (typeof (params as any).then === "function") {
    const unwrapped = React.use(params as unknown as Promise<{ packageId: string }>);
    packageId = unwrapped?.packageId;
  } else {
    packageId = params.packageId;
  }
  const pkg = allPackages.find(p => p.id === Number(packageId));
  
  if (!pkg) return notFound();

  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    // Card Payment
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    
    // UPI Payment
    upiId: "",
    
    // Net Banking
    bankName: "",
  });

  useEffect(() => {
    // Get booking details from localStorage
    const details = localStorage.getItem('bookingDetails');
    if (details) {
      setBookingDetails(JSON.parse(details));
    } else {
      // Redirect back to booking form if no details found
      router.push(`/booking/${packageId}`);
    }
  }, [packageId, router]);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalAmount = Math.round(parseFloat(pkg.price.replace(/,/g, '')) * parseInt(bookingDetails.numberOfTravelers) * 1.18);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Generate booking reference
      const bookingRef = `BK${Date.now().toString().slice(-8)}`;

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Store booking confirmation details
      const confirmationData = {
        bookingReference: bookingRef,
        packageTitle: pkg.title,
        paymentAmount: totalAmount,
        paymentDate: new Date().toISOString(),
        bookingDetails: bookingDetails
      };

      localStorage.setItem('bookingConfirmation', JSON.stringify(confirmationData));

      // Clear booking details
      localStorage.removeItem('bookingDetails');

      // Redirect to success page
      router.push(`/payment/success/${pkg.id}?ref=${bookingRef}`);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, Rupay"
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: Smartphone,
      description: "GPay, PhonePe, Paytm"
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: Building,
      description: "All major banks"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/booking/${packageId}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking Details
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Secure Payment</h1>
              <p className="text-gray-600">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <Icon className="h-8 w-8 mb-2 text-blue-600" />
                          <h3 className="font-medium">{method.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Payment Details Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPaymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        placeholder="Name as on card"
                        value={paymentData.cardholderName}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          maxLength={4}
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === "upi" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@upi"
                        value={paymentData.upiId}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, upiId: e.target.value }))}
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You will receive a payment request on your UPI app
                      </p>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === "netbanking" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bankName">Select Your Bank</Label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={paymentData.bankName}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, bankName: e.target.value }))}
                      >
                        <option value="">Select Bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="pnb">Punjab National Bank</option>
                        <option value="bob">Bank of Baroda</option>
                      </select>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You will be redirected to your bank's secure login page
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-800">256-bit SSL Encryption</h3>
                    <p className="text-sm text-green-700">Your payment is protected by bank-grade security</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pay Now Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Pay <span className="rupee-font">₹</span>{totalAmount.toLocaleString()} Securely
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  By proceeding, you agree to our Terms & Conditions and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                <div>
                  <h3 className="font-bold text-lg">{pkg.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{pkg.destination}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Travelers
                    </span>
                    <span>{bookingDetails.numberOfTravelers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Travel Date
                    </span>
                    <span>{new Date(bookingDetails.travelDate).toLocaleDateString()}</span>
                  </div>
                  {bookingDetails.roomType && (
                    <div className="flex justify-between">
                      <span>Room Type</span>
                      <span className="capitalize">{bookingDetails.roomType}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Package Price × {bookingDetails.numberOfTravelers}</span>
                    <span>
                      <span className="rupee-font">₹</span>
                      {(parseFloat(pkg.price.replace(/,/g, '')) * parseInt(bookingDetails.numberOfTravelers)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees (18%)</span>
                    <span>
                      <span className="rupee-font">₹</span>
                      {Math.round(parseFloat(pkg.price.replace(/,/g, '')) * parseInt(bookingDetails.numberOfTravelers) * 0.18).toLocaleString()}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>
                      <span className="rupee-font">₹</span>
                      {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Free Cancellation
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Secure Payment
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
