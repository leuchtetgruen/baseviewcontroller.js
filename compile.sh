cat basemodel.js > baseviewcontroller.full.js
cat baseview.js >> baseviewcontroller.full.js
cat baseviewcontroller.js >> baseviewcontroller.full.js
cat views/*.js >> baseviewcontroller.full.js
jsmin < baseviewcontroller.full.js > baseviewcontroller.full.min.js

