import csv
import json

data = {
    "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    "male": {
        "monogram": {
            "frequency": {
                "_": []
            }
        },
        "bigram": {
            "frequency": {
                "_": [],
                "a": [],
                "b": [],
                "c": [],
                "d": [],
                "e": [],
                "f": [],
                "g": [],
                "h": [],
                "i": [],
                "j": [],
                "k": [],
                "l": [],
                "m": [],
                "n": [],
                "o": [],
                "p": [],
                "q": [],
                "r": [],
                "s": [],
                "t": [],
                "u": [],
                "v": [],
                "w": [],
                "x": [],
                "y": [],
                "z": []
            }
        }
    },
    "female": {
        "monogram": {
            "frequency": {
                "_": []
            }
        },
        "bigram": {
            "frequency": {
                "_": [],
                "a": [],
                "b": [],
                "c": [],
                "d": [],
                "e": [],
                "f": [],
                "g": [],
                "h": [],
                "i": [],
                "j": [],
                "k": [],
                "l": [],
                "m": [],
                "n": [],
                "o": [],
                "p": [],
                "q": [],
                "r": [],
                "s": [],
                "t": [],
                "u": [],
                "v": [],
                "w": [],
                "x": [],
                "y": [],
                "z": []
            }
        }
    }
}

def main():
    # open csv file
    with open('../data/baby-names/yob2016.txt', newline='') as f:
        reader = csv.reader(f)

        # initialize frequency list for the length of letters list
        for letter in data["letters"]:
            for gender in ["male", "female"]:
                for distribution in ["monogram", "bigram"]:
                    for key, val in data[gender][distribution]["frequency"].items():
                        data[gender][distribution]["frequency"][key].append(0)

        print(json.dumps(data, indent=2))
        # add counts for each letter
        sum = 0
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
                sum += int(count)

                # bigram
                if (i == 0):
                    firstLetter = "_"
                else:
                    firstLetter = name[i - 1].lower()
                data[gender]["bigram"]["frequency"][firstLetter][currentLetterIndex] += int(count)

        # divide counts by total sum to get frequency
        for gender in ["male", "female"]:
            for index, count in enumerate(data[gender]["monogram"]["frequency"]["_"]):
                frequency = count / sum
                data[gender]["monogram"]["frequency"]["_"][index] = round(frequency, 4)

    # print json data
    print(json.dumps(data, indent=2))

    # write json data
    with open('../data/2016.json', 'w') as f:
        json.dump(data, f)

if __name__ == "__main__":
    # execute only if run as a script
    main()
