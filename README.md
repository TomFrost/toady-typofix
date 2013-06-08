#TypoFix
A Toady mod to fix typos by saying s/FIND/REPLACE/ after your message

##Install
Install into a [Toady](https://github.com/TomFrost/Toady) instance with:

    ./ribbit install typofix

##Instructions
TypoFix lets users correct typos in their messages by using the standard
regex replace syntax:

    s/FIND/REPLACE/

If Toady can't see anything to correct in a user's last message, it will
then check the last message said by any user in the channel and correct
that instead :)

##Credits
TypoFix was written by Tom Frost in 2013.
