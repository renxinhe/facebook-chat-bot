# Usage
* [`color`](#color)
* [`emoji`](#emoji)
* [`help`](#help)
* [`meme`](#meme)
* [`pokemon`](#pokemon)
* [`stock`](#stock)
* [`weather`](#weather)

--------------------------------------------------
<a name="color"/>

## @color

This sets the color of a chat thread.

__Usage__

`@color <RGB Hex>`

__Arguments__

* `RGB Hex`: A six digit hexadecimal number representing the target color. Both upper and lower cases are supported.

__Example__

>`@color #0084FF`

*This will set the chat thread color to Facebook messenger blue.*

--------------------------------------------------
<a name="emoji"/>

## @emoji

This sets the emoji of a chat thread.

__Usage__

`@emoji <emoji | description>`

__Arguments__

* `emoji`: The emoji you want the chat's to be set to.
* `description`: A description of the emoji you want. The bot will use sp00ky NLP (not really) to determine the emoji to use.

__Example__

>`@emoji dog`

*This will set the chat emoji to the dog emoji.*

--------------------------------------------------
<a name="help"/>
## @help

This lists available commands and lists information about each one.

__Usage__

`@help`

`@help [command]`

__Arguments__

* `command` (optional): Name of one of available commands

__Examples__

>`@help`

>`@help weather`

--------------------------------------------------
<a name="meme"/>

## @meme

This sends the thread a [rickroll YouTube link](https://www.youtube.com/watch?v=dQw4w9WgXcQ).

[![Never Gonna Give You Up](http://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg)](http://www.youtube.com/watch?v=dQw4w9WgXcQ)

__Usage__

`@meme`

__Arguments__

None

__Example__

>`@meme`

>https://www.youtube.com/watch?v=dQw4w9WgXcQ


*Never gonna give you up, never gonna let you down. Never gonna run around and desert you. Never gonna make you cry, never gonna say goodbye. Never gonna tell a lie and hurt you…*

--------------------------------------------------
<a name="pokemon"/>

## @pokemon

This retrieves a list of Pokémon from Pokémon Go which are near the user's last dropped location pin. If a list of Pokémon id's are provided, it displays a map with the Pokémon drawn on it.

__Usage__

`@pokemon`
`@pokemon <id1, id2, ... id5>`

__Arguments__

* `id` (up to 5): The Pokémon id's to draw the location of.

__Example__

>`@pokemon`
```
Pokemon nearby:
#1 Bulbasaur:          1 found
#4 Charmander:         1 found
#13 Weedle:             2 found
#16 Pidgey:             3 found
#19 Rattata:            2 found
#21 Spearow:            1 found
#41 Zubat:              1 found
#48 Venonat:            4 found
#55 Golduck:            1 found
#60 Poliwag:            2 found
#69 Bellsprout:         1 found
#127 Pinsir:             1 found
#133 Eevee:              1 found
```
>`@pokemon 1 4 16 127 133`

> <img src="public/pokemon_example.png" width="400">

--------------------------------------------------
<a name="stock"/>

## @stock

This retrieves stock data for a given stock.

__Usage__

`@stock <symbol>`

__Arguments__

* `symbol`: Stock symbol. (Currently only supporting US stocks)

__Example__

>`@stock GOOGL`

>Alphabet Inc. (GOOGL) last traded at $757.52 on Mon Jul 25 2016 00:00:00 GMT-0700 (Pacific Daylight Time).
Volume: 1073278 | P/E Ratio: 30.82
Change: $-1.76 | % Change: -0.23%

--------------------------------------------------
<a name="weather"/>

## @weather

This posts weather information of a given location.

__Usage__

`@weather <zipcode | location name>`

__Arguments__

* `zipcode`: A five digit US zipcode.
* `location name`: A letter and space only location name, or city name and state separated by a comma and a space.

__Example__

>`@weather 94158`

>It is currently 63°F and Mostly Sunny in San Francisco, CA.\
It feels like 63°F outside. Relative humidity is 75%.\
Here's your 5-day forecast:\
2016-07-21 | Low: 53, High: 69. Precipitation: %\
2016-07-22 | Low: 56, High: 70. Precipitation: 0%\
2016-07-23 | Low: 55, High: 72. Precipitation: 0%\
2016-07-24 | Low: 57, High: 73. Precipitation: 0%\
2016-07-25 | Low: 56, High: 71. Precipitation: 40%

>`@weather New York, NY`

>It is currently 89°F and Mostly Sunny in New York, NY.\
It feels like 94°F outside. Relative humidity is 55%.\
Here's your 5-day forecast:\
2016-07-21 | Low: 74, High: 89. Precipitation: %\
2016-07-22 | Low: 82, High: 90. Precipitation: 10%\
2016-07-23 | Low: 79, High: 98. Precipitation: 10%\
2016-07-24 | Low: 82, High: 91. Precipitation: 0%\
2016-07-25 | Low: 82, High: 94. Precipitation: 60%

