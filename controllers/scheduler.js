const sendReqToDB = require('../modules/tlg_to_DB')
const { buttonsConfig } = require('../modules/keyboard')
const inputLineScene = require('./inputLine')
const { text } = require('body-parser')

async function schedullerScene(bot, msg) {
  try {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Найближчі вільні дати для обраного фахівця:', createAppointmentDateKeyboard())

  } catch (err) {
    console.log(err)
  }
}

async function dataTimeeSelection(bot, msg, selectedByUser) {
  try {
    //TODO dor many services
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

    const text = `master:${masterName}#service:${cleanedService}`
    const data = await sendReqToDB('__GetTimeSlots__', msg.chat, text)
    const parsedData = JSON.parse(data).ResponseArray

    //bot.sendMessage(chatId, 'Найближчі вільний час для обраного фахівця:', createAppointmentTimeKeyboard())
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


async function handleTimeSelection(bot, msg) {
  try {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Найближчі вільний час для обраного фахівця:', createAppointmentTimeKeyboard())

  } catch (err) {
    console.log(err)
  }
}

function createAppointmentDateKeyboard() {
  return {
    reply_markup: {
      //inline_keyboard: [
      keyboard: [
        [{ text: '2023-08-17', callback_data: '2023-08-17' }],
        [{ text: '2023-08-18', callback_data: '2023-08-18' }],
        [{ text: '2023-08-19', callback_data: '2023-08-19' }],
        [{ text: '↖️', callback_data: '1_37' }]// Add more available dates here...
      ],
    },
  }
}

// Helper function to create a keyboard with available appointment times
function createAppointmentTimeKeyboard() {
  return {
    reply_markup: {
      //inline_keyboard: [
      keyboard: [
        [{ text: '10:00 AM', callback_data: '10:00' }],
        [{ text: '11:00 AM', callback_data: '11:00' }],
        [{ text: '2:00 PM', callback_data: '14:00' }],
        [{ text: '↖️', callback_data: '1_37' }]// Add more available dates here...here...
      ],
    },
  }
}


async function dataTimeChoiceFromList(bot, msg, parsedData) {
  try {
    const buttonsPerRow = 4
    const dataTimeValues = parsedData.map((item, index) => {
      return {
        id: index,
        value: item
      }
    })

    const dataTimeChoiceButtons = {
      title: 'Оберіть інтервал зі списку:',
      options: [{ resize_keyboard: true }],
      buttons: []
    }

    let currentRow = []
    dataTimeValues.forEach((item) => {
      const callbackData = `71_${item.id + 1}`
      const button = { text: item.value, callback_data: callbackData }
      currentRow.push(button)

      if (currentRow.length === buttonsPerRow) {
        dataTimeChoiceButtons.buttons.push(currentRow)
        currentRow = []
      }
    })

    if (currentRow.length > 0) {
      dataTimeChoiceButtons.buttons.push(currentRow)
    }

    const returnButton = { text: '↖️', callback_data: '1_37' }
    const homeButton = { text: '🏠', callback_data: '0_1' }

    if (
      dataTimeChoiceButtons.buttons.length > 0 &&
      dataTimeChoiceButtons.buttons[dataTimeChoiceButtons.buttons.length - 1].length < buttonsPerRow
    ) {
      dataTimeChoiceButtons.buttons[dataTimeChoiceButtons.buttons.length - 1].push(homeButton)
      dataTimeChoiceButtons.buttons[dataTimeChoiceButtons.buttons.length - 1].push(returnButton)
    } else {
      dataTimeChoiceButtons.buttons.push([homeButton, returnButton])
    }

    return dataTimeChoiceButtons
  } catch (err) {
    console.log(err)
  }
}


module.exports = { schedullerScene, handleTimeSelection, dataTimeeSelection }
