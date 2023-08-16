const { buttonsConfig } = require('../modules/keyboard')
const { clientsAdmin, clientsAdminGetInfo, clientsAdminResponseToRequest } = require('./clientsAdmin')
const { schedullerScene, handleTimeSelection } = require('./scheduler')
const supportScene = require('./support')
const { bookOnLineScene, bookMasterScene, bookServiceScene, bookAnyScene, bookingScene, selectedLocationId } = require('./bookOnLine')
const signUpForm = require('./signUp').signUpForm
const selectedMaster = {}
const selectedService = {}

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
    case '1_30':
      await bookMasterScene(bot, msg)
      break
    case '1_31':
      await bookServiceScene(bot, msg)
      break
    case '1_32':
      await bookAnyScene(bot, msg)
      break
    case '1_33':
      await bookOnLineScene(bot, msg, false)
      break
    case '1_40':
      await schedullerScene(bot, msg)
      break
    case '1_41':
      await bookServiceScene(bot, msg)
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
        if (msg.text.includes('🏠')) {
          await guestMenu(bot, msg, buttonsConfig["guestStartButtons"])
          break
        } else if (msg.text.includes('↩')) {
          await bookOnLineScene(bot, msg, false)
          break
        }
        if (msg.text.includes('#')) {
          console.log('Обрано майстра зі списку', msg.text)
          selectedMaster[msg.chat.id] = msg.text
          await bot.sendMessage(msg.chat.id, `Обрано майстра ${msg.text}`)
          if (!selectedService[msg.chat.id]) {
            await bookServiceScene(bot, msg)
          }
        } else if (msg.text.includes('🧘🏼')) {
          console.log('Обрано послугу зі списку', msg.text)
          selectedService[msg.chat.id] = msg.text
          if (!selectedMaster[msg.chat.id]) {
            await bookMasterScene(bot, msg)
          }
        } else if (msg.text.includes('-')) {
          handleTimeSelection(bot, msg)
        } else if (msg.text.includes(':')) {
          bookingScene(bot, msg)
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