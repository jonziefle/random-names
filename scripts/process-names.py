import csv
import json

data = {
    "letters": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    "male": {
        "monogram": {
            "frequency": {
                "_": []
            }
        }
    },
    "female": {
        "monogram": {
            "frequency": {
                "_": []
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
                data[gender]["monogram"]["frequency"]["_"].append(0)

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
                letter = name[i].lower()
                letterIndex = ord(letter) - 97

                # monogram
                data[gender]["monogram"]["frequency"]["_"][letterIndex] += int(count)
                sum += int(count)                    

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
