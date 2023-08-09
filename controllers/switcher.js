const { buttonsConfig } = require('../modules/keyboard')
const { clientsAdmin, clientsAdminGetInfo, clientsAdminResponseToRequest } = require('./clientsAdmin')
const { schedullerScene } = require('./scheduler')
const supportScene = require('./support')
const { bookOnLineScene, bookMasterScene, bookServiceScene, masters, services } = require('./bookOnLine')
const signUpForm = require('./signUp').signUpForm
const regexIP = /^(\?|)\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(#|)$/
let selectedMaster = {}
let selectedService = {}

function getCallbackData(text) {
  for (const buttonSet of Object.values(buttonsConfig)) {
    for (const buttonRow of buttonSet.buttons) {
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
      await bookOnLineScene(bot, msg, false)
      break
    case '0_2':
      await supportScene(bot, msg, false)
      break
    case '0_3':
      await signUpForm(bot, msg, webAppUrl)
      break
    case '0_4':
      await guestMenu(bot, msg, buttonsConfig["guestStartButtons"])
      break
    case '1_1':
      await bookOnLineScene(bot, msg, data)
      break
    case '1_2':
      await bookOnLineScene(bot, msg, data)
      break
    case '1_3':
      await bookOnLineScene(bot, msg, data)
      break
    case '1_4':
      await guestMenu(bot, msg, buttonsConfig["guestStartButtons"])
      break
    case '1_31':
      await bookMasterScene(bot, msg)
      break
    case '1_32':
      await bookServiceScene(bot, msg)
      break
    case '1_33':
      await bookOnLineScene(bot, msg, false)
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
        if (masters[msg.chat.id].length !== 0) {
          schedullerScene(bot, msg, masters[msg.chat.id])
        }
      } catch (error) { console.log(error) }
      break
  }
}

async function guestMenu(bot, msg, guestStartButtons) {
  await bot.sendMessage(msg.chat.id, `Чат-бот <b>${process.env.BRAND_NAME}</b> вітає Вас, <b>${msg.chat.first_name} ${msg.chat.last_name}</b>!`, { parse_mode: "HTML" })
  await bot.sendMessage(msg.chat.id, buttonsConfig["guestStartButtons"].title, {
    reply_markup: {
      keyboard: buttonsConfig["guestStartButtons"].buttons,
      resize_keyboard: true
    }
  })
}

async function adminMenu(bot, msg, adminStartButtons) {
  await bot.sendMessage(msg.chat.id, `Вітаю та бажаю приємного спілкування!, ${msg.chat.first_name} ${msg.chat.last_name}!`)
  await bot.sendMessage(msg.chat.id, buttonsConfig["adminStartButtons"].title, {
    reply_markup: {
      keyboard: buttonsConfig["adminStartButtons"].buttons,
      resize_keyboard: true
    }
  })
}

module.exports = { handler, guestMenu, adminMenu }