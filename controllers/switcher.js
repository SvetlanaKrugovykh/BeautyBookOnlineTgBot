const { constants, adminStartButtons } = require('../modules/keyboard')
const { clientsAdmin, clientsAdminGetInfo, clientsAdminResponseToRequest } = require('./clientsAdmin')
const supportScene = require('./support')
const receiptScene = require('./receipt')
const signUpForm = require('./signUp').signUpForm
const regexIP = /^(\?|)\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(#|)$/

function getCallbackData(text) {
  for (const constant of Object.values(constants)) {
    const buttons = constant.buttons
    for (const buttonRow of buttons) {
      for (const button of buttonRow) {
        if (button.text === text) {
          return button.callback_data
        }
      }
    }
  }
  return null
}


async function handler(bot, msg, webAppUrl) {
  const data = getCallbackData(msg.text)
  console.log('The choise is:', data)
  switch (data) {
    case '0_1':
      await receiptScene(bot, msg, false)
      break
    case '0_2':
      await supportScene(bot, msg, false)
      break
    case '0_3':
      await signUpForm(bot, msg, webAppUrl)
      break
    case '1_1':
      await receiptScene(bot, msg, true)
      break
    case '1_2':
      await supportScene(bot, msg, true)
      break
    case '2_1':
      await clientsAdmin(bot, msg)
      break
    case '3_1':
      await clientsAdminGetInfo(bot, msg)
      break
    case '3_2':
      await clientsAdminResponseToRequest(bot, msg)
      break
    case '3_3':
      await adminMenu(bot, msg, adminStartButtons)
      break
    case '3_17':
      await clientsAdmin(bot, msg)
      break
    case '11_98':
      await clientsAdmin(bot, msg)
      break
    case '11_99':
      await clientsAdminGetInfo(bot, msg, 'return')
      break
    default:
      console.log(`default: ${msg.text}`)
      try {
        if (msg.text.length > 3 && msg.text.includes('#H') && !regexIP.test(msg.text)) {
          clientsAdminGetInfo(bot, msg, msg.text)
        }
      } catch (error) { console.log(error) }
      break
  }
}

async function guestMenu(bot, msg, guestStartButtons) {
  await bot.sendMessage(msg.chat.id, `Чат-бот <b>${process.env.BRAND_NAME}</b> вітає Вас, <b>${msg.chat.first_name} ${msg.chat.last_name}</b>!`, { parse_mode: "HTML" })
  await bot.sendMessage(msg.chat.id, guestStartButtons.title, {
    reply_markup: {
      keyboard: guestStartButtons.buttons,
      resize_keyboard: true
    }
  })
}

async function adminMenu(bot, msg, adminStartButtons) {
  await bot.sendMessage(msg.chat.id, `Вітаю та бажаю приємного спілкування!, ${msg.chat.first_name} ${msg.chat.last_name}!`)
  await bot.sendMessage(msg.chat.id, adminStartButtons.title, {
    reply_markup: {
      keyboard: adminStartButtons.buttons,
      resize_keyboard: true
    }
  })
}

module.exports = { handler, guestMenu, adminMenu }