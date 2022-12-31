all: init run

init:
	sudo apt update
	sudo apt install ffmpeg -y
	npm i

run:
	npm start

clean:
	rm -f *.html *.mp3