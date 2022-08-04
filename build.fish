#!/opt/homebrew/bin/fish
if test (count $argv) -ne 1
   echo "Wrong number of arguments"
   exit 1
end
echo "Original size: " (stat -f%z $argv)
set minified ( uglifyjs --compress --mangle -- $argv )
set escaped ( string escape $minified )
set encoded ( node -p "encodeURIComponent('$escaped')" )
set bookmarklet ( echo "javascript:(function(){;$encoded;})()" )
echo "Minified size: " (string length $bookmarklet)
echo $bookmarklet | pbcopy
echo "Copied to clipboard"