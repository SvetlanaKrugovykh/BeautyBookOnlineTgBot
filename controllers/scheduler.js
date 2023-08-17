const sendReqToDB = require('../modules/tlg_to_DB')
const { buttonsConfig } = require('../modules/keyboard')
const inputLineScene = require('./inputLine')

async function schedullerScene(bot, msg) {
  try {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Найближчі вільні дати для обраного фахівця:', createAppointmentDateKeyboard())

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

function dataTimeChoiceFromList(bot, msg, parsedData) {
  try {
    const dataTimesValues = parsedData.ResponseArray.map((item, index) => {
      let value = item['Контрагент']
      if (item['АдресДом']) {
        value += '#H' + item['АдресДом']
        if (item['АдресКвартира']) {
          value += '#A' + item['АдресКвартира']
        }
      }
      return {
        id: index,
        value: value,
      }
    })

    const buttonsPerRow = 2
    const dataTimeChoiceButtons = {
      title: 'Оберіть інтервал зі списку:',
      options: [{ resize_keyboard: true }],
      buttons: []
    }

    let currentRow = []
    dataTimesValues.forEach((item) => {
      const callbackData = `11_${item.id + 1}`
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
    const homeButton = { text: '🏠', callback_data: '1_33' }

    if (
      dataTimeChoiceButtons.buttons.length > 0 &&
      dataTimeChoiceButtons.buttons[dataTimeChoiceButtons.buttons.length - 1].length < buttonsPerRow
    ) {
      dataTimeChoiceButtons.buttons[dataTimeChoiceButtons.buttons.length - 1].push(homeButton)
      dataTimeChoiceButtons.buttons[dataTimeChoiceButtons.buttons.length - 1].push(returnButton)
    } else {
      dataTimeChoiceButtons.buttons.push([homeButton])
      dataTimeChoiceButtons.buttons.push([returnButton])
    }

    return dataTimeChoiceButtons
  } catch (err) {
    console.log(err)
  }
}

module.exports = { schedullerScene, handleTimeSelection }