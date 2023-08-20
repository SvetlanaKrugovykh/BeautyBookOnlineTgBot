const sendReqToDB = require('../modules/tlg_to_DB')
const inputLineScene = require('./inputLine')
const { send_sms } = require('../modules/smser')

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
    await bot.sendMessage(chatId, "Введіть <i>номер телефону </i> в форматі 0671234567\n", { parse_mode: "HTML" })
    let userInput = await inputLineScene(bot, msg)
    let phoneNumber = userInput.replace(/[^0-9]/g, "")
    if (phoneNumber.length < 8 || phoneNumber.length > 12) {
      await bot.sendMessage(chatId, "Номер телефону введено некоректно, будь ласка, спробуйте ще раз\n")
      userInput = await inputLineScene(bot, msg)
      phoneNumber = userInput.replace(/[^0-9]/g, "")
    }
    if (phoneNumber.length < 8 || phoneNumber.length > 12) {
      await bot.sendMessage(chatId, "Номер телефону введено некоректно вдруге, оформлення заказу є неможливим\n")
      return null
    }
    await bot.sendMessage(chatId, "Введіть, будь ласка <i>своє ім'я та бажано прізвище</i>\n", { parse_mode: "HTML" })
    const name = await inputLineScene(bot, msg)
    let text = `name:${name}#phoneNumber:${phoneNumber}#masters:${masterName};#services:${cleanedService};#date:${datastr}#tg_chatId:${chatId}`
    const data = await sendReqToDB('__CreateOrder__', msg.chat, text)
    const parsedData = JSON.parse(data).ResponseArray
    if (parsedData.toString().includes('Created order №')) {
      const answer = 'Ваше замовлення підтвержено'
      text = `${answer}\n Очікуйте на смс щодо підтверження запису\n Майстер ${masterName} \n Послуга ${cleanedService} \n Дата/час ${datastr}`
      await send_sms(phoneNumber, text)
    }
    else {
      text = 'Під час формування замовлення щось пішло не так. Повторіть спробу запису ще раз'
    }
    await bot.sendMessage(chatId, text, { parse_mode: "HTML" })
  } catch (err) {
    console.log(err)
  }
}

module.exports = { createOrder }