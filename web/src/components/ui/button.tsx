import type { ComponentProps } from 'react';

import { cn } from '#/lib/utils';

import './button.css';

type ButtonProps = ComponentProps<'button'> & {
    size?: ButtonSize;
    variant?: ButtonVariant;
};

type ButtonSize = 'default' | 'icon' | 'sm';
type ButtonVariant = 'default' | 'ghost' | 'outline' | 'secondary' | 'subtle';

export const Button = ({ className, size = 'default', variant = 'default', ...props }: ButtonProps) => (
    <button
        className={cn('ui-button', `ui-button--${variant}`, `ui-button--${size}`, className)}
        {...props}
    />
);
