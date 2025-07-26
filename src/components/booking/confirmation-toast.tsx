"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationToastProps {
  bookingReference: string;
  packageTitle: string;
  showToast?: boolean;
}

export function ConfirmationToast({ 
  bookingReference, 
  packageTitle, 
  showToast = true 
}: ConfirmationToastProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (showToast && bookingReference) {
      toast({
        title: "🎉 Booking Confirmed!",
        description: (
          <div className="space-y-2">
            <p>Your booking for "{packageTitle}" has been confirmed.</p>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <span className="text-sm font-mono">Ref: {bookingReference}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(bookingReference);
                  toast({
                    title: "Copied!",
                    description: "Booking reference copied to clipboard",
                  });
                }}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ),
        duration: 8000,
      });
    }
  }, [showToast, bookingReference, packageTitle, toast]);

  return null;
}
