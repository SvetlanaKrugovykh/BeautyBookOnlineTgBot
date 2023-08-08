
const sendReqToDB = require('../modules/tlg_to_DB')
const { buttonsConfig } = require('../modules/keyboard')
const inputLineScene = require('./inputLine')

async function bookOnLineScene(bot, msg, locationId) {
  try {
    const chatId = msg.chat.id
    await bot.sendMessage(chatId, buttonsConfig["locationsButtons"].title, {
      reply_markup: {
        keyboard: buttonsConfig["locationsButtons"].buttons,
        resize_keyboard: true
      }
    })

    if (locationId !== false) {
      await bot.sendMessage(chatId, buttonsConfig["masterOrServiceButtons"].title, {
        reply_markup: {
          keyboard: buttonsConfig["masterOrServiceButtons"].buttons,
          resize_keyboard: true
        }
      })
    }

  } catch (err) {
    console.log(err)
  }
}

async function bookMasterScene(bot, msg) {
  try {
    const chatId = msg.chat.id


  } catch (err) {
    console.log(err)
  }
}

async function bookServiceScene(bot, msg) {
  try {
    const chatId = msg.chat.id


  } catch (err) {
    console.log(err)
  }
}

module.exports = { bookOnLineScene, bookMasterScene, bookServiceScene }
