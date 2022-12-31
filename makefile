all: init run

init:
	sudo apt update
	sudo apt install ffmpeg -y

run:
	npm start

clean:
	rm -f *.html *.mp3