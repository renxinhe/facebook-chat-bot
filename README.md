# Jimbot
**A Facebook messenger utility bot.**

Jimbot runs on node.js platform. It uses [facebook-chat-api](https://github.com/Schmavery/facebook-chat-api) as the main component. The bot latches onto a Facebook account, and listens to all incoming messages for triggers. User can add the bot  to any group chat, or simply message the bot to see its response.

-----------------------------------------------------------
## Install and run
```bash
npm start
```

If you want to login through saved environmental variables:
```bash
export USE_CLI="false"
export BOT_EMAIL="email@foobar.com"
export BOT_PASSWORD="facebook-password"
npm start
```

[node.js](https://nodejs.org/en/) is a required dependency.

-----------------------------------------------------------
## Usage:
* [`@cat`](DOCS.md#cat)
* [`@color`](DOCS.md#color)
* [`@emoji`](DOCS.md#emoji)
* [`@help`](DOCS.md#help)
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
