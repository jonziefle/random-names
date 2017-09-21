import os
import json

def main():
    inputDir = '../data/baby-names'
    inputFiles = ['../data/baby-names/yob2016.txt','../data/baby-names/yob2015.txt']
    outputFile = '../data/2016.json'

    data = {}
    count = 0
    for file in os.listdir(inputDir):
        if file.endswith('.txt'):
            if (count % 10 == 0):
                key = file.replace('yob', '').replace('.txt', '') + 's'
                data[key] = []

            data[key].append(file)
            count += 1

    print(json.dumps(data, sort_keys=True, indent=2))

    #print(list(chunks(os.listdir(inputDir), 5)))

    #process_names.main(inputFiles, outputFile)

if __name__ == "__main__":
    # execute only if run as a script
    main()
