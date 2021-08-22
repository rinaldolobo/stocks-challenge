# Stocks Challenge (Live)

Connect to ws://stocks.hulqmedia.com/ websocket and show real time stock data.

![image](https://user-images.githubusercontent.com/17757930/130355727-464d84a5-1963-4229-b415-f3746b408da0.png)

# Running the app on local

1. Download or clone the repository.
2. Install dependencies using `npm install`
3. Run `ng serve`
4. Go to `http://localhost:4200/`

# Live Demo

http://live-stocks-app.000webhostapp.com/

# Please note

The app will not work if you load it over `https` instead of `http` because the websocket is using `ws` instead of `wss`, which means this will be a mixed content request which is blocked by most modern browsers.
This is also the reason why this repo is not hosted on github pages as it enforces `https` for default domains.
