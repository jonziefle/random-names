import os
import sys
import csv
import json
import argparse

# global variables
letterArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
ngramArray = ["1gram", "2gram", "3gram", "4gram", "5gram"]
genderArray = ["male", "female"]

def main(inputFiles, outputFile):
    outputFileUnweighted = os.path.splitext(outputFile)[0] + "-unweighted.json"
    outputFileWeighted = os.path.splitext(outputFile)[0] + "-weighted.json"

    # data objects
    data = {}
    dataWeighted = {}

    # initialize data object for gender and ngram
    for gender in genderArray:
        data[gender] = {}
        dataWeighted[gender] = {}
        for ngram in ngramArray:
            data[gender][ngram] = {}
            dataWeighted[gender][ngram] = {}

    # iterates through all files
    for inputFile in inputFiles:
        # open and process csv file
        with open(inputFile, newline='') as f:
            print("Processing: " + inputFile)
            reader = csv.reader(f)

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
    with open(outputFileUnweighted, 'w') as f:
        print("Writing: " + outputFileUnweighted)
        json.dump(data, f, sort_keys=True)

    # write json data (weighted)
    with open(outputFileWeighted, 'w') as f:
        print("Writing: " + outputFileWeighted)
        json.dump(dataWeighted, f, sort_keys=True)

if __name__ == "__main__":
    # parses command line for input file and output path
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', nargs='+', help='<Required> Input File(s)', required=True)
    parser.add_argument('--output', help='<Required> Output File', required=True)
    args = parser.parse_args()

    print(args)

    # execute only if run as a script
    main(args.input, args.output)
