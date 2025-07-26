import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface EnhancedButtonProps extends ButtonProps {
  onAsyncClick?: () => Promise<void>;
  loadingText?: string;
  successMessage?: string;
  errorMessage?: string;
  confirmMessage?: string;
  confirmTitle?: string;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    onAsyncClick, 
    onClick,
    loadingText,
    successMessage,
    errorMessage,
    confirmMessage,
    confirmTitle,
    children,
    disabled,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onAsyncClick) {
        // Show confirmation dialog if required
        if (confirmMessage) {
          const confirmed = confirm(confirmTitle ? `${confirmTitle}\n\n${confirmMessage}` : confirmMessage);
          if (!confirmed) return;
        }

        setIsLoading(true);
        try {
          await onAsyncClick();
          if (successMessage) {
            toast({
              title: "Success",
              description: successMessage,
            });
          }
        } catch (error) {
          toast({
            title: "Error", 
            description: errorMessage || "An error occurred. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else if (onClick) {
        onClick(e);
      }
    };

    return (
      <Button 
        {...props}
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {loadingText || "Loading..."}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";
