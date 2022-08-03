#!/opt/homebrew/bin/fish
echo "Original size: " (stat -f%z $argv)
set minified ( uglifyjs --compress --mangle -- $argv )
set escaped ( string escape $minified )
set encoded ( node -p "encodeURIComponent('$escaped')" )
set bookmarklet ( echo "javascript:(function(){;$encoded;})()" )
echo "Minified size: " (string length $bookmarklet)
echo $bookmarklet | pbcopy
echo "Copied to clipboard"