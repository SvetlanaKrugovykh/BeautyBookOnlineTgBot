const sendReqToDB = require('../modules/tlg_to_DB')

async function createOrder(bot, msg, selectedByUser) {
  try {
    console.log('Обрано дату та час', msg.text)
    //TODO dor many services
    const datastr = msg.text
    const chatId = msg.chat.id
    const master = selectedByUser[chatId].Masters[0]
    const service = selectedByUser[chatId].Services[0]
    if (!master) {
      console.log("Master is undefined")
      return null
    }
    const match = master.match(/^(.*?)\s*#/)
    if (!match) {
      console.log("Match not found in master")
      return null
    }
    const masterName = match[1]
    const cleanedService = service.replace(/○/g, '')
    const text = `masters:${masterName};#services:${cleanedService};#date:${datastr}`
    const data = await sendReqToDB('__CreateOrder__', msg.chat, text)
    const parsedData = JSON.parse(data).ResponseArray
    const clientChoiceButtons = await dataTimeChoiceFromList(bot, msg, parsedData)
    await bot.sendMessage(msg.chat.id, clientChoiceButtons.title, {
      reply_markup: {
        keyboard: clientChoiceButtons.buttons,
        resize_keyboard: true
      }
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports = { createOrder }