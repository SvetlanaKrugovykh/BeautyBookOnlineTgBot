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
        [{ text: '2023-08-11', callback_data: '2023-08-16' }],
        [{ text: '2023-08-12', callback_data: '2023-08-17' }],
        [{ text: '2023-08-13', callback_data: '2023-08-18' }],
        // Add more available dates here...
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
        // Add more available times here...
      ],
    },
  }
}

module.exports = { schedullerScene, handleTimeSelection }