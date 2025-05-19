import React from 'react';
import { Button as MainButton } from '@heroui/react';

type Props = {
  fullwidth?:boolean;
  isDisabled?: boolean;
  variant?: 'solid' | 'faded' | 'bordered' | 'light' | 'flat' | 'ghost' | 'shadow';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  children?: React.ReactNode;
  className?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isIconOnly?:boolean;
  isLoading?:boolean;
  type?: "submit" | "reset" | "button" 
  
};

const Button = ({
  fullwidth=false,
  isDisabled = false,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  onPress,
  children,
  className,
  startContent,
  endContent,
  isIconOnly,
  isLoading,
  type

}: Props) => {
  return (
    <MainButton
      fullWidth={fullwidth}
      isDisabled={isDisabled}
      variant={variant}
      color={color}
      size={size}
      onPress={onPress}
      className={className || ""}
      startContent={startContent}
      endContent={endContent}
      isLoading={isLoading || false}
      isIconOnly={isIconOnly || false}
      type={type || "button"}
      
    >
      {children}
    </MainButton>
  );
};

export default Button;
