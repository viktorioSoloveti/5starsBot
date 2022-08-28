const { Telegraf, Markup } = require("telegraf");

// Создать бота с полученным ключом
const bot = new Telegraf("5478304828:AAHCiLVjF8NWY1Ayb_5VzgmfedX6Iuhb4ac");

// Работа с данными
let isStarted = false;
let step = 0;
let result = "";
const inputArray = [];

bot.start(async (ctx) => {
  ctx.replyWithHTML(
    "Добрый день, на связи <b>5starz-бот</b>! \n\n" +
      "Я помогу вам рассчитать приблизительное количество отзывов, необходимых для достижения желаемой вами оценки, задав 3 вопроса. \n\n" +
      "Помните: чем выше оценку вы желаете, тем сложнее будет ее добиться, тем больше отзывов потребуется выложить. Таким образом, оценку 4,5 получить гораздо проще, чем 4,9 (что вполне логично). \n\n" +
      "Следуйте инструкции, чтобы получить максимально точный расчет. ",
    Markup.inlineKeyboard([Markup.button.callback("Начать", "start_button")])
  );
});

bot.on("text", async (ctx) => {
  const userText = ctx.message.text.replace(/,/, ".");
  if (isStarted && isFinite(userText)) {
    switch (step) {
      case 1:
        if (userText < 5) {
          inputArray.push(userText);
          ctx.replyWithPhoto("https://ibb.co/PWDctYW", {
            caption:
              "Введите точное количество оценок на данный момент. \n Например: 459",
          });
          step = 2;
          return;
        }
        ctx.reply("Вы ввели неверную оценку, попробуйте еще раз");
        break;
      case 2:
        if (userText > 1) {
          inputArray.push(userText);
          ctx.replyWithHTML(
            "<b>Последнее.</b> Введите желаемую оценку, не выше 4.9. \n Например: 4.5"
          );
          step = 3;
          return;
        }
        ctx.reply("Вы ввели неверное количество отзывов, попробуйте еще раз");
        break;
      case 3:
        if (userText < 5) {
          inputArray.push(userText);
          const targetMark = userText;

          const y = inputArray[0];
          const z = inputArray[1];
          const c = inputArray[2];
          const top = c * z - z * y;
          const down = 5 - c;
          result = (top / down).toFixed(0);

          ctx.replyWithHTML(
            `Для достижения оценки ${targetMark} вам необходимо отзывов: ` +
              result +
              "\n\n Рассчитать стоимость и сроки добавления необходимого количества отзывов?",
            Markup.inlineKeyboard(
              [Markup.button.callback("Да", "yes_button")],
              {
                columns: 2,
              }
            )
          );
          step = 0;
          inputArray.length = 0;
          isStarted = false;
          return;
        }
        ctx.reply("Вы ввели неверную оценку, попробуйте еще раз");
        break;
    }
  } else if (isStarted) {
    ctx.replyWithHTML(
      "Для продолжения необходимо ввести <b>корректное число</b>"
    );
  } else {
    ctx.replyWithHTML(
      "Я помогу вам рассчитать приблизительное количество отзывов, необходимых для достижения желаемой вами оценки, задав 3 вопроса. \n\n" +
        "Следуйте инструкции, чтобы получить максимально точный расчет.",
      Markup.inlineKeyboard([Markup.button.callback("Начать", "start_button")])
    );
  }
});

bot.action("start_button", (ctx) => {
  isStarted = true;
  step = 1;
  ctx.replyWithPhoto("https://ibb.co/QjqbHQy", {
    caption: "Введите точную оценку на данный момент. \n Например: 3,8",
  });
});

bot.action("yes_button", (ctx) => {
  ctx.replyWithHTML(
    "Необходимое количество отзывов: " +
      result +
      "\nМесяцев для достижения результата: " +
      (result / 3 / 4).toFixed(0) +
      "\n\nДля заказа пишите: @nncnnc"
  );
});

// Обработчик команды /help
bot.help((ctx) => ctx.reply("Справка в процессе"));

bot.launch();
