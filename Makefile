.PHONY: compile clean

compile:
	pushd src; ../node_modules/.bin/tsc; popd
	./node_modules/.bin/node-sass public_html/scss -o public_html/css

clean:
	rm -rf public_html/js
	rm -rf public_html/css
