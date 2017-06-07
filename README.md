# Jimbot
**A Facebook messenger utility bot.**

Jimbot runs on node.js platform. It uses [facebook-chat-api](https://github.com/Schmavery/facebook-chat-api) as the main component. The bot latches onto a Facebook account, and listens to all incoming messages for triggers. User can add the bot to any group chat, or simply message the bot to see its response.

*Disclaimer: This project is independent of Facebook, Inc and its affiliates. "Jimbot" is for non-commercial use only. All usages must obey Facebook's [policies](https://www.facebook.com/policies) and [terms of service](https://www.facebook.com/terms).*

-----------------------------------------------------------
## Install and run

Clone the repository, and use one of the following login methods.

### One time login
```bash
npm start
```

### Login via environment variables
If you want to login through saved environmental variables:
```bash
export LOGIN_METHOD="ENV_VAR"
export BOT_EMAIL="email@foobar.com"
export BOT_PASSWORD="facebook-password"
npm start
```

### Login via saved app state (session cookies)

This method is recommended since the bot will not be hitting Facebook's login endpoint as frequently. Instead, it will use saved session cookies much like those in your browser cache. If you are running a bot on dynamic IP servers (e.g. Heroku), you should use this login method to prevent your account from being locked by Facebook.

If you want to store your login session a file for up to three months:
```bash
npm install
node saveAppState.js
export LOGIN_METHOD="APP_STATE"
export APP_STATE=$(cat appstate.json)
npm start
```
*WARNING: The generated file `appstate.json` contains your login session cookie. Do NOT share it with anyone.
This login method stores this session cookie in the environment variable APP_STATE, which is only visible to you.*

## Dependencies
[node.js](https://nodejs.org/en/) is a required Dependenciescy.

-----------------------------------------------------------
## Usage:
* [`@cat`](DOCS.md#cat)
* [`@channel`](DOCS.md#channel)
* [`@color`](DOCS.md#color)
* [`@emoji`](DOCS.md#emoji)
* [`@help`](DOCS.md#help)
* [`@league`](DOCS.md#league)
* [`@meme`](DOCS.md#meme)
* [~~`@pokemon`~~](DOCS.md#pokemon)
* [`@stock`](DOCS.md#stock)
* [`@weather`](DOCS.md#weather)

-----------------------------------------------------------
## Versions
- 0.1.0: Initial framework.
- 0.1.1: Added rickroll functionality.
- 0.1.2: Added set thread color functionality.
- 0.1.3: Added weather functionality.
- 0.2.0: Migrated to Heroku worker dyno from local.
- 0.2.1: Modularized handler functions.
- 0.2.2: Added help command.
- 0.2.3: Added stock functionality.
- 0.2.4: Added pokemon functionality.
- 0.2.5: Added set emoji functionality.
- 0.2.6: Added cat picture functionality.
- 0.2.7: Added League of Legends match data functionality.
- 0.3.0: Added login via app state.
- 0.3.1: Added tag channel.
