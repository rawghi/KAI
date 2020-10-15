#! /bin/sh

echo "Tile Mover"

FILENUM="$1"    #64
FOLDERS="$2"    #32

FILEINDEX=0
FOLDERINDEX=0


while [ "$FOLDERINDEX" -lt "$FOLDERS" ] ; do 
    echo "Creating folder: $FOLDERINDEX"
    mkdir "$FOLDERINDEX"
    FILEINDEX=0
    for i in *.png ; do
        if [ "$FILEINDEX" -lt "$FILENUM" ]; then
            echo "Moving file: $i to folder $FOLDERINDEX/$FILEINDEX"
            mv "$i" "$FOLDERINDEX/$FILEINDEX.png"
        else
            break
        fi
        FILEINDEX=$(expr $FILEINDEX + 1)
        #echo "$INDEX"
    done
    FOLDERINDEX=$(expr $FOLDERINDEX + 1)
done 





