## Hanabi

This is our first attempt to make a webapp for hanabi.

### Quick start

Install [node.js](https://nodejs.org/en/) (I installed 5.3.0). Then:

```sh
git clone git@github.com:vortic/hanabi.git
cd hanabi
npm install typescript node-sass  # TODO: need to put this in package.json
make  # also should go into package.json
open public_html/index.html  # or your OS' equivalent command for "open"
```

### If using netbeans

Install the dependencies globally:

1. [node.js](https://nodejs.org/en/) (I installed 5.3.0)
2. [sass](http://sass-lang.com/install) (I used the command line for Mac)
3. install typescript: sudo npm install -g typescript
4. [netbeans typescript plugin](https://github.com/Everlaw/nbts/releases) (the nbm file)

To configure everything, open netbeans:

1. follow the [instructions](https://github.com/Everlaw/nbts#installation) to install the netbeans plugin (the text below the code tree)
2. open the netbeans preferences (either command + , or NetBeans -> Preferences)
    1. click the HTML/JS tab
    2. in CSS Preprocessors tab, set the Sass Path to "/usr/local/bin/sass"
    3. in the Node.js tab, set the Node Path to "/usr/local/bin/node" and the npm Path to "/usr/local/bin/npm"
3. open the hanabi project preferences (right click on the project -> preferences)
    1. in Sources, set the Site Root Folder to "public_html" (this should be set already, but just in case), Source to "src"
    2. in CSS Preprocessors, check the "compile Sass Files on Save" option, and make sure the input/output is "/scss" and "/css", respectively
    3. in JavaScript Frameworks, under TypeScript, check the "Compile on Save" option
