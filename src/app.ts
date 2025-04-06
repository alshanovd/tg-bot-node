// import express from "express";
import { Telegraf, Context } from "telegraf";
import { message } from "telegraf/filters";
// const app = express();
// const port = 3000;

interface MyContext extends Context {
  someVar?: string;
}

// app.get("/", (req, res) => {
//   res.send("Hello world!");
// });

// app.listen(port, () => {
//   return console.log("Listening to " + port);
// });

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN);

bot.on(message("text"), async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    "Hello " + ctx.state.role
  );
});

bot.use((ctx, next) => {
  ctx.someVar = ctx.chat?.type;
  return next();
});

bot.launch();
