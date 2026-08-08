import type { ComponentProps } from 'react';

import { cn } from '#/lib/utils';

import './input.css';

export const Input = ({ className, ...props }: ComponentProps<'input'>) => (
    <input className={cn('ui-input', className)} {...props} />
);

export const InputGroup = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('ui-input-group', className)} {...props} />
);
