import { FC, useEffect } from 'react';
import { useForm } from "react-hook-form";
import WebApp from "@twa-dev/sdk";

enum GameType {
    Training = 'training',
    Game = 'game',
}

export interface Inputs {
    type: GameType;
    date: string;
    time: string;
    price: string;
    numberOfPlayers?: string;
    description?: string;
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
        <form className={'flex flex-col gap-8'}>
            <select {...register('type', { required: true })} >
                <option value={GameType.Training}>Тренировка</option>
                <option value={GameType.Game}>Игра</option>
            </select>
            <input type="date" placeholder="Event Date"
                   {...register('date', { required: true })}/>
            <input type={'time'} {...register('time', { required: true })}/>
            <input type={'text'} {...register('price', { valueAsNumber: true })} placeholder={'Цена'}/>
            <input type={'text'} {...register('numberOfPlayers', { valueAsNumber: true })}
                   placeholder={'Количество человек'}/>
            <textarea placeholder={'Описание'} {...register('description')}/>
        </form>
    );
};