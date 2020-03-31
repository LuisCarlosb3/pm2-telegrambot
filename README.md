# TelegramBot for monitoring PM2
***
### Usage:
* Run *npm install* to install node dependeces
* Rename *env.example* for *.env* 
* Put your telegram bot token on **TOKEN** at .env file
* Run

>npm run start
or
>node index.js

### Bot commands available

|Command|Parameter|Required|
|:-----:|:-------:|:------:|
|<code>/start</code>|process|yes|
|<code>/restart</code>|process|yes|
|<code>/status</code>|process|no|
|<code>/shortstatus</code>|process|no|


