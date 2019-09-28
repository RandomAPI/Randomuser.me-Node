# Randomuser.me-Node
[![Build Status](https://travis-ci.org/RandomAPI/Randomuser.me-Node.svg?branch=master)](https://travis-ci.org/RandomAPI/Randomuser.me-Node)
[![codecov](https://codecov.io/gh/RandomAPI/Randomuser.me-Node/branch/master/graph/badge.svg)](https://codecov.io/gh/RandomAPI/Randomuser.me-Node)

### About
This is the source code that powers the randomuser.me User Generator.

Our goal is to have a very diverse database that consists of data unique to different nationalities.
While some places might have an SSN or their phone number might be formatted a certain way, other places usually follow a completely different set of rules.

Help us make the Random User Generator better by contributing to our database and teaching us the proper way of formatting data for different nationalities.

### Guidelines
If you would like to help contribute data specific to a region, please keep these few rules in mind:

1. Only add new nat data to the `api/.nextRelease` directory...

2. Please keep all of the data organized.
    - Keep US data in the US directory, AU in the AU directory, etc.

3. No duplicates. Make sure that the data you are adding isn't already on the list.
    - An easy way to remove duplicates from your file and sort: 
```sh
sort -u <file> -o <file>
```

4\. Please don't submit requests that say "make this nationality". We will accept helpful contributions, but not orders :)

### Requirements

Node v9.0.0+
MongoDB

### How to use

1. Run `npm install`

2. Run `npm run build` to build views and minify js/css

3. Run `npm test` and verify all tests pass

4. Start the server with `npm start`

### What if I want to add a new nationality?
Go ahead! We will gladly accept new regions if they follow the guidelines above.
Just place your files in a new directory in the `api/.nextRelease/data` folder with the appropriate 2 letter ISO Country Code (http://countrycode.org). Follow the format of the US folder for reference.

### How to contact us
If you have any questions, feel free to ask us on our Twitter page [@randomapi](https://twitter.com/randomapi).
