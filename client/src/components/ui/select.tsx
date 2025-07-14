import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const Select = ({ value, onValueChange, children, disabled }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, {
            value,
            onValueChange,
            isOpen,
            setIsOpen,
            disabled,
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ className, children, ...props }: SelectTriggerProps & any) => (
  <button
    type="button"
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    onClick={() => props.setIsOpen?.(!props.isOpen)}
    disabled={props.disabled}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
);

const SelectValue = ({ placeholder, ...props }: SelectValueProps & any) => (
  <span className="text-left">
    {props.value || placeholder}
  </span>
);

const SelectContent = ({ children, ...props }: SelectContentProps & any) => {
  if (!props.isOpen) return null;

  return (
    <div className="absolute top-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, {
            onValueChange: props.onValueChange,
            setIsOpen: props.setIsOpen,
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectItem = ({ value, children, ...props }: SelectItemProps & any) => (
  <div
    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
    onClick={() => {
      props.onValueChange?.(value);
      props.setIsOpen?.(false);
    }}
  >
    {children}
  </div>
);

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };