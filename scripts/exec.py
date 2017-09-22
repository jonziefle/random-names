import os
import json
import process_names

def main():
    inputDir = '../data/baby-names/'
    outputDir = '../data/'

    #inputFiles = ['../data/baby-names/yob2016.txt']
    #outputFile = '../data/2016.json'
    #process_names.main(inputFiles, outputFile)

    yearList = {}
    count = 0
    for file in os.listdir(inputDir):
        if file.endswith('.txt'):
            if (count % 10 == 0):
                key = file.replace('yob', '').replace('.txt', '') + 's'
                yearList[key] = []

            yearList[key].append(inputDir + file)
            count += 1

    #print(json.dumps(data, sort_keys=True, indent=2))

    for year in yearList:
        process_names.main(yearList[year], outputDir + year + ".json")

if __name__ == "__main__":
    # execute only if run as a script
    main()
