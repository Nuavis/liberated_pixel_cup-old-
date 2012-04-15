import os
import re

#Get list of all files in this directory
fis = os.listdir("./")

#Take out any that aren't images (pngs)
nfi = []
for fi in fis:
    if (fi.split(".")[1] == "png"):
        nfi.append("\"{}\"".format(fi))

#Print a list of all the images
newlist = ",".join(nfi)

#Open assets.js and change the assetList

assets = open("assets.js",'r')
string = re.sub(r'assetList : \[[^]]*\]',"assetList : [{}]".format(newlist),assets.read())
assets.close()
print string
assets = open('assets.js','w')
assets.write(string)
assets.close()

