# Usage
* [`color`](#color)
* [`help`](#help)
* [`meme`](#meme)
* [`stock`](#stock)
* [`weather`](#weather)

--------------------------------------------------
<a name="color"/>

## @color

This trigger can set the color of a chat thread.

__Usage__

`@color <RGB Hex>`

__Arguments__

* `RGB Hex`: A six digit hexadecimal number representing the target color. Both upper and lower cases are supported.

__Example__

>`@color #0084FF`

*This will set the chat thread color to Facebook messenger blue.*

--------------------------------------------------
<a name="help"/>
## @help

This lists available commands and lists information about each one.

__Usage__

`@help`

`@help [command]`

__Arguements__

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
<a name="stock"/>

## @stock

This retrieves stock data for a given stock.

__Usage__

`@stock <symbol>`

__Arguments__

* 'symbol': Stock symbol. (Currently only supporting US stocks)

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

>59°F  
San Francisco, CA  
Mostly Sunny :cloud:  
Feels like 59°. Humidity 90%.  
07-30 | 54°/68°  
07-31 | 56°/69°  :umbrella: 0%  
08-01 | 56°/71°  :umbrella: 10%  
08-02 | 54°/69°  :umbrella: 0%  
08-03 | 54°/69°  :umbrella: 0%  

>`@weather New York, NY`

>73°F  
New York, NY  
Partly Cloudy :cloud:  
Feels like 73°. Humidity 94%.  
07-30 | 72°/80°  
07-31 | 74°/78°  :umbrella: 80%  
08-01 | 72°/79°  :umbrella: 80%  
08-02 | 71°/76°  :umbrella: 80%  
08-03 | 72°/78°  :umbrella: 60%

