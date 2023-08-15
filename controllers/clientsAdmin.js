require('dotenv').config()
const sendReqToDB = require('../modules/tlg_to_DB')
const inputLineScene = require('./inputLine')
const { clientAdminStarterButtons, clientAdminChoiceClientFromList } = require('../modules/keyboard')

let telNumber = {}
let codeRule = {}
let _HOST = {}
let EPON = {}
let comment = {}

async function getInfo(bot, msg, inputLine) {
  const data = await sendReqToDB('__GetClientsInfo__', msg.chat, inputLine)
  if (data === null) {
    await bot.sendMessage(msg.chat.id, `⛔️Жодної інформації за запитом не знайдено`, { parse_mode: 'HTML' })
    return null
  }
  try {
    const parsedData = JSON.parse(data)
    if (parsedData.ResponseArray === null) {
      await bot.sendMessage(msg.chat.id, `⛔️Жодної інформації за запитом не знайдено`, { parse_mode: 'HTML' })
      return null
    }
    if (parsedData.ResponseArray.length > 1 && !inputLine.includes('#')) {
      await bot.sendMessage(msg.chat.id, `⛔️За запитом знайдено ${parsedData.ResponseArray.length} записів. Введіть більш точний запит`, { parse_mode: 'HTML' })
      const clientChoiceButtons = clientAdminChoiceClientFromList(bot, msg, parsedData)
      await bot.sendMessage(msg.chat.id, clientChoiceButtons.title, {
        reply_markup: {
          keyboard: clientChoiceButtons.buttons,
          resize_keyboard: true
        }
      })
      return null
    }
    console.log(data.toString())
    await bot.sendMessage(msg.chat.id, `🥎\n ${data.toString()}.\n`, { parse_mode: 'HTML' })
    return parsedData
  } catch (err) {
    console.log(err)
    return null
  }
}

async function actionsOnId(bot, msg, inputLine) {
  if (inputLine !== undefined) {
    if (inputLine.includes('id#')) {
      let id = inputLine.split('id#')[1]
      let msgtext = inputLine.split('id#')[2]
      console.log('id', id)
      console.log('msgtext', msgtext)
      try {
        await bot.sendMessage(id, `Дякуємо за звернення, відповідь: \n ${msgtext}`, { parse_mode: 'HTML' })
        await bot.sendMessage(msg.chat.id, `🥎🥎 id# request sent\n`, { parse_mode: 'HTML' })
      } catch (err) {
        console.log(err)
      }
    }
  }
}

async function clientsAdmin(bot, msg) {

  await clientAdminMenuStarter(bot, msg, clientAdminStarterButtons)

}

//#region clientAdminMenus
async function clientAdminMenuStarter(bot, msg, clientAdminStarterButtons) {
  await bot.sendMessage(msg.chat.id, clientAdminStarterButtons.title, {
    reply_markup: {
      keyboard: clientAdminStarterButtons.buttons,
      resize_keyboard: true
    }
  })

  console.log(((new Date()).toLocaleTimeString()))
}

//#endregion

//#region clientAdminSubMenus
async function clientsAdminGetInfo(bot, msg, condition = undefined) {
  let inputLine = ''
  if (msg.text === 'Отримати інформацію про клієнта.' || condition === 'return') {
    await bot.sendMessage(msg.chat.id,
      'Введіть <i>строку для пошуку інформаціі </i>', { parse_mode: 'HTML' })
    inputLine = await inputLineScene(bot, msg)
  } else {
    inputLine = msg.text
  }
  const responseData = await getInfo(bot, msg, inputLine)
  if (responseData === null) {
    return null
  }
  try {
    telNumber[msg.chat.id] = responseData.ResponseArray[0].telNumber

    if (responseData?.ResponseArray && Array.isArray(responseData?.ResponseArray)) {
      if (responseData?.ResponseArray[0]?.HOST) {
        await goToHardware(bot, msg, responseData)
      }
    } else {
      return null
    }

  } catch (err) {
    console.log(err)
  }

}

async function clientsAdminResponseToRequest(bot, msg) {
  await bot.sendMessage(msg.chat.id, 'Введіть <i>id чата для відправки відповіді клієнту </i>\n', { parse_mode: 'HTML' })
  const codeChat = await inputLineScene(bot, msg)
  if (codeChat.length < 7) {
    await bot.sendMessage(msg.chat.id, 'Wrong id. Операцію скасовано\n', { parse_mode: 'HTML' })
    return null
  }
  const commandHtmlText = 'Введіть <i>text відповіді клієнту </i>\n'
  await bot.sendMessage(msg.chat.id, commandHtmlText, { parse_mode: 'HTML' })
  const txtCommand = await inputLineScene(bot, msg)
  if (txtCommand.length < 7) {
    await bot.sendMessage(msg.chat.id, 'Незрозуміла відповідь. Операцію скасовано\n', { parse_mode: 'HTML' })
    return null
  }
  const txtCommandForSend = 'id#' + codeChat + 'id#' + txtCommand
  await actionsOnId(bot, msg, txtCommandForSend)
}


async function clientsAdminGetInvoice(bot, msg) {
  if (telNumber[msg.chat.id] === undefined) return null
  if (telNumber[msg.chat.id].length < 8) {
    await bot.sendMessage(msg.chat.id, 'Wrong telNumber. Операцію скасовано. Треба повторити пошук\n', { parse_mode: 'HTML' })
    return null
  }
  console.log(`Admin request for the receipt ${telNumber[msg.chat.id]}`)
  await invoice(bot, msg, telNumber)
  await bot.sendMessage(msg.chat.id, '👋💙💛 Have a nice day!\n', { parse_mode: 'HTML' })
}


//#endregion

module.exports = {
  clientsAdmin, clientsAdminGetInfo,
  clientsAdminResponseToRequest, clientsAdminGetInvoice,
}
