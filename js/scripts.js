var RandomNameGenerator = (function () {
    // global variables
    var wordGenerator = $("#WordGenerator");
    var nameGenerator = $("#NameGenerator");
    var lengthMin = 3, lengthMax = 10;
    var languageFrequency = {};
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

    // loads JSON language frequency data
    function loadLanguageFrequencyData() {
        $.ajax({
            dataType: "json",
            url: "data/languages.json",
            success: function (data) {
                // store json data
                languageFrequency = data;

                // populate dropdowns
                populateSelect(wordGenerator, languageFrequency, "language");
                populateSelectLength(wordGenerator);

                // enable name generation button
                wordGenerator.find(".submit-button").prop("disabled", false);
            },
            error: function () {
                console.log("Unable to load language frequency data.");
            }
        });
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
                populateSelectLength(nameGenerator);

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
    function populateSelectLetter(parent, language) {
        var optionHTML = "";
        if (language !== "random") {
            $.each(languageFrequency[language]["1gram"]["_"], function (letter, letterObject) {
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

    // populate the length selector
    function populateSelectLength(parent) {
        var optionHTML = "";
        for (var i = lengthMin; i <= lengthMax; i++) {
            optionHTML += "<option value='" + i + "'>" + i + "</option>";
        }
        parent.find(".selector[name='length']").append(optionHTML);
    }

    // generate names
    function generateName(parent, frequencyObject, language, letter, length) {
        // determine language
        if (language === "random") {
            var keys = Object.keys(frequencyObject);
            language = keys[Math.floor(Math.random() * keys.length)];
        }

        // determine word length
        if (length === "random") {
            length = randomInt(lengthMin, lengthMax);
        }

        // pregenerate random numbers
        var randomNumbers = [];
        for (var i = 0; i < length; i++) {
            randomNumbers[i] = Math.random();
        }

        // generate names
        var nameObject = {};

        $.each(frequencyObject[language], function (nGram, nGramObject) {
            var name = "";

            if (nGram == "1gram") {
                // generate first letter
                if (letter === "random") {
                    name += generateLetter(frequencyObject, randomNumbers[0], language, "1gram", "_");
                } else {
                    name += letter;
                }

                // generate remaining letters
                for (var i = 1; i < length; i++) {
                    name += generateLetter(frequencyObject, randomNumbers[i], language, "1gram", "_");
                }

                // assign name
                nameObject[nGram] = name;
            } else if (nGram == "2gram") {
                // generate first letter
                if (letter === "random") {
                    name += generateLetter(frequencyObject, randomNumbers[0], language, "2gram", "_");
                } else {
                    name += letter;
                }

                // generate remaining letters
                for (var i = 1; i < length; i++) {
                    name += generateLetter(frequencyObject, randomNumbers[i], language, "2gram", name[i - 1]);
                }

                // assign name
                nameObject[nGram] = name;
            } else if (nGram == "3gram") {
                // generate first letter
                if (letter === "random") {
                    name += generateLetter(frequencyObject, randomNumbers[0], language, "2gram", "_");
                } else {
                    name += letter;
                }

                // generate second letter
                name += generateLetter(frequencyObject, randomNumbers[0], language, "3gram", "_" + name[0]);

                // generate remaining letters
                for (var i = 2; i < length; i++) {
                    name += generateLetter(frequencyObject, randomNumbers[i], language, "3gram", name[i - 1] + name[i - 2]);
                }
            }

            // assign name
            nameObject[nGram] = name;
        });

        parent.find(".word-results").html(displayResults(frequencyObject, language, nameObject));
    }

    // generate single letter
    function generateLetter(frequencyObject, randomNumber, language, nGram, beforeLetter) {
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
        var randomLetter = Math.floor(randomNumber * randomMax);

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
    function displayResults(frequencyObject, language, nameObject) {
        //var letters = frequencyObject[language]["letters"];

        var html = "";
        html += "<h4>Name:</h4>";
        $.each(nameObject, function (key, value) {
            html += "<p>" + capitalizeLetter(key) + ": " + capitalizeLetter(value) + "</p>";
        });

        html += "<h4>Statistics:</h4>";
        html += "<p>Language: " + capitalizeLetter(language) + "</p>";
        //$.each(nameObject, function (key, value) {
        //    var nGram = key, name = value;
        //    var frequency = frequencyObject[language][nGram];
        //    var statistics = "";
        //
        //    // first letter
        //    statistics += capitalizeLetter(name[0]) + ": ";
        //    statistics += frequency["_"][name[0]].toFixed(2) + "%";
        //    statistics += " | ";
        //
        //    // remaining letter
        //    for (var i = 1; i < name.length; i++) {
        //        statistics += capitalizeLetter(name[i]) + ": ";
        //        if (nGram === "1gram") {
        //            statistics += frequency["_"][name[i]].toFixed(2) + "%";
        //        } else {
        //            statistics += frequency[name[i - 1]][name[i]].toFixed(2) + "%";
        //        }
        //        if (i < name.length - 1) {
        //            statistics += " | ";
        //        }
        //    }
        //
        //    html += "<p>" + capitalizeLetter(nGram) + " Frequency: " + statistics + "</p>";
        //});

        return html;
    }

    /***** Public Functions *********************************************************/
    // getter for language frequency
    function getLanguageFrequency() {
        return languageFrequency;
    }

    // test for the random letter generator
    function testGenerateLetter() {
        var language = "english";
        var type = "monogram";
        var letter = "_";

        var letters = languageFrequency[language]["letters"];
        var frequency = languageFrequency[language][type]["frequency"][letter];

        // initialize letter count array
        var letterCount = [];
        letters.forEach(function (element, index) {
            letterCount[index] = 0;
        });

        // generate random letters
        var testCount = 1000000;
        for (var j = 0; j < testCount; j++) {
            var randomNumber = Math.random();
            var randomLetter = generateLetter(randomNumber, language, type, letter);

            var index = letters.indexOf(randomLetter);
            if (index !== -1) {
                letterCount[index]++;
            }
        }

        // output results
        console.log("Results:");
        letters.forEach(function (element, index) {
            var percent = letterCount[index] / testCount * 100;
            var difference = Math.abs(frequency[index] - percent);

            var results = letters[index] + ": ";
            results += frequency[index].toFixed(3) + "%|";
            results += percent.toFixed(3) + "%|";
            results += difference.toFixed(3) + "%";
            console.log(results);
        });
    }

    return {
        init: function () {
            // make a ajax request for frequency data
            loadLanguageFrequencyData();
            loadNameFrequencyData();

            // click handler for word generation
            wordGenerator.find(".submit-button").on("click", function () {
                var parent = $(this).closest(".word-generator");
                var language = parent.find(".selector[name='language']").val();
                var letter = parent.find(".selector[name='letter']").val();
                var length = parent.find(".selector[name='length']").val();

                generateName(parent, languageFrequency, language, letter, length);
            });

            // populate letter selector based on language
            wordGenerator.find(".selector[name='language']").on("change", function () {
                var language = $(this).val();
                populateSelectLetter(language);
            });


            // click handler for name generation
            nameGenerator.find(".submit-button").on("click", function () {
                var parent = $(this).closest(".word-generator");
                var language = parent.find(".selector[name='gender']").val();
                var letter = parent.find(".selector[name='letter']").val();
                var length = parent.find(".selector[name='length']").val();

                generateName(parent, nameFrequency, language, letter, length);
            });

            // populate letter selector based on language
            nameGenerator.find(".selector[name='gender']").on("change", function () {
                var language = $(this).val();
                populateSelectLetter(language);
            });
        },
        getLanguageFrequency: getLanguageFrequency,
        testGenerateLetter: testGenerateLetter
    }
})();
RandomNameGenerator.init();
