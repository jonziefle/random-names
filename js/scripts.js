var RandomNameGenerator = (function () {
    // global variables
    var nameGenerator = $(".name-generator");
    var lengthMin = 3, lengthMax = 10;
    var languageFrequency = {};

    /***** Private Functions *********************************************************/
    // capitalize the first letter of a string
    function capitalizeLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // generate random integer in a given range (inclusive)
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // loads JSON frequency data
    function loadFrequencyData() {
        $.ajax({
            dataType: "json",
            url: "data/languages.json",
            success: function (data) {
                // store json data
                languageFrequency = data;

                // populate dropdowns
                populateLanguageSelect();
                populateLengthSelect();

                // generate cumulative distributions
                generateCumulativeDistributions();

                // enable name generation button
                nameGenerator.find(".submit-button").prop("disabled", false);
            },
            error: function () {
                console.log("Unable to load frequency data.");
            }
        });
    }

    // populate the select languages
    function populateLanguageSelect() {
        var optionHTML = "";
        $.each(languageFrequency, function (language, languageObject) {
            optionHTML += "<option value='" + language + "'>" + capitalizeLetter(language) + "</option>";
        });

        nameGenerator.find(".selector[name='language']").append(optionHTML);
    }

    // populate the select letters
    function populateLengthSelect() {
        var optionHTML = "";
        for (var i = lengthMin; i <= lengthMax; i++) {
            optionHTML += "<option value='" + i + "'>" + i + "</option>";
        }
        nameGenerator.find(".selector[name='length']").append(optionHTML);
    }

    // populate the select letters
    function populateLetterSelect(language) {
        var optionHTML = "";
        if (language !== "random") {
            languageFrequency[language]["letters"].forEach(function (letter) {
                optionHTML += "<option value='" + letter + "'>" + capitalizeLetter(letter) + "</option>";
            })
        }

        var selector = nameGenerator.find(".selector[name='letter']");
        var selectorValue = selector.val();
        selector.find("option:gt(0)").remove();
        selector.append(optionHTML);

        if (selector.find("option[value='" + selectorValue + "']").length > 0) {
            selector.val(selectorValue);
        }
    }

    // generates cumulative distributions from the individual letter frequencies
    function generateCumulativeDistributions() {
        $.each(languageFrequency, function (language, languageObject) {
            ["monogram", "bigram"].forEach(function (value) {
                if (languageObject.hasOwnProperty(value)) {
                    languageObject[value]["cumulative"] = {};
                    $.each(languageObject[value]["frequency"], function (letter, frequencyArray) {
                        var cumulativeArray = [];
                        var sum = 0;
                        frequencyArray.forEach(function (frequency) {
                            sum += parseInt(frequency * 10000);
                            cumulativeArray.push(sum);
                        });
                        languageObject[value]["cumulative"][letter] = cumulativeArray;
                    });
                }
            })
        });
    }

    // generate names
    function generateName(language, letter, length) {
        // determine language
        if (language === "random") {
            var keys = Object.keys(languageFrequency);
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
        ["monogram", "bigram"].forEach(function (type) {
            if (languageFrequency[language][type]) {
                var name = "";

                // generate first letter
                var currentLetter;
                if (letter === "random") {
                    currentLetter = generateLetter(randomNumbers[0], language, type, "_");
                } else {
                    currentLetter = letter;
                }
                name += currentLetter;

                // generate remaining letters
                for (var j = 1; j < length; j++) {
                    if (type == "monogram") {
                        currentLetter = generateLetter(randomNumbers[j], language, type, "_");
                    } else {
                        currentLetter = generateLetter(randomNumbers[j], language, type, currentLetter);
                    }
                    name += currentLetter;
                }

                // assign name
                nameObject[type] = name;
            }
        });
        nameGenerator.find(".name-results").html(displayResults(language, nameObject));
    }

    // generate single letter
    function generateLetter(randomNumber, language, type, letter) {
        var letters = languageFrequency[language]["letters"];
        var frequency = languageFrequency[language][type]["frequency"][letter];
        var cumulative = languageFrequency[language][type]["cumulative"][letter];

        var randomMax = cumulative[cumulative.length - 1];
        var randomLetter = Math.floor(randomNumber * randomMax);

        for (i = 0; i < letters.length; i++) {
            if (frequency[i] > 0 && randomLetter < cumulative[i]) {
                var currentLetter = letters[i];
                break;
            }
        }

        return currentLetter;
    }

    // display name results
    function displayResults(language, nameObject) {
        var letters = languageFrequency[language]["letters"];

        var html = "";
        html += "<h4>Name:</h4>";
        $.each(nameObject, function (key, value) {
            html += "<p>" + capitalizeLetter(key) + ": " + capitalizeLetter(value) + "</p>";
        });

        html += "<h4>Statistics:</h4>";
        html += "<p>Language: " + capitalizeLetter(language) + "</p>";
        $.each(nameObject, function (key, value) {
            var type = key, name = value;
            var frequency = languageFrequency[language][type]["frequency"];
            var statistics = "";

            // first letter
            statistics += capitalizeLetter(name[0]) + ": ";
            statistics += frequency["_"][letters.indexOf(name[0])].toFixed(2) + "%";
            statistics += " | ";

            // remaining letter
            for (var i = 1; i < name.length; i++) {
                statistics += capitalizeLetter(name[i]) + ": ";
                if (type === "monogram") {
                    statistics += frequency["_"][letters.indexOf(name[i])].toFixed(2) + "%";
                } else {
                    statistics += frequency[name[i - 1]][letters.indexOf(name[i])].toFixed(2) + "%";
                }
                if (i < name.length - 1) {
                    statistics += " | ";
                }
            }

            html += "<p>" + capitalizeLetter(type) + " Frequency: " + statistics + "</p>";
        });

        return html;
    }

    /***** Public Functions *********************************************************/
    function getLanguageFrequency() {
        return languageFrequency;
    }

    return {
        init: function () {
            // make a ajax request for frequency data
            loadFrequencyData();

            // click handler for name generation
            nameGenerator.find(".submit-button").on("click", function () {
                var parent = $(this).closest(".name-generator");
                var language = parent.find(".selector[name='language']").val();
                var letter = parent.find(".selector[name='letter']").val();
                var length = parent.find(".selector[name='length']").val();

                generateName(language, letter, length);
            });

            // populate letter selector based on language
            nameGenerator.find(".selector[name='language']").on("change", function () {
                var language = $(this).val();
                populateLetterSelect(language);
            });
        },
        getLanguageFrequency: getLanguageFrequency
    }
})();
RandomNameGenerator.init();
