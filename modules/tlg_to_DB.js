const axios = require(`axios`)
const URL = process.env.URL
const AUTH_TOKEN = process.env.AUTH_TOKEN

async function sendReqToDB(reqType, data, text) {

  let dataString = objToString(reqType, data, text)
  console.log(dataString)

  try {
    const response = await axios({
      method: 'post',
      url: URL,
      responseType: 'string',
      headers: {
        Authorization: `${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        Query: `Execute;${reqType};${dataString};END`,
      }
    })
    if (!response.status == 200) {
      console.log(response.status)
      return null
    } else {
      if (reqType === '__GetMasters__' || reqType === '__GetServicess__') {
        return response.data
      } else {
        let answer = response.data.toString()
        console.log(answer.slice(0, 125) + '...')
        return answer
      }
    }

  } catch (err) {
    console.log(err)
    return null
  }
}

function objToString(reqType, data, text) {

  switch (reqType) {
    case '__GetMasters__':
      return (text)
    case '__GetServices__':
      return (text)
    case '__GetTimeSlots__':
      return (text)
    case '__CreateOrder__':
      return (text)
    case '___UserRegistration__':
      return (text + '#' + data?.email + '#' + data?.phoneNumber + '#' + data?.password + '#' + data?.PIB + '#' + data?.contract + '#' + data?.address + '#' + text)
    default:
      return (data.id + '#' + text)
  }
}

module.exports = sendReqToDB