import csv
import json

data = {
    "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
}

def main():
    # open csv file
    fileInput = '../data/baby-names/yob2016.txt'
    with open(fileInput, newline='') as f:
        print("Processing: " + fileInput)
        reader = csv.reader(f)

        # initialize frequency list for the length of letters list
        for gender in ["male", "female"]:
            data[gender] = {}
            for distribution in ["monogram", "bigram"]:
                data[gender][distribution] = {}
                data[gender][distribution]["frequency"] = {}

                data[gender][distribution]["frequency"]["_"] = [0] * len(data["letters"])
                if (distribution == "bigram"):
                    for letter in data["letters"]:
                        data[gender][distribution]["frequency"][letter] = [0] * len(data["letters"])

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
                currentLetter = name[i].lower()
                currentLetterIndex = ord(currentLetter) - 97

                # monogram
                data[gender]["monogram"]["frequency"]["_"][currentLetterIndex] += int(count)

                # bigram
                if (i == 0):
                    firstLetter = "_"
                else:
                    firstLetter = name[i - 1].lower()
                data[gender]["bigram"]["frequency"][firstLetter][currentLetterIndex] += int(count)

        # divide counts by total sum to get frequency
        for gender in ["male", "female"]:
            for distribution in ["monogram", "bigram"]:
                for letter in data[gender][distribution]["frequency"]:
                    countSum = sum(data[gender][distribution]["frequency"][letter])
                    for index, count in enumerate(data[gender][distribution]["frequency"][letter]):
                        if (count > 0):
                            frequency = round(count / countSum * 100, 3)
                        else:
                            frequency = 0
                        data[gender][distribution]["frequency"][letter][index] = frequency

    # print json data
    #print(json.dumps(data, indent=2))

    # write json data
    fileOutput = '../data/2016.json'
    with open(fileOutput, 'w') as f:
        print("Writing: " + fileOutput)
        json.dump(data, f)

if __name__ == "__main__":
    # execute only if run as a script
    main()
