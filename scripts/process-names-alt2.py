import csv
import json

letterArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
ngramArray = ["1gram", "2gram", "3gram", "4gram", "5gram"]
genderArray = ["male", "female"]

data = {}

def main():
    fileInput = '../data/baby-names/yob2016.txt'
    fileOutput = '../data/2016-5gram-b.json'

    # open csv file
    with open(fileInput, newline='') as f:
        print("Processing: " + fileInput)
        reader = csv.reader(f)

        # initialize frequency list for the length of letters list
        for gender in genderArray:
            data[gender] = {}
            for ngram in ngramArray:
                data[gender][ngram] = {}

        # add counts for each letter
        for row in reader:
            name = row[0]
            if (row[1] == "M"):
                gender = "male"
            else:
                gender = "female"
            count = row[2]

            # iterate through letters and multiplies by the name count
            for i in range(len(name)):
                letterValue = name[i].lower()
                for ngram in ngramArray:
                    letterKey = ""
                    if (ngram == "1gram"):
                        letterKey = "_"

                    elif (ngram == "2gram" and i >= 0):
                        if (i == 0):
                            letterKey = "_"
                        else:
                            letterKey = name[i - 1]

                    elif (ngram == "3gram" and i >= 1):
                        if (i == 1):
                            letterKey = "_" + name[i - 1]
                        else:
                            letterKey = name[i - 2] + name[i - 1]

                    elif (ngram == "4gram" and i >= 2):
                        if (i == 2):
                            letterKey = "_" + name[i - 2] + name[i - 1]
                        else:
                            letterKey = name[i - 3] + name[i - 2] + name[i - 1]

                    elif (ngram == "5gram" and i >= 3):
                        if (i == 3):
                            letterKey = "_" + name[i - 3] + name[i - 2] + name[i - 1]
                        else:
                            letterKey = name[i - 4] + name[i - 3] + name[i - 2] + name[i - 1]

                    if (letterKey != ""):
                        letterKey = letterKey.lower()
                        if (letterKey in data[gender][ngram]):
                            if (letterValue in data[gender][ngram][letterKey]):
                                data[gender][ngram][letterKey][letterValue] += int(count)
                            else:
                                data[gender][ngram][letterKey][letterValue] = int(count)
                        else:
                            data[gender][ngram][letterKey] = {}
                            data[gender][ngram][letterKey][letterValue] = int(count)

        # divide counts by total sum to get frequency
        for gender in genderArray:
            for ngram in ngramArray:
                for letterKey in data[gender][ngram]:
                    letterCountSum = sum(data[gender][ngram][letterKey].values())
                    for letterValue, letterCount in data[gender][ngram][letterKey].items():
                        if (letterCount > 0):
                            letterFrequency = round(letterCount / letterCountSum * 100, 3)
                        else:
                            letterFrequency = 0
                        data[gender][ngram][letterKey][letterValue] = letterFrequency

    # print json data
    #print(json.dumps(data, sort_keys=True, indent=2))

    # write json data
    with open(fileOutput, 'w') as f:
        print("Writing: " + fileOutput)
        json.dump(data, f, sort_keys=True)

if __name__ == "__main__":
    # execute only if run as a script
    main()
