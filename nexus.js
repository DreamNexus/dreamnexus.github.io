const servers = {

  'zKcTwtwACX': { type: ['General'], notes: 'The Official Chapel of the Monochrome Sisters.' }, // hujle's mental asylum, monoe
  'JzuTbJe': { type: ['General'], notes: '', warn: 1 }, // Uboachan
  'Rv5P4KR': { type: ['General'], notes: '', warn: 1 }, // Yume Nikki Fan Discord (cool logo)
  'AE6NVrj': { type: ['General'], notes: '' }, // Yume Nikki (two rainbows server)
  'fnHxPhe': { type: ['General'], notes: '' }, // Yume Nikki (yuki ona)
  '6BVNayu': { type: ['General'], notes: "Server is closed and doesn't accept new members." }, // Yumes Nikkis
  'xU2XjjU': { type: ['General'], notes: '' }, // Yume Nikki & Fangames (spidor)
  'dt45FnQ': { type: ['General'], notes: '' }, // Yume Nikki & Fangames (ChaosX)
//  'JwGUfQnMms': { type: ['General'], notes: '' }, // images with yume nikki bgm dickock
  'S53w7ed': { type: ['General'], notes: 'YNFG walkthrough youtuber Nex' }, // nex
  'JJyMM7G6ZE': { type: ['General'], notes: '' }, // yume nikki dreamcatchers
  'PmguJkzrBC': { type: ['General'], notes: '' }, // yume nikki fanclub
  'btv7VuW': { type: ['General'], notes: '', warn: 1 }, // Madosnug Server (OFFICIAL LINK)
  'XyjdVK3j4w': { type: ['General'], notes: 'A server dedicated to Yume Nikki and fangames roleplay.' }, // rp
  'rc4fwtf': { type: ['General'], notes: "The Cashmere Hall's old server." }, // rp old
  'FZApWzM': { type: ['General'], notes: 'A server dedicated to Dreamstuck webcomic.' }, // dreamstuck
  '9sSxYzn': { type: ['General'], notes: '' }, // Church of Sabitsuki
  'xJNyW6P': { type: ['General'], notes: '' }, // the balcony
  'fKt7agz': { type: ['General'], notes: '' }, // mados porch
  'JsEBQbFd2c': { type: ['General'], notes: '' }, // yume nikki DISCORD
  '8swBfEw': { type: ['General'], notes: 'The official Yume 2kki server.', warn: 1 }, // Yume 2kki
  '9kYqWvgQru': { type: ['General'], notes: '' }, // roadside bar, branch of 2kki server
  'DnvuqFb': { type: ['General'], notes: 'Czech/Slovak Yume Nikki Community.' }, // Yume Nikki CZ/SK
  'rEAPW3b': { type: ['General'], notes: 'Spanish-speaking Yume Nikki Community.' }, // gatobot and co.
  'aQPeUSB': { type: ['Dev'], notes: 'Dream Diary Development chat, the ' + 'chat for making Yume Nikki fangames, ' +'general games, and hanging out!' }, // Dream Diary Development
  'DyWQQxN': { type: ['Dev'], notes: 'A server dedicated to the annual Dream Diary Jam.' }, // Dream Diary Jam 3
  'vzXT9ds': { type: ['Dev'], notes: 'A server dedicated to the annual Dream Diary Jam.' }, // Dream Diary Jam 4
  'KjtGdWY': { type: ['General'], notes: 'A server dedicated to Yume Nikki Speedrunning.' }, // Speedrunning in the 90s
  'mEr3qY6': { type: ['Dev'], notes: 'This server is for active members of ' + 'the team. If people are interested in ' + "helping you're more than welcome to join." }, // Patchy Illusion Team
  'U72hAJC': { type: ['NSFW'], notes: '', warn: 1 }, // Uboachan offshoot
  'AQMVFDh': { type: ['LSD: Dream Emulator'], notes: '' }, // DreamEmulator
  'sDfZX5f': { type: ['LSD: Dream Emulator'], notes: '' }, // Emulated Dreams
  '3SBFGGJ': { type: ['LSD: Dream Emulator'], notes: '' } // LSD: Dream Emulator Community
  // 'tGCZtRj': { type: ['General'], notes: '', warn: 1 }, // masada spaceship (no longer yume nikki server)
  // 'BeyT45e': { type: ['NSFW'], notes: 'May have NSFW content.', warn: 1 }, //Foodies server Yume Kinki (OFFICIAL LINK). No, just no.
  // 'Hvty69K': { type: ['General'], notes: 'YNFG youtuber FukoSan' }, // taken down by request 
}

const categories = { General: [], Dev: [], NSFW: [] }

let serversLoaded = 0

// loadServer(id)
// Takes in an server invite code, and sends a request for information.
// e.g loadServer( "JzuTbJe" )

if (Number(localStorage.expiry) !== Math.floor(Date.now() / 1000000)) {
  localStorage.clear()
  localStorage.expiry = Math.floor(Date.now() / 1000000)
}

function loadServer (id) {
  const req = new XMLHttpRequest()
  const cache = localStorage[id]
  if (cache) {
    saveServer(cache)
    return
  }

  req.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      localStorage[id] = this.responseText
      saveServer(this.responseText)
    } else if (this.readyState === 4 && this.status !== 200) {
      const error = JSON.parse(this.responseText)
      if (error.code === 10006) { // Unknown Invite
        delete servers[id]
        console.log(
          'Invite: ' + id + ', is incorrect or expired!\n' +
      'Please update or remove this invite!\n\n'
        )
      } else if (error.retry_after) { // Rate limited
        setTimeout(
          loadServer,
          JSON.parse(this.responseText).retry_after,
          id
        )
        document.getElementById('loadtxt').textContent = 'Please wait...'
      }
    }
  }
  req.open('GET',
    // "https://jsonp.afeld.me/?url="+
    'https://discord.com/api/v6/invites/' + id + '?with_counts=true', true
  )
  req.send(null)
}

// addElement(parent, nodeName, attributes)
// This creates a HTML element and appends it to parent element
// e.g(1) let link = addElement( document.body, "A", {href: "https://google.com"})
// The line above will create <a href="https://google.com"> in the document.body
// e.g(2) addElement( link, "TEXT", "Google!")
// This will add into the element, <a href="https://google.com">Google!</a>

function addElement (parent, type, attributes) {
  let node = type === 'TEXT'
    ? document.createTextNode('')
    : document.createElement(type)

  node = Object.assign(node, attributes)
  parent.appendChild(node)
  return node
}

// compare(a, b)
// This compares which server is more online or not.
// This is a helper function for .sort()

function compare (a, b) { return a.active < b.active }

// saveServer(json)
// This takes in the API response and formats it.
// The result is then pushed into it's respective category
// This function checks whether loading is complete.

function saveServer (json) {
  const api = JSON.parse(json)
  const info = {
    invite: api.code,
    name: api.guild.name,
    icon: 'https://cdn.discordapp.com/icons/' + api.guild.id +
   '/' + api.guild.icon + '.png?size=128',
    count: api.approximate_member_count,
    active: api.approximate_presence_count,
    notes: servers[api.code].notes,
    type: servers[api.code].type,
    warn: servers[api.code].warn
  }

  if (!categories[info.type[0]]) { categories[info.type[0]] = [] }

  categories[info.type[0]].push(info)

  document.getElementById('loadtxt').textContent = 'Loading ' +
  Math.round(serversLoaded / Object.keys(servers).length * 100) + '%'

  if (++serversLoaded !== Object.keys(servers).length) return

  document.querySelector('#loading').style.display = 'none'
  for (const i in categories) {
    categories[i].sort(compare)
    for (const j in categories[i]) {
      displayServer(categories[i][j])
    }
  }
}

// displayServer(info)
// This function is called by saveServer once loading is complete
// This function will display the box with server information

function displayServer (info) {
  const server = addElement(document.body, 'DIV', { className: 'server' })
  addElement(server, 'IMG', { src: info.icon, width: 96, className: 'icon' })
  addElement(server, 'BR', {})
  addElement(server, 'B', { textContent: info.name, className: 'name' })

  const sub = addElement(server, 'DIV', { className: 'info' })
  addElement(sub, 'DIV', { className: 'circle on' })
  addElement(sub, 'TEXT', { textContent: ' ' + info.active + ' Online' })
  addElement(sub, 'DIV', { className: 'circle' })
  addElement(sub, 'DIV', { className: 'circle off' })
  addElement(sub, 'TEXT', { textContent: ' ' + info.count + ' Members' })
  addElement(sub, 'P', {})

  const invite = addElement(sub, 'a', { href: 'https://discord.gg/' + info.invite })
  addElement(invite, 'DIV', { className: 'join', textContent: 'Join' })
  
  const notes = addElement(sub, 'DIV', { className: 'notes' })
    addElement(notes, 'B', { textContent: 'Category: ' })
    addElement(notes, 'TEXT', { textContent: info.type.join(', ') })
    addElement(notes, 'BR', {})
  
  if (info.notes) {
    const note = addElement(notes, 'B', {
      textContent: 'Notes: '
    })
    const text = addElement(notes, 'FONT', { textContent: info.notes })
    addElement(notes, 'BR', {})
  }
  if (info.warn) {
    const warn = addElement(notes, 'B', {
      textContent: 'Warning: '
    }) 
    const text = addElement(warn, 'FONT', { textContent: 'May have NSFW content.' })
    warn.style.color = text.style.color = '#f44336'
    addElement(warn, 'BR', {})
  }

  document.querySelector('#list').appendChild(server)
}

window.onload = function () {
  let i = 0
  for (let id in servers) {
    setTimeout(
      loadServer,
      i++ * Math.random() * 100,
      id
    )
  }
}
