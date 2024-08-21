import { FC, useEffect } from 'react';
import { useForm } from "react-hook-form";
import WebApp from "@twa-dev/sdk";

enum GameType {
    Training = 'training',
}

export interface Inputs {
    type: GameType;
    date: string;
}

export interface CreateEventFormProps {
    onSubmit?: (props: Inputs) => void;
}

export const CreateEventForm: FC<CreateEventFormProps> = ({ onSubmit }) => {
    const { register, getValues } = useForm<Inputs>({
        defaultValues: {
            type: GameType.Training,
            date: new Date().toISOString().split('T')[0],
        },
    });

    useEffect(() => {
        const handleButtonClick = () => onSubmit?.(getValues());

        WebApp.MainButton.setText('Опубликовать');
        WebApp.MainButton.show();
        WebApp.MainButton.onClick(handleButtonClick);

        return () => {
            WebApp.MainButton.hide();
            WebApp.MainButton.offClick(handleButtonClick);
        }
    }, [getValues, onSubmit]);

    return (
        <form className={'flex flex-col gap-20'}>
            <select {...register('type', { required: true })} className={'text-xl py-2'} disabled>
                <option value={GameType.Training}>Тренировка</option>
            </select>
            <input type="date" placeholder="Event Date"
                   className={'text-xl text-neutral-500 disabled:text-neutral-300 p-2'} {...register('date', { required: true })}/>
        </form>
    );
};