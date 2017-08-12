// extracts letter frequencies from the table on https://en.wikipedia.org/wiki/Letter_frequency
var table = $(".wikitable").eq(2);

// populate letters
var letters = [];
table.find("tbody tr").each(function () {
    letters.push($(this).find("td:nth-child(1)").text());
});

// populate frequency
var frequency = {};
table.find("thead th:not(:first-child)").each(function (index, element) {
    var language = $(this).find("a").eq(0).text().toLowerCase();
    var letters = [];

    table.find("tbody tr").each(function () {
        var row = $(this);
        var letterIndex = index + 2;
        letters.push(parseFloat(row.find("td:nth-child(" + letterIndex + ")").text()));
    });

    frequency[language] = letters;
});

var letterDistributions = {};
letterDistributions["letters"] = letters;
letterDistributions["frequency"] = frequency;
letterDistributions["cumulative"] = {};
console.log(JSON.stringify(letterDistributions));