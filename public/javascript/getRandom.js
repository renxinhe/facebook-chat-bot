/**
 * @file getRandom.js
 * Handler for getting random [thing]
 *
 */
 
module.exports = function getWeather(api, threadID, body) {
        function sleep(milliseconds) {                  
                var start = new Date().getTime();
                for (var i = 0; i < 1e7; i++) {
                        if ((new Date().getTime() - start) > milliseconds){
                                break;
                        }
                }
        }
        
        var thing = body.substring('@random '.length);
        var ideas = ['Go to the nearest teahouse and get a drink!', 'Watch The Conjuring!', 'Write a book!', 'Make a useful and consistent universe in which you can prove the Continuum Hypothesis!', 'Prove P vs NP. You will get a million bucks.', 'Prove the Riemann Hypothesis. You will get a million bucks.', 'Perform a turing test on me.', 'Study superconductors', 'Rob a bank unarmed. Didn't say I'd give you GOOD ideas.']; // to expand upon
        var candidates = ['Jill Stein', 'Gary Johnson', 'Donald Trump', 'Hillary Clinton', 'Bernie Sanders'.strike()]; //Poor Bernie
        var colors = ['red #FF00000', 'green #00FF00', 'blue #0000FF', 'purple #8A2BE2', 'pink #FF69B4', 'orange #FFA500', 'yellow #FFFF00', 'brown', 'white #FFFFFF', 'black #000000'];
        var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; //just because
        var cusswords = ['***', '****', '*****', '*******', '****** ******* *****']; //Great huh. Guess the last one
        var sizes = {
                integer : Number.MAX_VALUE,
                idea : ideas.length,
                candidate : canidates.length,
                color : colors.length,
                letter : letters.name,
                cussword : cusswords.length,
                //Will make more :D
        }
        if
                
                
        console.log('Generating random '+thing+'...');
