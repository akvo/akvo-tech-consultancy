cat getfigures.txt | grep Figure | grep '[0-9]: ' | cut -d ':' -f 1,2
