var RandomNameGenerator = (function () {
    // global variables
    var nameGenerator = $("#NameGenerator");
    var lengthMin = 2, lengthMax = 12;
    var jsonData = {};
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
    function loadFrequencyData(url) {
        nameGenerator.find(".name-button").prop("disabled", true);
        nameGenerator.find(".frequency-data").text("");

        if (jsonData.hasOwnProperty(url)) {
            nameFrequency = jsonData[url];
            activateData();
        } else {
            $.ajax({
                dataType: "json",
                url: url,
                success: function (data) {
                    // store json data
                    jsonData[url] = data;
                    activateData();
                },
                error: function () {
                    console.log("Unable to load name frequency data.");
                }
            });
        }

        function activateData() {
            // set new data to "active"
            nameFrequency = jsonData[url];

            // populate dropdowns
            populateSelect(nameGenerator, nameFrequency, "gender");
            populateSelect(nameGenerator, nameFrequency["female"]["1gram"]["_"], "letter");

            // enable name generation button
            nameGenerator.find(".name-button").prop("disabled", false);
        }
    }

    // populate a generic selector
    function populateSelect(parent, dataObject, name) {
        var optionHTML = "";
        $.each(dataObject, function (key, value) {
            optionHTML += "<option value='" + key + "'>" + capitalizeLetter(key) + "</option>";
        });


        var selector = parent.find(".selector[name='" + name + "']");
        var selectorValue = selector.val();
        selector.find("option:gt(0)").remove();
        selector.append(optionHTML);

        if (selector.find("option[value='" + selectorValue + "']").length > 0) {
            selector.val(selectorValue);
        }
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
        Object.keys(frequencyObject[gender]).forEach(function (nGram) {
            var index;
            var name = "";

            switch (nGram) {
                case "1gram":
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

                    break;
                case "2gram":
                    // first letter(s)
                    if (letter === "random") {
                        name += generateLetter(frequencyObject, gender, nGram, "_");
                    } else {
                        name += letter;
                    }

                    // remaining letters
                    index = 1;
                    while (name.slice(-1) !== "_") {
                        name += generateLetter(frequencyObject, gender, nGram, name.slice(index - 1, index));
                        index++;
                    }

                    break;
                case "3gram":
                    // first letter(s)
                    if (letter === "random") {
                        name += generateLetter(frequencyObject, gender, nGram, "_");
                    } else {
                        name += letter;
                        name += generateLetter(frequencyObject, gender, nGram, "_" + letter);
                    }

                    // remaining letters
                    index = 2;
                    while (name.slice(-1) !== "_") {
                        name += generateLetter(frequencyObject, gender, nGram, name.slice(index - 2, index));
                        index++;
                    }
                    break;
                case "4gram":
                    // first letter(s)
                    if (letter === "random") {
                        name += generateLetter(frequencyObject, gender, nGram, "_");
                    } else {
                        name += letter;
                        name += generateLetter(frequencyObject, gender, nGram, "_" + letter);
                    }

                    // remaining letters
                    index = 3;
                    while (name.slice(-1) !== "_") {
                        name += generateLetter(frequencyObject, gender, nGram, name.slice(index - 3, index));
                        index++;
                    }

                    break;
                case "5gram":
                    // first letter(s)
                    if (letter === "random") {
                        name += generateLetter(frequencyObject, gender, nGram, "_");
                    } else {
                        name += letter;
                        name += generateLetter(frequencyObject, gender, nGram, "_" + letter);
                    }

                    // remaining letters
                    index = 4;
                    while (name.slice(-1) !== "_") {
                        name += generateLetter(frequencyObject, gender, nGram, name.slice(index - 4, index));
                        index++;
                    }

                    break;
            }

            // assign name
            nameObject[nGram] = name.replace(/_/g, "");
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
            // change handler for name frequency data ajax request
            nameGenerator.find(".selector[name='data']").on("change", function () {
                var url = $(this).val();
                if (url !== "default") {
                    loadFrequencyData(url);
                } else {
                    console.log("Please select a valid dataset");
                }
            });

            // click handler for name generation
            nameGenerator.find(".name-button").on("click", function () {
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
