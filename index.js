const DISCORD_NACL_PUBLIC_KEY =
  'c75489dd2eb63251723813c8c8c830c5b6b46ab8c84fccb3c094ce3c6390f937'
const nacl = require('tweetnacl')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'GET') {
    return Response.redirect('https://github.com/nwunderly/xkcd')
  }
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
    })
  }
  const body = await request.text()
  const securityResponse = await checkSecurityHeaders(request, body)
  if (securityResponse && securityResponse instanceof Response)
    return securityResponse
  return respondToInteraction(JSON.parse(body))
}

async function checkSecurityHeaders(request, body) {
  const signature = request.headers.get('X-Signature-Ed25519')
  const timestamp = request.headers.get('X-Signature-Timestamp')

  const verified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, 'hex'),
    Buffer.from(DISCORD_NACL_PUBLIC_KEY, 'hex'),
  )
  if (!verified)
    return new Response('Security header violation', {
      status: 403,
    })
}

function respond(content) {
  return new Response(
    JSON.stringify({
      type: 4,
      data: {
        content: content,
      }}), 
      { headers: { 'Content-Type': 'application/json' } }
  )
}

function respondEphemeral(content) {
  return new Response(
    JSON.stringify({
      type: 4,
      data: {
        content: content,
        flags: 1 << 6,
      }}), 
      { headers: { 'Content-Type': 'application/json' } }
  )
}

async function respondToInteraction(request) {
  if (request.type === 1) {
    return new Response(
    JSON.stringify({ type: 1 }), { headers: { 'Content-Type': 'application/json' } })
  } else if (request.type === 2) {
    return respondToCommand(request.data)
  } else {
    return respondEphemeral("Error: Unsupported interaction type.")
  }
}

const commands = {
  test: test,
  invite: invite,
  xkcd: xkcd,
}

async function respondToCommand(command) {
  if (command.name in commands) {
    return commands[command.name](command)
  } else {
    return respondEphemeral('Command not found: ' + command.name)
  }
}

async function test(command) {
  return respondEphemeral('Hello from Cloudflare workers!')
}

async function invite(command) {
  return respondEphemeral('[Invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=884864200374124624&scope=applications.commands)')
}

async function xkcd(command) {
  if ('options' in command) {
    comic = String(command.options[0].value) + '/'
  } else {
    comic = ''
  }
  return respond('https://xkcd.com/' + comic)
}
