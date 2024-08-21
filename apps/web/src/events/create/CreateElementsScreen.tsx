import { FC } from 'react';
import { CreateEventForm, Inputs } from "./CreateEventForm.tsx";
import WebApp from "@twa-dev/sdk";

export const CreateElementsScreen: FC = () => {
    const handleSubmit = (props: Inputs) => WebApp.sendData(
        JSON.stringify({ ...props, action: 'publish_event' })
    );

    return (
        <div className={'grid place-content-center'}>
            <div className={'w-full max-w-screen-2xl'}>
                <CreateEventForm onSubmit={handleSubmit}/>
            </div>
        </div>
    );
};