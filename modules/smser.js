const axios = require(`axios`)

async function send_sms(phoneNumber, text) {
  const accountSid = process.env.SMS_AUTHORITY_NAME
  const authToken = process.env.SMS_AUTHORITY_KEY
  try {
    const response = await axios({
      method: 'post',
      url: URL,
      responseType: 'string',
      headers: {
        'Messaggio-Login': `${accountSid}`,
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        "recipients": [
          {
            "phone": phoneNumber
          }
        ],
        "channels": [
          "sms"
        ],
        "options": {
          "ttl": 60,
          "dlr_callback_url": "https://example.com/dlr",
          "external_id": "messaggio-acc-external-id-0"
        },
        "sms": {
          "from": accountSid,
          "content": [
            {
              "type": "text",
              "text": text
            }
          ]
        }
      }
    })
    if (!response.status == 200) {
      console.log(response.status)
      return null
    } else {
      return response.data
    }

  } catch (err) {
    console.log(err)
    return null
  }
}

module.exports = { send_sms }