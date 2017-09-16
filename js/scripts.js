var RandomNameGenerator = (function () {
    // global variables
    var nameGenerator = $("#NameGenerator");
    var lengthMin = 2, lengthMax = 12;
    var nameFrequency = {};

    /***** Private Functions *********************************************************/
    // capitalize the first letter of a string
    function capitalizeLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // generate random integer in a given range (inclusive)
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // loads JSON name frequency data
    function loadNameFrequencyData() {
        $.ajax({
            dataType: "json",
            url: "data/2016.json",
            success: function (data) {
                // store json data
                nameFrequency = data;

                // populate dropdowns
                populateSelect(nameGenerator, nameFrequency, "gender");
                populateSelect(nameGenerator, nameFrequency["female"]["1gram"]["_"], "letter");

                // enable name generation button
                nameGenerator.find(".submit-button").prop("disabled", false);
            },
            error: function () {
                console.log("Unable to load name frequency data.");
            }
        });
    }

    // populate a generic selector
    function populateSelect(parent, dataObject, name) {
        var optionHTML = "";
        $.each(dataObject, function (key, value) {
            optionHTML += "<option value='" + key + "'>" + capitalizeLetter(key) + "</option>";
        });

        parent.find(".selector[name='" + name + "']").append(optionHTML);
    }

    // populate the letter selector
    function populateSelectLetter(parent, frequencyObject, language) {
        var optionHTML = "";
        if (language !== "random") {
            $.each(frequencyObject[language]["1gram"]["_"], function (letter, letterObject) {
                optionHTML += "<option value='" + letter + "'>" + capitalizeLetter(letter) + "</option>";
            })
        }

        var selector = parent.find(".selector[name='letter']");
        var selectorValue = selector.val();
        selector.find("option:gt(0)").remove();
        selector.append(optionHTML);

        if (selector.find("option[value='" + selectorValue + "']").length > 0) {
            selector.val(selectorValue);
        }
    }

    // generate words
    function generateWord(parent, frequencyObject, language, letter) {
        // determine language
        if (language === "random") {
            var keys = Object.keys(frequencyObject);
            language = keys[Math.floor(Math.random() * keys.length)];
        }

        // generate names
        var nameObject = {};
        $.each(frequencyObject[language], function (nGram, nGramObject) {
            var name = "";
            var index;
            if (nGram === "1gram") {
                // first letter(s)
                if (letter === "random") {
                    name += generateLetter(frequencyObject, language, nGram, "_");
                } else {
                    name += letter;
                }

                // remaining letters
                var length = randomInt(lengthMin, lengthMax);
                for (index = 1; index < length; index++) {
                    name += generateLetter(frequencyObject, language, nGram, "_");
                }
            }
            else if (nGram === "2gram") {
                // first letter(s)
                if (letter === "random") {
                    name += generateLetter(frequencyObject, language, nGram, "_");
                } else {
                    name += letter;
                }

                // remaining letters
                index = 1;
                while (name.indexOf("_") === -1) {
                    name += generateLetter(frequencyObject, language, nGram, name.slice(index - 1, index));
                    index++;
                }
            }
            else if (nGram === "3gram") {
                // first letter(s)
                if (letter === "random") {
                    name += generateLetter(frequencyObject, language, nGram, "_");
                } else {
                    name += letter;
                    name += generateLetter(frequencyObject, language, nGram, "_" + letter);
                }

                // remaining letters
                index = 2;
                while (name.indexOf("_") === -1) {
                    name += generateLetter(frequencyObject, language, nGram, name.slice(index - 2, index));
                    index++;
                }
            }
            else if (nGram === "4gram") {
                // first letter(s)
                if (letter === "random") {
                    name += generateLetter(frequencyObject, language, nGram, "_");
                } else {
                    name += letter;
                    name += generateLetter(frequencyObject, language, nGram, "_" + letter);
                }

                // remaining letters
                index = 3;
                while (name.indexOf("_") === -1) {
                    name += generateLetter(frequencyObject, language, nGram, name.slice(index - 3, index));
                    index++;
                }
            }
            else if (nGram === "5gram") {
                // first letter(s)
                if (letter === "random") {
                    name += generateLetter(frequencyObject, language, nGram, "_");
                } else {
                    name += letter;
                    name += generateLetter(frequencyObject, language, nGram, "_" + letter);
                }

                // remaining letters
                index = 4;
                while (name.indexOf("_") === -1) {
                    name += generateLetter(frequencyObject, language, nGram, name.slice(index - 4, index));
                    index++;
                }
            }

            // assign name
            nameObject[nGram] = name.replace("_", "");
        });

        parent.find(".word-results").html(displayResults(nameObject, language));
    }

    // generate single letter
    function generateLetter(frequencyObject, language, nGram, beforeLetter) {
        if (!frequencyObject[language][nGram].hasOwnProperty(beforeLetter)) {
            return "_"
        }

        var letterArray = Object.keys(frequencyObject[language][nGram][beforeLetter]);

        // generate cumulative array
        var cumulativeArray = [];
        var sum = 0;
        letterArray.forEach(function (afterLetter, index) {
            var frequency = frequencyObject[language][nGram][beforeLetter][afterLetter];
            sum += parseInt(frequency * 1000);
            cumulativeArray.push(sum);
        });

        // generate integer
        var randomMax = cumulativeArray[cumulativeArray.length - 1];
        var randomLetter = Math.floor(Math.random() * randomMax);

        // generate letter
        for (var i = 0; i < letterArray.length; i++) {
            if (randomLetter < cumulativeArray[i]) {
                var afterLetter = letterArray[i];
                break;
            }
        }

        return afterLetter;
    }

    // display name results
    function displayResults(nameObject, language) {
        var html = "";
        html += "<h4>Name:</h4>";
        $.each(nameObject, function (key, value) {
            html += "<p>" + capitalizeLetter(key) + ": " + capitalizeLetter(value) + "</p>";
        });

        html += "<h4>Selector:</h4>";
        html += "<p>" + capitalizeLetter(language) + "</p>";

        return html;
    }

    /***** Public Functions *********************************************************/
    // getter for name frequency
    function getNameFrequency() {
        return nameFrequency;
    }

    // test for the random letter generator
    function testGenerateLetter() {
        var gender = "male";
        var nGram = "1gram";
        var beforeLetter = "_";

        var letterArray = Object.keys(nameFrequency[gender][nGram][beforeLetter]);
        var frequency = nameFrequency[gender][nGram][beforeLetter];

        // initialize letter count array
        var letterCount = [];
        letterArray.forEach(function (element, index) {
            letterCount[index] = 0;
        });

        // generate random letters
        console.log("Testing:");
        var testCount = 1000000;
        for (var j = 1; j <= testCount; j++) {
            var increment = testCount / 10;
            if (j % increment === 0) {
                console.log("Completion: " + j / testCount * 100 + "%")
            }

            var randomLetter = generateLetter(nameFrequency, gender, nGram, beforeLetter);

            var index = letterArray.indexOf(randomLetter);
            if (index !== -1) {
                letterCount[index]++;
            }
        }

        // output results
        console.log("Results:");
        letterArray.forEach(function (letter, index) {
            var percent = letterCount[index] / testCount * 100;
            var difference = Math.abs(frequency[letter] - percent);

            var results = letter + ": ";
            results += frequency[letter].toFixed(3) + "%|";
            results += percent.toFixed(3) + "%|";
            results += difference.toFixed(3) + "%";
            console.log(results);
        });
    }

    return {
        init: function () {
            // make a ajax request for name frequency data
            loadNameFrequencyData();

            // click handler for name generation
            nameGenerator.find(".submit-button").on("click", function () {
                var parent = $(this).closest(".word-generator");
                var gender = parent.find(".selector[name='gender']").val();
                var letter = parent.find(".selector[name='letter']").val();

                generateWord(parent, nameFrequency, gender, letter);
            });
        },
        getNameFrequency: getNameFrequency,
        testGenerateLetter: testGenerateLetter
    }
})();
RandomNameGenerator.init();
