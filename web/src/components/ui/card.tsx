import type { ComponentProps } from 'react';

import { cn } from '#/lib/utils';

import './card.css';

export const Card = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('ui-card', className)} {...props} />
);

export const CardHeader = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('ui-card-header', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('ui-card-title', className)} {...props} />
);

export const CardDescription = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('ui-card-description', className)} {...props} />
);

export const CardContent = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('ui-card-content', className)} {...props} />
);
