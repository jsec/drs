import type { ErrorComponentProps } from '@tanstack/react-router';

import { Button } from '@mantine/core';
import { Link } from '@tanstack/react-router';

import './route-fallback.css';

export const RouteError = ({ error, reset }: ErrorComponentProps) => {
    return (
        <div className="route-fallback">
            <div className="route-fallback-title">Something went wrong</div>
            <p className="route-fallback-message">
                This view failed to load. Retrying may help; if it does not, the data for
                this route is likely unavailable.
            </p>
            {error.message
                ? <pre className="route-fallback-detail">{error.message}</pre>
                : null}
            <div className="route-fallback-actions">
                <Button onClick={reset} type="button" variant="default">
                    Try again
                </Button>
                <Link className="route-fallback-link" to="/">
                    Back to overview
                </Link>
            </div>
        </div>
    );
};
