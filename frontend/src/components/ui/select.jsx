import * as React from "react";
import { cn } from "@/lib/utils";

const SelectContext = React.createContext(null);

function Select({ value, onValueChange, children }) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  );
}

function SelectTrigger({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SelectValue({ placeholder }) {
  const context = React.useContext(SelectContext);
  return <span>{context?.value ? context.value : placeholder}</span>;
}

function SelectContent({ children }) {
  return children;
}

function SelectItem() {
  return null;
}

function SelectGroup({ children }) {
  return children;
}

function SelectLabel({ children }) {
  return children;
}

function SelectSeparator() {
  return null;
}

function SelectScrollUpButton() {
  return null;
}

function SelectScrollDownButton() {
  return null;
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
