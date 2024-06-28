import { cn } from '@/shared/lib/utils';
import { ReactNode } from 'react';
import {
  Button as RAButton,
  ButtonProps as RAButtonProps,
} from 'react-aria-components';
import { cva, VariantProps } from 'class-variance-authority';

export type ButtonProps = VariantProps<typeof button> & {
  className?: string;
  children?: ReactNode;
  icon?: ReactNode;
  iconPlacement?: 'left' | 'right';
} & RAButtonProps;

const button = cva(
  'text-sm leading-5 whitespace-nowrap cursor-pointer font-semibold focus:outline-none flex justify-center items-center transition duration-150',
  {
    variants: {
      variant: {
        outline:
          'border-solid border border-neutral-900 bg-white hover:bg-neutral-100 active:ring-4 active:ring-neutral-200',
        primary:
          'border-none bg-black text-white hover:bg-neutral-900 active:ring-8 active:ring-neutral-300',
        text: 'border-0 bg-none hover:bg-neutral-100 active:ring-4 active:ring-neutral-100',
      },
      size: {
        normal: 'px-4 py-2',
        large: 'px-6 py-4',
      },
      disabled: {
        false: null,
        true: 'opacity-50',
      },
      loading: {
        false: null,
        true: 'pointer-events-none',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'normal',
    },
  }
);

export const Button = ({
  variant = 'outline',
  size = 'normal',
  loading = false,
  disabled = false,
  icon,
  iconPlacement = 'left',
  children,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <RAButton
      className={cn(
        button({
          variant,
          size,
          loading,
          disabled: loading || disabled,
          className: cn(
            icon && !children ? 'rounded-full' : 'rounded-lg',
            className
          ),
        })
      )}
      isDisabled={Boolean(loading || disabled)}
      {...rest}
    >
      {loading ? (
        <div className='flex justify-center items-center space-x-2 h-5'>
          <Dot variant={variant} />
          <Dot variant={variant} />
          <Dot variant={variant} />
        </div>
      ) : (
        <>
          {icon && iconPlacement === 'left' && (
            <span className={cn('text-xl leading-[0]', { 'mr-2': children })}>
              {icon}
            </span>
          )}

          {children}

          {icon && iconPlacement === 'right' && (
            <span className={cn('text-xl leading-[0]', { 'ml-2': children })}>
              {icon}
            </span>
          )}
        </>
      )}
    </RAButton>
  );
};

function Dot({ variant }: { variant: ButtonProps['variant'] }) {
  return (
    <div
      className={cn('dot w-1.5 h-1.5 bg-opacity-75 rounded bg-white', {
        'bg-black': variant === 'outline',
      })}
    ></div>
  );
}

export default Button;
