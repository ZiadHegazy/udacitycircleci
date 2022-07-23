const clone = require('clone')
const config = require('./config')

const db = {}

const defaultData = {
  contacts: [
    {
      id:"1",
      name: 'Michael Jackson',
      email: 'michael@reacttraining.com',
      avatarURL: 'public/michael.jpg'
    },{
    id:"2", 
      name: 'Ryan Florence',
      email: 'ryan@reacttraining.com',
      avatarURL: 'public/ryan.jpg'
    },
    {
      id:"3",
      name: 'Tyler McGinnis',
      email: 'tyler@reacttraining.com',
      avatarURL: 'public/tyler.jpg'
    }
  ]
}

const get = (token) => {
  let data = db[token]

  if (data == null) {
    data = db[token] = clone(defaultData)
  }

  return data
}

const add = (token, contact) => {
  if (!contact.id) {
    contact.id = Math.random().toString(36).substr(-8)
  }

  get(token).contacts.push(contact)

  return contact
}

const remove = (token, id) => {
  const data = get(token)
  const contact = data.contacts.find(c => c.id === id)

  if (contact) {
    data.contacts = data.contacts.filter(c => c !== contact)
  }

  return { contact }
}

module.exports = {
  get,
  add,
  remove,
  defaultData
}
