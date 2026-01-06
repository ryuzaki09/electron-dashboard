# Dashboard App

This app template includes:

- Electron
- React
- Typescript
- Express
- Jest
- React Testing Library

### Purpose

I wanted a custom dashboard that I had full control over, a simple yet provides the essential controls for what I need it to do. It has a menu nav to navigate to these different screens:

- Home: shows the time and weather
- Music: plays mp3 audio directly to the connected speaker.
- Video: plays videos with full screen ability.
- Home Assistant: controls lights and switches.

Note: Because this is for a touchscreen, this has been developed and tested for a fixed screen size of 1024x600 that I was using. There is not really much responsiveness if using different screen sizes.

#### Prerequisites

1. Weather information - it is using the [Openweathermap](https://openweathermap.org/) API, so a key is required.
2. Additionally, the location coordinates is also required in this file `src/config/config.ts` with the info below

```
export const coords = {
  country: 'GB',
  lat: 123432
  lon: 0.3243434,
  name: 'Town',
  zip: 'post/zip code'
}
```

you can get the coordinates on this [page](https://openweathermap.org/api/geocoding-api) and make the API `http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}`

3. Home Assistant - A long live token is required. Enter the `HA_HOST=<HOST_IP>` and `HA_LONG_LIVE_TOKEN=<TOKEN>` in the `src/config/.env` file.

### Still in development

Local voice assistant is currently still in development. It uses a locally running AI host with Open Web UI, and a Whisper (speech-to-text) host to run.
Soon it will be able to:

- add timers
- tell the weather
- answer general questions

It currently has the ability to connect to openai and use it get weather information and answer general questions.

### Setup

#### On Raspberry Pi

The app plays music in the `music` folder and videos in the `video` folder at the home directory under media folder e.g `$HOME/media/music` and `$HOME/media/video`. 

If you have these media on a NAS for example, a good option is to mount these folders so they don't need to be moved or copied and then symlink them using:
```
ln -s <source_folder> ~/media
```

There is also an option to use a separate Backend Service to fetch the music, by setting in the `.env` file with `USE_EXTERNAL_BACKEND=true` and specify the `BACKEND_API_URL=http://<host_ip>:<port>` then it will fetch from there.

To run the app on your local machine, enter:

```
npm run dev
```


### Deploy to Raspberry Pi

#### Installation

I have tested on Raspberry Pi 3B using the 32bit Bullseye OS.
I have also tested on Raspberry Pi 4 using 64bit OS.

On fresh setup, perform these actions:
```
sudo apt update
sudo apt upgrade
sudo apt install --no-install-recommends \
  xserver-xorg \
  x11-xserver-utils \
  xinit \
  openbox \
  xorg \
  chromium-browser
```

Ensure nodejs is installed on the Raspberry Pi is installed using `nvm` or `fnm` because you need a version of at least `v18` for nodejs.

Ensure the Raspberry Pi is setup to Auto Login via the `raspi-config`, by going to `System Options` then `Boot / Auto Login` and select `Desktop Autologin`. You might need to install `lightdm` first so ensure that is installed also via `sudo apt install lightdm`.

#### Running as a service

To auto start an run as a service, you must first determine the path of `node`.
Run `which node` to get the file path, you will need this later.
my example: `/run/user/1000/fnm_multishells/1066_1744449316744/bin/node`.
Also run `echo $PATH`, you will need the output of this also.

create a service file via 
```
sudo nano /etc/systemd/system/dashyb.service 
```
and add this in the file:
```
[Unit]
Description=DashyB Electron App
After=graphical.target
Requires=graphical.target

[Service]
Environment=PATH=/run/user/1000/fnm_multishells/746_1744448951417/bin:/home/pi/.local/share/fnm:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/games:/usr/games
Environment=DISPLAY=:0
Environment=XAUTHORITY=/home/pi/.Xauthority
EnvironmentFile=/opt/DashyB/resources/.env
Type=simple
ExecStartPre=/bin/sleep 10
ExecStart=/opt/DashyB/dashyb
Restart=always
User=pi
WorkingDirectory=/opt/DashyB/resources
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=graphical.target
```
Notice the line `Environment=PATH...`, replace this line with the path of your `node` version stripping out the `/node` at the end and prefix to the output of your `$PATH` output.

#### Deploy the app

To deploy the app to a Raspberry Pi 32bit OS, run
```
npm run build:pi
```

For 64bit Raspberry Pi, run:
```
npm run build:pi64
```

this will compile and bundle the app and finally package it into a `.deb` file.

The next step, there is a `deploy.sh.sample` file, simply do 
```
cp deploy.sh.sample deploy.sh
```
edit this file with
```
sudo nano deploy.sh
```
In the file simply replace the `REMOTE_USER`, `REMOTE_HOST` and `DEB_FILE` with the username to ssh to the pi, the IP address of the pi and the name of the packaged `.deb` file respectively.

Finally run the file the following to deploy.
```
bash deploy.sh
```
This will copy the deb file and unpackage and finally reboot the pi. You may need to enter your ssh password if you have not added your ssh key.


### Troublshooting
If you see the app not running on your Pi, ssh to your Pi and try manually run `sudo dpkg -i *.deb` and see if it shows any errors. Usually it's missing packages that might have been missed.
