const sendReqToDB = require('../modules/tlg_to_DB')
const { buttonsConfig } = require('../modules/keyboard')
const inputLineScene = require('./inputLine')
let selectedMaster = {}

async function schedullerScene(bot, msg, masters) {
  try {
    const chatId = msg.chat.id

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

module.exports = { schedullerScene }