const sendReqToDB = require('../modules/tlg_to_DB')
const { buttonsConfig } = require('../modules/keyboard')
const inputLineScene = require('./inputLine')
const selectedMaster = {}
const selectedData = {}

async function schedullerScene(bot, msg, masters) {
  try {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Найближчі вільні дати для обраного фахівця:', createAppointmentDateKeyboard())
    bot.on('callback_query', (msg) => {
      handleDateSelection(bot, msg, masters)
    })

    for (const master of masters) {
      if (msg.text.includes(master.name)) {
        selectedMaster[msg.chat.id] = master
        console.log(selectedMaster[msg.chat.id])
      }
    }


  } catch (err) {
    console.log(err)
  }
}

async function handleDateSelection(bot, msg, masters) {
  const selectedDate = msg.data
  const chatId = msg.message.chat.id

  selectedData[chatId] = { date: selectedDate }
  console.log('Обрано дату', selectedDate)
  await bot.sendMessage(chatId, `Обрано дату ${selectedDate}`)

  bot.sendMessage(chatId, 'Виберіть годину:', createAppointmentTimeKeyboard())
  bot.on('callback_query', (msg) => {
    handleTimeSelection(bot, msg, masters)
  })
}


async function handleTimeSelection(bot, msg, masters) {
  const selectedTime = msg.data
  const chatId = msg.message.chat.id

  console.log('Обрано час', selectedTime)
  await bot.sendMessage(chatId, `Обрано час ${selectedTime}`)

  delete selectedData[chatId]
}

function createAppointmentDateKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '2023-08-11', callback_data: '2023-08-11' }],
        [{ text: '2023-08-12', callback_data: '2023-08-12' }],
        [{ text: '2023-08-13', callback_data: '2023-08-13' }],
        // Add more available dates here...
      ],
    },
  }
}

// Helper function to create a keyboard with available appointment times
function createAppointmentTimeKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '10:00 AM', callback_data: '10:00' }],
        [{ text: '11:00 AM', callback_data: '11:00' }],
        [{ text: '2:00 PM', callback_data: '14:00' }],
        // Add more available times here...
      ],
    },
  }
}

module.exports = { schedullerScene }