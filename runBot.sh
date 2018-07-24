git reset --hard
git pull
npm install
sed -i.bak "s/TOKEN/`tail -1 token.txt`/g" app.ts
rm app.ts.bak
npm start



# npm start &
# process=`echo $!`
# echo "killing a"
# kill -p $process


##!/bin/bash
#
#while true; do
#	if [ git remote update && git status -uno ]; then
#		
#		git reset --hard
#		git pull
#		npm install
#	
#		token=`tail -1 token.txt`
#		sed -i.bak 's/TOKEN/$token/g' app.ts
#		npm start &
#	fi
#	sleep 300
#done