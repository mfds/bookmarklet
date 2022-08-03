#!/opt/homebrew/bin/fish
echo "Original size: " (stat -f%z paypal_monthly.js)
set minified ( uglifyjs --compress --mangle -- paypal_monthly.js )
set escaped ( string escape $minified )
set encoded ( node -p "encodeURIComponent('$escaped')" )
set bookmarklet ( echo "javascript:(function(){;$encoded;})()" )
echo "Minified size: " (string length $bookmarklet)
echo $bookmarklet | pbcopy
echo "Copied to clipboard"