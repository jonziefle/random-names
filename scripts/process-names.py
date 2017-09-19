import os
import sys
import csv
import json

letterArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
ngramArray = ["1gram", "2gram", "3gram", "4gram", "5gram"]
genderArray = ["male", "female"]
data = {}
dataWeighted = {}

def main():
    # parses command line for input file and output path
    if (len(sys.argv) != 3):
        print("ERROR: Please enter a input filename and output path.")
        sys.exit()
    elif (os.path.isfile(sys.argv[1]) != True):
        print("ERROR: Please enter a valid filename.")
        sys.exit()
    elif (os.path.isdir(sys.argv[2]) != True):
        print("ERROR: Please enter a valid output path.")
        sys.exit()
    else:
        fileInput = sys.argv[1]
        fileOutputName = os.path.splitext(os.path.basename(fileInput))[0]
        fileOutputDir = os.path.join(sys.argv[2], '')

    fileOutput = fileOutputDir + fileOutputName + "-unweighted.json"
    fileOutputWeighted = fileOutputDir + fileOutputName + "-weighted.json"

    # open csv file
    with open(fileInput, newline='') as f:
        print("Processing: " + fileInput)
        reader = csv.reader(f)

        # initialize frequency list for the length of letters list
        for gender in genderArray:
            data[gender] = {}
            dataWeighted[gender] = {}
            for ngram in ngramArray:
                data[gender][ngram] = {}
                dataWeighted[gender][ngram] = {}

        # add counts for each letter
        for row in reader:
            name = "_" + row[0].lower() + "_"
            if (row[1] == "M"):
                gender = "male"
            else:
                gender = "female"
            count = row[2]

            # iterate through letters and multiplies by the name count
            nameLength = len(name)
            for i in range(nameLength):
                for ngram in ngramArray:
                    beforeLetter = ""
                    if (ngram == "1gram" and name[i] != "_"):
                        beforeLetter = "_"
                        afterLetter = name[i]
                    elif (ngram == "2gram"):
                        gramLength = 2
                        if (i == 0):
                            beforeLetter = name[0:i+1]
                            afterLetter = name[i+1:gramLength]
                        elif (i >= gramLength):
                            beforeLetter = name[i-gramLength+1:i]
                            afterLetter = name[i]
                    elif (ngram == "3gram" and nameLength >= 3):
                        gramLength = 3
                        if (i == 0 or i == 1):
                            beforeLetter = name[0:i+1]
                            afterLetter = name[i+1:gramLength]
                        elif (i >= gramLength):
                            beforeLetter = name[i-gramLength+1:i]
                            afterLetter = name[i]
                    elif (ngram == "4gram" and nameLength >= 4):
                        gramLength = 4
                        if (i == 0 or i == 1):
                            beforeLetter = name[0:i+1]
                            afterLetter = name[i+1:gramLength]
                        elif (i >= gramLength):
                            beforeLetter = name[i-gramLength+1:i]
                            afterLetter = name[i]
                    elif (ngram == "5gram" and nameLength >= 5):
                        gramLength = 5
                        if (i == 0 or i == 1):
                            beforeLetter = name[0:i+1]
                            afterLetter = name[i+1:gramLength]
                        elif (i >= gramLength):
                            beforeLetter = name[i-gramLength+1:i]
                            afterLetter = name[i]

                    # increment letter count
                    if (beforeLetter != ""):
                        if (beforeLetter not in data[gender][ngram]):
                            data[gender][ngram][beforeLetter] = {}
                            dataWeighted[gender][ngram][beforeLetter] = {}

                        if (afterLetter not in data[gender][ngram][beforeLetter]):
                            data[gender][ngram][beforeLetter][afterLetter] = 0
                            dataWeighted[gender][ngram][beforeLetter][afterLetter] = 0

                        data[gender][ngram][beforeLetter][afterLetter] += 1
                        dataWeighted[gender][ngram][beforeLetter][afterLetter] += int(count)

        # divide counts by total sum to get frequency
        for gender in genderArray:
            for ngram in ngramArray:
                for beforeLetter in data[gender][ngram]:
                    afterLetterCountSum = sum(data[gender][ngram][beforeLetter].values())
                    for afterLetter, afterLetterCount in data[gender][ngram][beforeLetter].items():
                        afterLetterFrequency = round(afterLetterCount / afterLetterCountSum * 100, 4)
                        data[gender][ngram][beforeLetter][afterLetter] = afterLetterFrequency

                    afterLetterCountSum = sum(dataWeighted[gender][ngram][beforeLetter].values())
                    for afterLetter, afterLetterCount in dataWeighted[gender][ngram][beforeLetter].items():
                        afterLetterFrequency = round(afterLetterCount / afterLetterCountSum * 100, 4)
                        dataWeighted[gender][ngram][beforeLetter][afterLetter] = afterLetterFrequency

    # print json data
    #print(json.dumps(data, sort_keys=True, indent=2))
    #print(json.dumps(dataWeighted, sort_keys=True, indent=2))

    # write json data (unweighted)
    with open(fileOutput, 'w') as f:
        print("Writing: " + fileOutput)
        json.dump(data, f, sort_keys=True)

    # write json data (weighted)
    with open(fileOutputWeighted, 'w') as f:
        print("Writing: " + fileOutputWeighted)
        json.dump(dataWeighted, f, sort_keys=True)

if __name__ == "__main__":
    # execute only if run as a script
    main()
