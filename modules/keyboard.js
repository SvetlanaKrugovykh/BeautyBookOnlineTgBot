const guestStartButtons = {
  title: 'Оберіть, будь ласка, дію',
  options: [{ resize_keyboard: true }],
  buttons: [
    [{ text: 'Здійснити on-line запис.', callback_data: '0_1' }],
    [{ text: 'Надіслати повідомлення.', callback_data: '0_2' }],
    [{ text: 'Зареєструватися.', callback_data: '0_3' }]
  ]
}

const adminStartButtons = {
  title: 'Choose an action',
  options: [{ resize_keyboard: true }],
  buttons: [
    [{ text: 'Clients support.', callback_data: '2_1' }]
  ]
}

const clientAdminStarterButtons = {
  title: 'Choose a starter admin action',
  options: [{ resize_keyboard: true }],
  buttons: [
    [{ text: 'Отримати інформацію про клієнта.', callback_data: '3_1' }],
    [{ text: 'Надіслати відповідь на звернення.', callback_data: '3_2' }],
    [{ text: 'Return.', callback_data: '3_3' }]
  ]
}


function clientAdminChoiceClientFromList(bot, msg, parsedData) {
  try {
    const ClientsValues = parsedData.ResponseArray.map((item, index) => {
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
    const clientChoiceButtons = {
      title: 'Choose an client from list:',
      options: [{ resize_keyboard: true }],
      buttons: []
    }

    let currentRow = []
    ClientsValues.forEach((item) => {
      const callbackData = `11_${item.id + 1}`
      const button = { text: item.value, callback_data: callbackData }
      currentRow.push(button)

      if (currentRow.length === buttonsPerRow) {
        clientChoiceButtons.buttons.push(currentRow)
        currentRow = []
      }
    })

    if (currentRow.length > 0) {
      clientChoiceButtons.buttons.push(currentRow)
    }

    const returnButton = { text: 'Rеturn', callback_data: '11_99' }
    const homeButton = { text: 'Home', callback_data: '11_98' }

    if (
      clientChoiceButtons.buttons.length > 0 &&
      clientChoiceButtons.buttons[clientChoiceButtons.buttons.length - 1].length < buttonsPerRow
    ) {
      clientChoiceButtons.buttons[clientChoiceButtons.buttons.length - 1].push(homeButton)
      clientChoiceButtons.buttons[clientChoiceButtons.buttons.length - 1].push(returnButton)
    } else {
      clientChoiceButtons.buttons.push([homeButton])
      clientChoiceButtons.buttons.push([returnButton])
    }

    return clientChoiceButtons
  } catch (err) {
    console.log(err)
  }
}

const retunAdminButtons = {
  title: 'Choose a starter admin action',
  options: [{ resize_keyboard: true }],
  buttons: [
    [{ text: 'Rеturn', callback_data: '11_99' }],
    [{ text: 'Home', callback_data: '11_98' }]
  ]
}

const constants = [guestStartButtons, adminStartButtons, clientAdminStarterButtons, retunAdminButtons]

module.exports = { guestStartButtons, adminStartButtons, clientAdminStarterButtons, constants, clientAdminChoiceClientFromList }


