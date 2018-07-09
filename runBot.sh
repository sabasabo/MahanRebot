git reset --hard
git pull
npm install
token=`tail -1 token.txt`
sed -i.bak 's/TOKEN/$token/g' app.js
rm app.js.bak
npm start &