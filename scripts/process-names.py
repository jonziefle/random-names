import csv
import json

letterArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
ngramArray = ["1gram", "2gram", "3gram", "4gram", "5gram"]
genderArray = ["male", "female"]
data = {}

def main():
    fileInput = '../data/baby-names/yob2016.txt'
    fileOutput = '../data/2016.json'

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
                afterLetter = name[i].lower()
                for ngram in ngramArray:
                    beforeLetter = ""
                    if (ngram == "1gram"):
                        beforeLetter = "_"
                    elif (ngram == "2gram" and i >= 0):
                        if (i == 0):
                            beforeLetter = "_"
                            afterLetter = name[0:1]
                        else:
                            beforeLetter = name[i-1:i]
                    elif (ngram == "3gram" and i >= 1):
                        if (i == 1):
                            beforeLetter = "_"
                            afterLetter = name[0:2]
                        else:
                            beforeLetter = name[i-2:i]
                    elif (ngram == "4gram" and i >= 2):
                        if (i == 2):
                            beforeLetter = "_"
                            afterLetter = name[0:3]
                        else:
                            beforeLetter = name[i-3:i]
                    elif (ngram == "5gram" and i >= 3):
                        if (i == 3):
                            beforeLetter = "_"
                            afterLetter = name[0:4]
                        else:
                            beforeLetter = name[i-4:i]

                    if (beforeLetter != ""):
                        beforeLetter = beforeLetter.lower()
                        afterLetter = afterLetter.lower()
                        if (beforeLetter in data[gender][ngram]):
                            if (afterLetter in data[gender][ngram][beforeLetter]):
                                data[gender][ngram][beforeLetter][afterLetter] += int(count)
                            else:
                                data[gender][ngram][beforeLetter][afterLetter] = int(count)
                        else:
                            data[gender][ngram][beforeLetter] = {}
                            data[gender][ngram][beforeLetter][afterLetter] = int(count)

        # divide counts by total sum to get frequency
        for gender in genderArray:
            for ngram in ngramArray:
                for beforeLetter in data[gender][ngram]:
                    afterLetterCountSum = sum(data[gender][ngram][beforeLetter].values())
                    for afterLetter, afterLetterCount in data[gender][ngram][beforeLetter].items():
                        afterLetterFrequency = round(afterLetterCount / afterLetterCountSum * 100, 4)
                        data[gender][ngram][beforeLetter][afterLetter] = afterLetterFrequency

    # print json data
    #print(json.dumps(data, sort_keys=True, indent=2))

    # write json data
    with open(fileOutput, 'w') as f:
        print("Writing: " + fileOutput)
        json.dump(data, f, sort_keys=True)

if __name__ == "__main__":
    # execute only if run as a script
    main()