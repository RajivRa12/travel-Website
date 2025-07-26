"use client";

import * as React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { destinations } from "@/lib/data";

export const FilterSheet = ({
  onApplyFilters,
}: {
  onApplyFilters?: (filters: any) => void;
}) => {
  const [destination, setDestination] = React.useState("All");
  const [budget, setBudget] = React.useState([100000]);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({
        destination,
        budget: budget[0],
      });
    }
    setIsOpen(false); // Close the sheet after applying
  };

  const handleClear = () => {
    setDestination("All");
    setBudget([100000]);
    if (onApplyFilters) {
      onApplyFilters({
        destination: "All",
        budget: 100000,
      });
    }
    setIsOpen(false); // Close the sheet after clearing
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-1 xs:gap-2 shrink-0 touch-target agent-btn-compact text-xs xs:text-sm">
          <Filter className="h-3 w-3 xs:h-4 xs:w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[85vh] overflow-y-auto agent-modal-mobile"
      >
        <SheetHeader className="text-left p-mobile-3">
          <SheetTitle className="text-responsive-base">Filters</SheetTitle>
          <SheetDescription className="text-responsive-xs">
            Refine your search for the perfect getaway.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 xs:gap-6 py-3 xs:py-6 p-mobile-3 space-mobile-3">
          <div className="grid gap-2 xs:gap-3">
            <Label htmlFor="destination" className="text-xs xs:text-sm text-responsive-xs">Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger id="destination" className="h-9 xs:h-10 text-xs xs:text-sm">
                <SelectValue placeholder="Select a destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((dest) => (
                  <SelectItem key={dest.name} value={dest.name}>
                    {dest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 xs:gap-3">
            <Label htmlFor="budget" className="text-xs xs:text-sm text-responsive-xs">
              Budget (per person) - <span className="rupee-font">₹</span>{budget[0].toLocaleString()}
            </Label>
            <div className="flex justify-between text-xs xs:text-sm text-muted-foreground text-responsive-xs">
              <span><span className="rupee-font">₹</span>10k</span>
              <span><span className="rupee-font">₹</span>1L+</span>
            </div>
            <Slider
              value={budget}
              onValueChange={setBudget}
              max={100000}
              min={10000}
              step={1000}
              className="py-2"
            />
          </div>
        </div>
        <SheetFooter className="p-mobile-3 agent-spacing">
          <Button variant="ghost" onClick={handleClear} className="touch-target agent-btn-compact text-xs xs:text-sm">
            Clear
          </Button>
          <Button type="submit" className="flex-1 touch-target text-xs xs:text-sm" onClick={handleApply}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
