# osu! Feed Listener 
# What is this?
* Deno script that listens to the global event feed in osu! (using apiv2)

# Why?
* When new medals get out, its a lot easier to see who got a medal first and aid in the finding of the solutions of medals

# Installation/Usage

## Requirements
* [Deno +1.33.0](https://deno.com/runtime)
* An OAuth application in osu! [you can make one here](https://osu.ppy.sh/home/account/edit) (callback url is not necessary)

## Using
* Clone this repo: `git clone https://github.com/EXtremeExploit/osuFeedListener`
* cd to it: `cd osuFeedListener`
* In the step below, replace `yourclientid` with your client's id and `verysecretclientsecret` with your client's secret
* If you want to, you can edit the code that runs when a medal is achieved in `index.ts`, its best to use vscode or an editor that supports typescript out of the box
* run `CLIENT_ID=yourclientid CLIENT_SECRET=verysecretclientsecret deno index.ts` in a terminal to run the script.