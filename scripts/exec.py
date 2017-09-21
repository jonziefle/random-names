import os
import process_names

inputFiles = ['../data/baby-names/yob2016.txt']
outputFile = '../data/2016.json'

'''
for file in os.listdir(inputDir):
    if file.endswith('.txt'):
        print(file)
'''

process_names.main(inputFiles, outputFile)
