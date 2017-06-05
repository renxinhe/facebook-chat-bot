# Usage
* [`cat`](#cat)
* [`color`](#color)
* [`emoji`](#emoji)
* [`help`](#help)
* [`league`](#league)
* [`meme`](#meme)
* [~~`pokemon`~~](#pokemon)
* [`stock`](#stock)
* [`weather`](#weather)

--------------------------------------------------
<a name="cat"/>

## @cat

This sends a cat picture to the message thread.

<img src=http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg width="500">

__Usage__

`@cat`

`@cat ["gif"]`

__Arguments__

* `gif`: Sends an animated gif instead of a static png.

__Example__

>`@cat`

*This will send a cat picture.*

>`@cat gif`

*This will send an animated cat picture.*

--------------------------------------------------
<a name="channel"/>

## @channel

This mentions everyone in a group chat in a text message.

__Usage__

`@channel`

__Arguments__

* None

__Example__

>`@channel`

*This will mention everyone in a text message.*

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

<a name="league"/>
## @league

_Welcome to Summoner's Rift!_

This retrieves League of Legends summoner and current match info.

__Usage__

`@league`

`@league [summoner-name]`

`@league [-setName summoner-name]`

__Arguments__

* `summoner-name`: League of Legends summoner name


__Options__

* `-setName`: Stores `summoner-name` as the default summoner. Bare command `@league` will retrieve stats for the default summoner.

__Examples__

>`@league Alice`

>
```
Alice
Bronze 1 28LP
9W 11L Win Ratio 45%
Sona - 5W 5L Win Ratio 50%
Nami - 4W 0L Win Ratio 100%
Ashe - 0W 1L Win Ratio 0%
Tahm Kench - 0W 1L Win Ratio 0%
Vel'Koz - 0W 1L Win Ratio 0%
----------------
Current Match:
==Team 1==
Alice - Elise - Bronze I (28 LP)
Bob - Lux - Silver V (15 LP)
Charlie - Kennen - Unranked (0 LP)
Dave - Blitzcrank - Unranked (0 LP)
Eve - Xin Zhao - Unranked (0 LP)
==Team 2==
Frank - Kog'Maw - Unranked (0 LP)
Grace - Gangplank - Silver III (0 LP)
Mallory - Garen - Unranked (0 LP)
Oscar - Sejuani - Silver II (94 LP)
Sybil - Mordekaiser - Silver V (57 LP)
```

>`@league -setName Bob`

>`Summoner name for user ID "***************" updated!`

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

## ~~@pokemon~~

_Deprecated on August 1st, 2016. A change in Niantic backend structure has disabled Pokevision._

~~This retrieves a list of Pokémon from Pokémon Go which are near the user's last dropped location pin. If a list of Pokémon id's are provided, it displays a map with the Pokémon drawn on it.~~

~~__Usage__~~

~~`@pokemon`~~

~~`@pokemon <id1, id2, ... id5>`~~

~~__Arguments__~~

* ~~`id` (up to 5): The Pokémon id's to draw the location of.~~

~~__Example__~~

>~~`@pokemon`~~
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
>~~`@pokemon 1 4 16 127 133`~~

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

>
```
Alphabet Inc. (GOOGL) last traded at $757.52 on Mon Jul 25 2016 00:00:00 GMT-0700 (Pacific Daylight Time).
Volume: 1073278 | P/E Ratio: 30.82
Change: $-1.76 | % Change: -0.23%
```

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

>
```
59°F  
San Francisco, CA  
Mostly Sunny :cloud:  
Feels like 59°. Humidity 90%.  
07-30 | 54°/68°  
07-31 | 56°/69°  :umbrella: 0%  
08-01 | 56°/71°  :umbrella: 10%  
08-02 | 54°/69°  :umbrella: 0%  
08-03 | 54°/69°  :umbrella: 0%
```

>`@weather New York, NY`

>
```
73°F  
New York, NY  
Partly Cloudy :cloud:  
Feels like 73°. Humidity 94%.  
07-30 | 72°/80°  
07-31 | 74°/78°  :umbrella: 80%  
08-01 | 72°/79°  :umbrella: 80%  
08-02 | 71°/76°  :umbrella: 80%  
08-03 | 72°/78°  :umbrella: 60%
```
