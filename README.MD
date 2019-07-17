# SponsorBlocker Server

SponsorBlocker is an extension that will skip over sponsored segments of YouTube videos. SponsorBlocker is a crowdsourced browser extension that let's anyone submit the start and end time's of sponsored segments of YouTube videos. Once one person submits this information, everyone else with this extension will skip right over the sponsored segment.

This is the server backend for it

# Server

This is a simple Sqlite database that will hold all the timing data.

To make sure that this project doesn't die, I have made the database publicly downloadable at https://sponsor.ajay.app/database.db. So, you can download a backup or get archive.org to take a backup if you do desire.

Hopefully this project can be combined with projects like [this](https://github.com/Sponsoff/sponsorship_remover) and use this data to create a neural network to predict when sponsored segments happen. That project is sadly abandoned now, so I have decided to attempt to revive this idea.

# Client

The client web browser extension is available here: https://github.com/ajayyy/SponsorBlocker