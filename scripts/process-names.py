import csv
import json

data = {
    "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
}

nGrams = ["1gram", "2gram", "3gram", "4gram", "5gram"]

def main():
    fileInput = '../data/baby-names/yob2016.txt'
    fileOutput = '../data/2016-5gram.json'

    # open csv file
    with open(fileInput, newline='') as f:
        print("Processing: " + fileInput)
        reader = csv.reader(f)

        # initialize frequency list for the length of letters list
        for gender in ["male", "female"]:
            data[gender] = {}
            for distribution in nGrams:
                data[gender][distribution] = {}
                data[gender][distribution]["frequency"] = {}

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
                letterIndex = ord(name[i].lower()) - 97
                for distribution in nGrams:
                    letterKey = ""
                    if (distribution == "1gram"):
                        letterKey = "_"

                    elif (distribution == "2gram" and i >= 0):
                        if (i == 0):
                            letterKey = "_"
                        else:
                            letterKey = name[i - 1]

                    elif (distribution == "3gram" and i >= 1):
                        if (i == 1):
                            letterKey = "_" + name[i - 1]
                        else:
                            letterKey = name[i - 2] + name[i - 1]

                    elif (distribution == "4gram" and i >= 2):
                        if (i == 2):
                            letterKey = "_" + name[i - 2] + name[i - 1]
                        else:
                            letterKey = name[i - 3] + name[i - 2] + name[i - 1]

                    elif (distribution == "5gram" and i >= 3):
                        if (i == 3):
                            letterKey = "_" + name[i - 3] + name[i - 2] + name[i - 1]
                        else:
                            letterKey = name[i - 4] + name[i - 3] + name[i - 2] + name[i - 1]

                    if (letterKey != ""):
                        letterKey = letterKey.lower()
                        if letterKey in data[gender][distribution]["frequency"]:
                            data[gender][distribution]["frequency"][letterKey][letterIndex] += int(count)
                        else:
                            data[gender][distribution]["frequency"][letterKey] = [0] * len(data["letters"])
                            data[gender][distribution]["frequency"][letterKey][letterIndex] = int(count)

        # divide counts by total sum to get frequency
        for gender in ["male", "female"]:
            for distribution in nGrams:
                for letterKey in data[gender][distribution]["frequency"]:
                    countSum = sum(data[gender][distribution]["frequency"][letterKey])
                    for letterIndex, count in enumerate(data[gender][distribution]["frequency"][letterKey]):
                        if (count > 0):
                            frequency = round(count / countSum * 100, 3)
                        else:
                            frequency = 0
                        data[gender][distribution]["frequency"][letterKey][letterIndex] = frequency

    # print json data
    #print(json.dumps(data, sort_keys=True, indent=2))

    # write json data
    with open(fileOutput, 'w') as f:
        print("Writing: " + fileOutput)
        json.dump(data, f, sort_keys=True)

if __name__ == "__main__":
    # execute only if run as a script
    main()
