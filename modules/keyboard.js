const { locations } = require('../data/locations')

const buttonsConfig = {
  guestStartButtons: {
    title: 'Оберіть, будь ласка, дію',
    options: [{ resize_keyboard: true }],
    buttons: [
      [{ text: 'Здійснити on-line запис', callback_data: '0_1' }],
      [{ text: 'Надіслати повідомлення', callback_data: '0_2' }],
      [{ text: 'Зареєструватися', callback_data: '0_3' }],
      [{ text: '🏠', callback_data: '0_4' }]
    ]
  },

  locationsButtons: {
    title: 'Оберіть будь ласка локацію',
    options: [{ resize_keyboard: true }],
    buttons: locations.map(location => [
      { text: `${location.descr} (${location.address})`, callback_data: `1_${location.id}` }
    ])
  },

  servicesSet: {
    title: 'Оберіть будь ласка набір послуг',
    options: {},
    buttons: [
      [
        { text: 'Догляд за волоссям', callback_data: '77_1' },
        { text: 'Манікюр', callback_data: '77_2' },
      ],
      [
        { text: 'Педікюр', callback_data: '77_3' },
        { text: 'Догляд за обличчям', callback_data: '77_4' },
      ]
    ]
  },

  masterOrServiceButtons: {
    title: 'Оберіть будь ласка майстра або послугу',
    options: { resize_keyboard: true },
    buttons: [
      [{ text: 'Обрати майстра', callback_data: '1_30' }, { text: 'Обрати послугу', callback_data: '1_31' }],
      [{ text: '🕒 Обрати час', callback_data: '1_34' }, { text: 'Будь - який вільний фахівець', callback_data: '1_32' }],
      [{ text: '↩️', callback_data: '0_1' }]
    ]
  },

  anyChoiceButtons: {
    title: 'Будь-який вільний фахівець',
    options: { resize_keyboard: true },
    buttons: [
      [{ text: '🕒 Обрати час', callback_data: '1_34' }],
      [{ text: 'Обрати послугу', callback_data: '1_31' }],
      [{ text: '↖️', callback_data: '1_37' }]
    ]
  },

  adminStartButtons: {
    title: 'Choose an action',
    options: [{ resize_keyboard: true }],
    buttons: [
      [{ text: 'Clients support', callback_data: '2_1' }]
    ]
  },

  clientAdminStarterButtons: {
    title: 'Choose a starter admin action',
    options: [{ resize_keyboard: true }],
    buttons: [
      [{ text: 'Отримати інформацію про клієнта', callback_data: '3_1' }],
      [{ text: 'Надіслати відповідь на звернення', callback_data: '3_2' }],
      [{ text: '🏠', callback_data: '3_3' }]
    ]
  }
}

module.exports = { buttonsConfig }


