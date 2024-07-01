import { cn } from '@/shared/lib/utils';
import React, { ReactNode } from 'react';
interface CardProps {
  className?: string;
  children?: ReactNode;
}
const Card = ({ className = 'w-1/2', children }: CardProps) => {
  return (
    <div
      className={cn(
        'h-fit rounded-lg flex items-center py-10 gap-4 flex-col mx-auto border border-black bg-white',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
