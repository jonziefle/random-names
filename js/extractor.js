// extracts letter frequencies from the table on https://en.wikipedia.org/wiki/Letter_frequency
var letterDistribution = {};
var table = $(".wikitable").eq(2)

table.find("thead th:not(:first-child)").each(function(index, element) {
    var language = $(this).find("a").eq(0).text().toLowerCase();
    var letters = {};

    table.find("tbody tr").each(function() {
        var row = $(this);
        var letterIndex = index + 2;
        letters[row.find("td:nth-child(1)").text()] = parseFloat(row.find("td:nth-child(" + letterIndex + ")").text());
    });

    letterDistribution[language] = letters;
});

console.log(JSON.stringify(letterDistribution));
