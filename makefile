u = https://soundcloud.com/laytoofficial/ghost-town

all: init run

init:
	sudo apt update
	sudo apt install ffmpeg -y
	npm i

run:
	npm start $(u)

clean:
	rm -f *.html *.mp3