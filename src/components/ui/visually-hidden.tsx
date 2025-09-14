import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function VisuallyHidden({ children, asChild = false }: VisuallyHiddenProps) {
  const className = "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0";
  
  if (asChild) {
    return React.cloneElement(
      React.Children.only(children) as React.ReactElement,
      { className }
    );
  }

  return (
    <span className={className}>
      {children}
    </span>
  );
}