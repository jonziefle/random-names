var RandomNameGenerator = (function () {
    // global variables
    var wordGenerator = $("#WordGenerator");
    var nameGenerator = $("#NameGenerator");
    var lengthMin = 4, lengthMax = 10;
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

        // pregenerate random numbers
        var length = randomInt(lengthMin, lengthMax);

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
                for (index = 1; index < length; index++) {
                    name += generateLetter(frequencyObject, language, nGram, name.slice(index - 1, index));
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
                for (index = 2; index < length; index++) {
                    name += generateLetter(frequencyObject, language, "3gram", name.slice(index - 2, index));
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
                for (index = 3; index < length; index++) {
                    name += generateLetter(frequencyObject, language, nGram, name.slice(index - 3, index));
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
                for (index = 4; index < length; index++) {
                    name += generateLetter(frequencyObject, language, nGram, name.slice(index - 4, index));
                }
            }

            // assign name
            nameObject[nGram] = name;
        });

        parent.find(".word-results").html(displayResults(frequencyObject, language, nameObject));
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

    // getter for name frequency
    function getNameFrequency() {
        return nameFrequency;
    }

    // test for the random letter generator
    function testGenerateLetter() {
        var language = "english";
        var nGram = "1gram";
        var beforeLetter = "_";

        var letterArray = Object.keys(languageFrequency[language][nGram][beforeLetter]);
        var frequency = languageFrequency[language][nGram][beforeLetter];

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

            var randomLetter = generateLetter(languageFrequency, language, nGram, beforeLetter);

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
            // make a ajax request for frequency data
            loadLanguageFrequencyData();
            loadNameFrequencyData();

            // click handler for word generation
            wordGenerator.find(".submit-button").on("click", function () {
                var parent = $(this).closest(".word-generator");
                var language = parent.find(".selector[name='language']").val();
                var letter = parent.find(".selector[name='letter']").val();

                generateWord(parent, languageFrequency, language, letter);
            });

            // populate letter selector based on language
            wordGenerator.find(".selector[name='language']").on("change", function () {
                var parent = $(this).closest(".word-generator");
                var language = $(this).val();

                populateSelectLetter(parent, languageFrequency, language);
            });

            // click handler for name generation
            nameGenerator.find(".submit-button").on("click", function () {
                var parent = $(this).closest(".word-generator");
                var gender = parent.find(".selector[name='gender']").val();
                var letter = parent.find(".selector[name='letter']").val();

                generateWord(parent, nameFrequency, gender, letter);
            });
        },
        getLanguageFrequency: getLanguageFrequency,
        getNameFrequency: getNameFrequency,
        testGenerateLetter: testGenerateLetter
    }
})();
RandomNameGenerator.init();
