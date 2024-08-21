import { Bot, Keyboard } from "grammy";
import 'dotenv/config';
import * as process from "node:process";

const webappUrl = process.env.WEBAPP_URL || '';
const token = process.env.BOT_TOKEN || '';
const bot = new Bot(token);

const users = new Set<number>();
const appKeyboard = new Keyboard()
    .webApp("Опубликовать тренировку", `${webappUrl}/#/events/create`);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running.", { reply_markup: appKeyboard }));

bot.command("subscribe", (ctx) => {
    const id = ctx.message?.from?.id;

    if (!id) return ctx.reply("I can't subscribe you if I don't know who you are!");

    users.add(id);

    return ctx.reply("Subscribed!");
});

bot.command("unsubscribe", (ctx) => {
    const id = ctx.message?.from?.id;

    if (!id) return ctx.reply("I can't unsubscribe you if I don't know who you are!");

    users.delete(id);

    return ctx.reply("Unsubscribed!");
});

async function broadcast(message: string, exclude: number[] = []) {
    const requests = [...users]
        .filter((user) => !exclude.includes(user))
        .map((user) => bot.api.sendMessage(user, message));

    await Promise.all(requests);
}

bot.on("message", async (ctx) => {
    if (ctx.message.web_app_data) {
        const action = JSON.parse(ctx.message.web_app_data.data);

        if (action.action === "publish_event") {
            await broadcast(`Новая тренировка: ${action.date}`);

            return ctx.reply("Event published!");
        }
    }

    return ctx.react("👍");
});

(async function () {
    await bot.api.setMyCommands([
        { command: "start", description: "Старт бота" },
        { command: "subscribe", description: "Подписаться на события" },
        { command: "unsubscribe", description: "Отписаться от событий" },
    ]);

    await bot.start();
})();