import { Link } from '@tanstack/react-router';

import './route-fallback.css';

export const RouteNotFound = () => {
    return (
        <div className="route-fallback">
            <div className="route-fallback-title">Not found</div>
            <p className="route-fallback-message">
                That page does not exist. The link may be out of date, or the season, race
                or driver may not be in the dataset.
            </p>
            <div className="route-fallback-actions">
                <Link className="route-fallback-link" to="/">
                    Back to overview
                </Link>
            </div>
        </div>
    );
};
