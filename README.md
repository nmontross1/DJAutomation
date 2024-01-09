# DJ-Automation

For educational purposes only.

I am a hobbyist DJ and one of the biggest challenges is acquiring a library of songs. There used to be a painstaking process where I would have to research data about a song on Tunebat, look it up on YouTube, and use a third-party YouTube Video -> MP3 converter. This process was time intensive and would ultimately just leave me frustrated that I had to obtain these files.

I wanted to design an application that does this for me. That way, I can spend more time practicing my skills versus building my song library. Thus, DJ-Automation was born! It is a CLI app running Node.js v20.10.0.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

## Features

- Allows user from the command line to search for a song.
- Retrieves song related data from Tunebat using the playwright library.
- Searches for the search on YouTube.
- Uses the `ytdl-mp3` library to download the song when the YouTube URL is passed in.
- Returns file to your `Downloads` folder.

## Getting Started

When opening the project, this command `node index.js "<search>"` allows a user from the command line to search for a single-song or `node index.js "<search1>" "<search2>"` for a multi-song search. Expected format for a single-song search `"<search>"`should be `"gorgon city voodoo extended mix"`. Expected format for a multi-song search `"gorgon city voodoo extended mix" "audien hindsight original mix"`.

### Prerequisites

- This project currently has 3 environment variables stored in the `.env` file. They will need to be populated in order to work. This file is ignored by git so you will need to create an `.env` file at the root of the project.
- You can reference the `.env.example` file to see the values of the .env excluding the YouTube API token.
- You will need a YouTube API token.

### Installation

- The project runs on `Node.js v20.10.0` so you will need to install that version or a newer one. 
- Please run `npm install` to install all necessary dependencies.

## Author
Nick Montross
