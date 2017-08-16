var RandomNameGenerator = (function () {
    // global variables
    var nameGenerator = $(".name-generator");
    var languageFrequency = {};

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
        var html = {
            "monogram": "",
            "bigram": ""
        };
        $.each(languageFrequency, function (language, languageObject) {
            var optionHTML = "<option value='" + language + "'>" + capitalizeLetter(language) + "</option>";
            ["monogram", "bigram"].forEach(function (value) {
                if (languageObject.hasOwnProperty(value)) {
                    html[value] += optionHTML;
                }
            });
        });

        ["monogram", "bigram"].forEach(function (value) {
            nameGenerator.filter("[data-name-type='" + value + "']").find(".selector[name='language']").append(html[value]);
        });
    }

    // populate the select letters
    function populateLetterSelect(parent, language) {
        var optionHTML = "";
        if (language !== "random") {
            languageFrequency[language]["letters"].forEach(function (letter) {
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

    // populate the select letters
    function populateLengthSelect() {
        var lengthMin = 3, lengthMax = 10;
        var optionHTML = "";
        for (var i = lengthMin; i <= lengthMax; i++) {
            optionHTML += "<option value='" + i + "'>" + i + "</option>";
        }
        nameGenerator.find(".selector[name='length']").append(optionHTML);
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
    function generateName(language, type, letter, length) {
        var name = "";

        // determine language
        if (language === "random") {
            var keys = Object.keys(languageFrequency).filter(function (key) {
                return languageFrequency[key].hasOwnProperty(type);
            });
            language = keys[Math.floor(Math.random() * keys.length)];
        }

        // determine word length
        if (length === "random") {
            length = randomInt(3, 10);
        }

        // generate first letter
        var currentLetter;
        if (letter === "random") {
            currentLetter = generateLetter(language, type, "_");
        } else {
            currentLetter = letter;
        }
        name += currentLetter;

        // generate remaining letters
        for (var i = 1; i < length; i++) {
            if (type == "monogram") {
                currentLetter = generateLetter(language, type, "_");
            } else {
                currentLetter = generateLetter(language, type, currentLetter);
            }
            name += currentLetter;
        }

        nameGenerator.filter("[data-name-type='" + type + "']").find(".name-results").html(displayResults(language, type, name));
    }

    // generate single letter
    function generateLetter(language, type, letter) {
        var letters = languageFrequency[language]["letters"];
        var frequency = languageFrequency[language][type]["frequency"][letter];
        var cumulative = languageFrequency[language][type]["cumulative"][letter];

        var randomMax = cumulative[cumulative.length - 1];
        var randomLetter = Math.floor(Math.random() * randomMax);

        for (i = 0; i < letters.length; i++) {
            if (frequency[i] > 0 && randomLetter < cumulative[i]) {
                var currentLetter = letters[i];
                break;
            }
        }

        return currentLetter;
    }

    // display name results
    function displayResults(language, type, name) {
        var letters = languageFrequency[language]["letters"];
        var frequency = languageFrequency[language][type]["frequency"];

        var html = "";
        html += "<p>Name: " + capitalizeLetter(name) + "</p>";
        html += "<p>Language: " + capitalizeLetter(language) + "</p>";

        var statistics = "";
        if (type === "monogram") {
            for (var i = 0; i < name.length; i++) {
                statistics += capitalizeLetter(name[i]) + ": ";
                statistics += frequency["_"][letters.indexOf(name[i])].toFixed(2) + "%";
                if (i < name.length - 1) {
                    statistics += " | ";
                }
            }
        } else {
            // first letter
            statistics += capitalizeLetter(name[0]) + ": ";
            statistics += frequency["_"][letters.indexOf(name[0])].toFixed(2) + "%";
            statistics += " | ";

            // remaining letters
            for (var j = 1; j < name.length; j++) {
                statistics += capitalizeLetter(name[j]) + ": ";
                statistics += frequency[name[j - 1]][letters.indexOf(name[j])].toFixed(2) + "%";
                if (j < name.length - 1) {
                    statistics += " | ";
                }
            }
        }
        html += "<p>Letters: " + statistics + "</p>";

        return html;
    }

    return {
        init: function () {
            // make a ajax request for frequency data
            loadFrequencyData();

            // click handler for name generation
            nameGenerator.find(".submit-button").on("click", function () {
                var parent = $(this).closest(".name-generator");
                var type = parent.attr("data-name-type");
                var language = parent.find(".selector[name='language']").val();
                var letter = parent.find(".selector[name='letter']").val();
                var length = parent.find(".selector[name='length']").val();

                generateName(language, type, letter, length);
            });

            // populate letter selector based on language
            nameGenerator.find(".selector[name='language']").on("change", function () {
                var parent = $(this).closest(".name-generator");
                var language = $(this).val();

                populateLetterSelect(parent, language);
            });
        },
        languageFrequency: languageFrequency
    }
})();
RandomNameGenerator.init();
