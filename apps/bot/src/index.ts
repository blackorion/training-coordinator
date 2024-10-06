import { Bot, Keyboard } from "grammy";
import 'dotenv/config';
import * as process from "node:process";
import k from "knex";
import dbConfig from "../knexfile";

const profile =
    process.env.NODE_ENV === "production" ? "production" : "development";

const knex = k(dbConfig[profile]);

const webappUrl = process.env.WEBAPP_URL || '';
const token = process.env.BOT_TOKEN || '';
const bot = new Bot(token);

const appKeyboard = new Keyboard()
    .webApp("Опубликовать тренировку", `${webappUrl}/#/events/create`);

bot.command("start", (ctx) => ctx.reply("Добро пожаловать!", { reply_markup: appKeyboard }));

bot.command("subscribe", async (ctx) => {
    const id = ctx.message?.from?.id;

    if (!id) return ctx.reply("I can't subscribe you if I don't know who you are!");

    const user = await knex('subscriptions')
        .where('user_id', id)
        .first();

    if (!user)
        await knex('subscriptions')
            .insert({ user_id: id });

    return ctx.reply("Подписались!");
});

bot.command("unsubscribe", async (ctx) => {
    const id = ctx.message?.from?.id;

    if (!id) return ctx.reply("I can't unsubscribe you if I don't know who you are!");

    await knex('subscriptions')
        .where('user_id', id)
        .delete();

    return ctx.reply("Отписались!");
});

async function broadcast(message: string, exclude: number[] = []) {
    const users = await knex('subscriptions')
        .select('user_id')
        .whereNotIn('user_id', exclude)
        .pluck('user_id');

    const requests = [...users]
        .filter((user) => !exclude.includes(user))
        .map((user) => bot.api.sendMessage(user, message));

    await Promise.all(requests);
}

bot.on("message", async (ctx) => {
    if (ctx.message.web_app_data) {
        const id = ctx.message?.from?.id ?? -1;
        const action = JSON.parse(ctx.message.web_app_data.data);

        if (action.action === "publish_event") {
            const data = action.data;
            await broadcast(`Новая ${data.type === 'training' ? 'тренировка' : 'игра'}: ${data.date} в ${data.time}\n${data.price}р\n${data.description}`, [id]);

            return ctx.reply("Опубликовано!");
        }
    }

    return ctx.react("👍");
});

(async function () {
    await knex.migrate.latest();

    await bot.api.setMyCommands([
        { command: "start", description: "Старт бота" },
        { command: "subscribe", description: "Подписаться на события" },
        { command: "unsubscribe", description: "Отписаться от событий" },
    ]);

    await bot.start();
})();