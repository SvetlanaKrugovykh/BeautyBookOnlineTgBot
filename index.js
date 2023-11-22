const TelegramBot = require('node-telegram-bot-api')
const Fastify = require('fastify')
require('dotenv').config()

const { buttonsConfig } = require('./modules/keyboard')
const { users } = require('./users/users.model')
const { handler, guestMenu, adminMenu, addToSelectedServices } = require('./controllers/switcher')
const singUpDataSave = require('./controllers/signUp').singUpDataSave
const formController = require('./controllers/formController')

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const webAppUrl = 'https://' + process.env.WEB_APP_URL

const app = Fastify({
  trustProxy: true
})

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true })

app.register(require('@fastify/cors'), {})


bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const chosenOption = callbackQuery.data;

  switch (chosenOption) {
    case '77_1':
      addToSelectedServices(chatId, 'Догляд за волоссям');
      break;
    case '77_2':
      addToSelectedServices(chatId, 'Манікюр');
      break;
    case '77_3':
      addToSelectedServices(chatId, 'Педікюр');
      break;
    case '77_4':
      addToSelectedServices(chatId, 'Догляд за обличчям');
      break;
    default:
      console.log(`Выбрано: ${chosenOption}`);
      break;
  }
})

bot.on('message', async (msg) => {

  const chatId = msg.chat.id
  const text = msg.text
  const ctx = msg

  if (text === '/start') {
    console.log(new Date())
    console.log(ctx.chat)
    const adminUser = users.find(user => user.id === ctx.chat.id)
    if (!adminUser) {
      try {
        await guestMenu(bot, msg, buttonsConfig["guestStartButtons"])
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        await adminMenu(bot, msg, buttonsConfig["adminStartButtons"])
      } catch (err) {
        console.log(err)
      }
    }
  } else {
    await handler(bot, msg, webAppUrl)
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data)
      console.log(data)
      await bot.sendMessage(chatId, 'Дякуємо за зворотній зв`язок!')
      await bot.sendMessage(chatId, 'Ваш email: ' + data?.email)
      await bot.sendMessage(chatId, 'Ваш телефон: ' + data?.phoneNumber)
      await bot.sendMessage(chatId, 'Всю необхідну інформацію Ви можете отримувати в цьому чаті. Якщо у Вас виникли питання, звертайтесь через меню /"Надіслати повідомлення/". Зараз для переходу в головне меню натисніть /start')
      await singUpDataSave(bot, chatId, data)
      return
    } catch (e) {
      console.log(e)
    }
  }

})

app.post('/submit-form', formController.handleFormSubmit)

