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

    // generate words
    function generateName(parent, frequencyObject, gender, letter) {
        // determine gender
        if (gender === "random") {
            var keys = Object.keys(frequencyObject);
            gender = keys[Math.floor(Math.random() * keys.length)];
        }

        // generate names
        var nameObject = {};
        $.each(frequencyObject[gender], function (nGram, nGramObject) {
            var name = "";
            var index;
            if (nGram === "1gram") {
                // first letter(s)
                if (letter === "random") {
                    name += generateLetter(frequencyObject, gender, nGram, "_");
                } else {
                    name += letter;
                }

                // remaining letters
                var length = randomInt(lengthMin, lengthMax);
                for (index = 1; index < length; index++) {
                    name += generateLetter(frequencyObject, gender, nGram, "_");
                }
            }
            else if (nGram === "2gram") {
                // first letter(s)
                if (letter === "random") {
                    name += generateLetter(frequencyObject, gender, nGram, "_");
                } else {
                    name += letter;
                }

                // remaining letters
                index = 1;
                while (name.indexOf("_") === -1) {
                    name += generateLetter(frequencyObject, gender, nGram, name.slice(index - 1, index));
                    index++;
                }
            }
            else if (nGram === "3gram") {
                // first letter(s)
                if (letter === "random") {
                    name += generateLetter(frequencyObject, gender, nGram, "_");
                } else {
                    name += letter;
                    name += generateLetter(frequencyObject, gender, nGram, "_" + letter);
                }

                // remaining letters
                index = 2;
                while (name.indexOf("_") === -1) {
                    name += generateLetter(frequencyObject, gender, nGram, name.slice(index - 2, index));
                    index++;
                }
            }
            else if (nGram === "4gram") {
                // first letter(s)
                if (letter === "random") {
                    name += generateLetter(frequencyObject, gender, nGram, "_");
                } else {
                    name += letter;
                    name += generateLetter(frequencyObject, gender, nGram, "_" + letter);
                }

                // remaining letters
                index = 3;
                while (name.indexOf("_") === -1) {
                    name += generateLetter(frequencyObject, gender, nGram, name.slice(index - 3, index));
                    index++;
                }
            }
            else if (nGram === "5gram") {
                // first letter(s)
                if (letter === "random") {
                    name += generateLetter(frequencyObject, gender, nGram, "_");
                } else {
                    name += letter;
                    name += generateLetter(frequencyObject, gender, nGram, "_" + letter);
                }

                // remaining letters
                index = 4;
                while (name.indexOf("_") === -1) {
                    name += generateLetter(frequencyObject, gender, nGram, name.slice(index - 4, index));
                    index++;
                }
            }

            // assign name
            nameObject[nGram] = name.replace("_", "");
        });

        parent.find(".word-results").html(displayResults(nameObject, gender));
    }

    // generate single letter
    function generateLetter(frequencyObject, gender, nGram, beforeLetter) {
        if (!frequencyObject[gender][nGram].hasOwnProperty(beforeLetter)) {
            return "_"
        }

        var letterArray = Object.keys(frequencyObject[gender][nGram][beforeLetter]);

        // generate cumulative array
        var cumulativeArray = [];
        var sum = 0;
        letterArray.forEach(function (afterLetter, index) {
            var frequency = frequencyObject[gender][nGram][beforeLetter][afterLetter];
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
    function displayResults(nameObject, gender) {
        var html = "";
        html += "<p><b>Gender: </b>" + capitalizeLetter(gender) + "</p>";
        $.each(nameObject, function (key, value) {
            html += "<p><b>" + capitalizeLetter(key) + "</b>: " + capitalizeLetter(value) + "</p>";
        });

        return html;
    }

    /***** Public Functions *********************************************************/
    // getter for name frequency
    function getNameFrequency() {
        return nameFrequency;
    }

    // test for the random letter generator
    function testGenerateLetter() {
        var gender = "female";
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

                generateName(parent, nameFrequency, gender, letter);
            });
        },
        getNameFrequency: getNameFrequency,
        testGenerateLetter: testGenerateLetter
    }
})();
RandomNameGenerator.init();
