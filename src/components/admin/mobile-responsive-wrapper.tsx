"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface MobileResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileResponsiveWrapper: React.FC<MobileResponsiveWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn(
      "w-full",
      // Mobile-first responsive classes
      "px-4 sm:px-6 lg:px-8",
      "py-4 sm:py-6",
      "space-y-4 sm:space-y-6",
      // Ensure proper overflow handling on mobile
      "overflow-x-auto",
      className
    )}>
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
};

// Grid responsive component
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}> = ({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 },
  gap = "4",
  className 
}) => {
  const gridClasses = cn(
    "grid",
    `gap-${gap}`,
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Card responsive component
export const ResponsiveCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}> = ({ children, className, padding = 'md' }) => {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div className={cn(
      "bg-white rounded-lg border shadow-sm",
      paddingClasses[padding],
      // Mobile-specific adjustments
      "overflow-hidden",
      "break-words",
      className
    )}>
      {children}
    </div>
  );
};

// Table responsive wrapper
export const ResponsiveTable: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn(
      "overflow-x-auto",
      "rounded-lg border",
      "bg-white",
      // Mobile scrolling behavior
      "-mx-4 sm:mx-0",
      "scrollbar-hide",
      className
    )}>
      <div className="min-w-full inline-block align-middle">
        {children}
      </div>
    </div>
  );
};

// Flex responsive component
export const ResponsiveFlex: React.FC<{
  children: React.ReactNode;
  direction?: 'row' | 'col';
  breakpoint?: 'sm' | 'md' | 'lg';
  gap?: string;
  className?: string;
}> = ({ 
  children, 
  direction = 'col',
  breakpoint = 'md',
  gap = '4',
  className 
}) => {
  const flexClasses = cn(
    "flex",
    direction === 'col' ? 'flex-col' : 'flex-row',
    breakpoint === 'sm' && direction === 'col' ? 'sm:flex-row' : '',
    breakpoint === 'md' && direction === 'col' ? 'md:flex-row' : '',
    breakpoint === 'lg' && direction === 'col' ? 'lg:flex-row' : '',
    `gap-${gap}`,
    className
  );

  return (
    <div className={flexClasses}>
      {children}
    </div>
  );
};

// Mobile-friendly button group
export const ResponsiveButtonGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-2 sm:gap-3",
      "w-full sm:w-auto",
      className
    )}>
      {children}
    </div>
  );
};

// Screen size hook for conditional rendering
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = React.useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
};
