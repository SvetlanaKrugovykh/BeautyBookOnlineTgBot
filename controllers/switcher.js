const { buttonsConfig } = require('../modules/keyboard')
const { getLocationIdByDescr } = require('../data/locations')
const { clientsAdmin, clientsAdminGetInfo, clientsAdminResponseToRequest } = require('./clientsAdmin')
const { schedullerScene, dataTimeeSelection } = require('./scheduler')
const supportScene = require('./support')
const { bookOnLineScene, bookMasterScene, bookServiceScene, bookAnyScene,
  masterOrServiceOrAnyScene } = require('./bookOnLine')
const { createOrder } = require('./orders')
const signUpForm = require('./signUp').signUpForm

const selectedByUser = {} // {chatId: {location_id: '1_1', Masters: ['Майстер 1'], Services: ['Послуга 1']}}

//#region staticKeyboad
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
  if (!selectedByUser[msg.chat.id]) selectedByUser[msg.chat.id] = {}
  console.log('The choise is:', data)
  switch (data) {
    case '0_1':
      selectedByUser[msg.chat.id] = {}
      await bookOnLineScene(bot, msg)
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
    case '1_30':
      await bookMasterScene(bot, msg, selectedByUser)
      break
    case '1_31':
      await bookServiceScene(bot, msg, selectedByUser)
      break
    case '1_32':
      await bookAnyScene(bot, msg, selectedByUser)
      break
    case '1_34':
      await schedullerScene(bot, msg)
      break
    case '1_37':
      await masterOrServiceOrAnyScene(bot, msg)
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
    default:
      console.log(`default: ${msg.text}`)
      switchDynamicSceenes(bot, msg)
      break
  }
}
//#endregion

//#region dynamicKeyboads
async function switchDynamicSceenes(bot, msg) {
  try {
    if (/[🏠⬆️↗️➡️↘️⬇️↙️⬅️↖️↩️↪️⤴️⤵️]/.test(msg.text)) {
      goBack(bot, msg)
      return
    }
    if (msg.text.includes('(')) {
      await chooseLocation(bot, msg)
      return
    }
    if (msg.text.includes('#')) {
      await chooseMaster(bot, msg)
      return
    }
    if (msg.text.includes('○')) {
      await chooseService(bot, msg)
      return
    }
    if (msg.text.includes(':')) {
      await createOrder(bot, msg, selectedByUser)
      return
    }
    if (msg.text.includes('🕒')) {
      await schedullerScene(bot, msg)
      return
    }
  } catch (error) { console.log(error) }
}

async function goBack(bot, msg) {
  try {
    if (msg.text.includes('🏠')) {
      await guestMenu(bot, msg, buttonsConfig["guestStartButtons"])
    } else if (msg.text.includes('↩️')) {
      await bookOnLineScene(bot, msg)
    } else if (msg.text.includes('↖️')) {
      await masterOrServiceOrAnyScene(bot, msg)
    }
  } catch (error) { console.log(error) }
}

async function chooseLocation(bot, msg) {
  try {
    console.log('Обрано локацію:', msg.text)
    const id = getLocationIdByDescr(msg.text)
    if (id !== null) {
      const location_id = `1_${id}`
      selectedByUser[msg.chat.id].location_id = location_id
      console.log(`Location ID is: 1_${id}`)
      await masterOrServiceOrAnyScene(bot, msg)
    }
  } catch (error) { console.log(error) }
}

async function chooseMaster(bot, msg) {
  try {
    console.log('Обрано майстра зі списку', msg.text)
    if (!selectedByUser[msg.chat.id]) selectedByUser[msg.chat.id] = {}
    if (!selectedByUser[msg.chat.id].Masters) selectedByUser[msg.chat.id].Masters = []
    selectedByUser[msg.chat.id].Masters.push(msg.text)
    await bot.sendMessage(msg.chat.id, `Обрано майстра ${msg.text}`)
    if (!selectedByUser[msg.chat.id].Services) {
      await bookServiceScene(bot, msg, selectedByUser)
    }
  } catch (error) { console.log(error) }
}

async function chooseService(bot, msg) {
  try {
    console.log('Обрано послугу зі списку', msg.text)
    if (!selectedByUser[msg.chat.id]) selectedByUser[msg.chat.id] = {}
    if (!selectedByUser[msg.chat.id].Services) selectedByUser[msg.chat.id].Services = []
    selectedByUser[msg.chat.id].Services.push(msg.text)
    if (!selectedByUser[msg.chat.id].Masters) {
      await bookMasterScene(bot, msg, selectedByUser)
    }
    bot.sendMessage(msg.chat.id, 'Найближчі вільний час для обраного фахівця:', { parse_mode: "HTML" })
    await dataTimeeSelection(bot, msg, selectedByUser)
  } catch (error) { console.log(error) }
}


//#endregion


//#region mainScrnes
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
//#endregion

module.exports = { handler, guestMenu, adminMenu }