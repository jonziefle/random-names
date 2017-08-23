import csv
import json

letterArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
data = {}

nGrams = ["monogram", "bigram", "trigram", "quadgram", "quintgram"]

def main():
    fileInput = '../data/baby-names/yob2016.txt'
    fileOutput = '../data/2016a-quintgram.json'

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
                letterKey = ""
                for distribution in nGrams:
                    if (distribution == "monogram"):
                        letterKey = name[i].lower()

                    elif (distribution == "bigram" and i >= 0):
                        if (i == 0):
                            letterKey = "_" + name[i]
                        else:
                            letterKey = name[i - 1] + name[i]

                    elif (distribution == "trigram" and i >= 1):
                        if (i == 1):
                            letterKey = "_" + name[i - 1] + name[i]
                        else:
                            letterKey = name[i - 2] + name[i - 1] + name[i]

                    elif (distribution == "quadgram" and i >= 2):
                        if (i == 2):
                            letterKey = "_" + name[i - 2] + name[i - 1] + name[i]
                        else:
                            letterKey = name[i - 3] + name[i - 2] + name[i - 1] + name[i]

                    elif (distribution == "quintgram" and i >= 3):
                        if (i == 3):
                            letterKey = "_" + name[i - 3] + name[i - 2] + name[i - 1] + name[i]
                        else:
                            letterKey = name[i - 4] + name[i - 3] + name[i - 2] + name[i - 1] + name[i]

                    letterKey = letterKey.lower()
                    if letterKey in data[gender][distribution]["frequency"]:
                        data[gender][distribution]["frequency"][letterKey] += int(count)
                    else:
                        data[gender][distribution]["frequency"][letterKey] = int(count)

        # divide counts by total sum to get frequency
        '''
        for gender in ["male", "female"]:
            for distribution in ["monogram", "bigram", "trigram"]:
                countSum = sum(data[gender][distribution]["frequency"].values())
                for letter, count in data[gender][distribution]["frequency"].items():
                    if (count > 0):
                        frequency = round(count / countSum * 100, 3)
                    else:
                        frequency = 0
                    data[gender][distribution]["frequency"][letter] = frequency
        '''
    # print json data
    #print(json.dumps(data, sort_keys=True, indent=2))

    # write json data
    with open(fileOutput, 'w') as f:
        print("Writing: " + fileOutput)
        json.dump(data, f, sort_keys=True)

if __name__ == "__main__":
    # execute only if run as a script
    main()
