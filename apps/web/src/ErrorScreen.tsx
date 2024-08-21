import { FC } from 'react';
import { useRouteError } from "react-router-dom";

export const ErrorScreen: FC = () => {
    const error = useRouteError() as { statusText: string | undefined, message: string };

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
};

export default ErrorScreen;