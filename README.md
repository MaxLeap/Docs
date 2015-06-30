# LAS Docs

These are the markdown sources for all of the [platform docs](https://leap.as/en_us/docs/overview.html) of LAS. The content for the docs is stored in this repo.

## Repository Structure

The docs are organized first by language, then by platform. Each platform directory contains a set of markdown files, one for each main section in the guide.

    .
    ├── {language}
    │   └── {platform}
    │   │   └── {section}
    │   └── common
    │       └── {section}
    ├── .gitignore
    ├── tokens.json
    └── README.md

For example, `/en/iOS/` contains all of sections for the iOS guide in English. You'll notice a `common` folder in each language. This folder contains content that is shared amongst all of the platforms. That helps us avoid duplicating content unnecessarily.

## How Do I Contribute?

If you have any fixes or suggestions, simply send us a pull request! The [documentation](https://leap.as/en_us/docs/overview.html) will be regenerated from master as needed.

## Can I Access The Docs Offline?

This repository is public and all the files are in markdown. If you'd like to keep a copy locally, please do!
