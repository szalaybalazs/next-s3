# Changelog

All notable changes to this project will be documented in this file.

## [0.0.14] - 2022-09-10

- Added limit logic to support larger projects

## [0.0.13] - 2022-09-06

- Added pre and post build scripts

## [0.0.11] - 2022-09-06

- Added env file parsing

## [0.0.10] - 2022-09-08

The first major release of the package; every aws related logic now uses the official `aws-sdk` node package, instead of the `aws-cli`

A new command has also been added; `upload` which only uploads the already built and exported project.

### Changed features

- Added `uplad` command to upload built package
- Switched to `aws-sdk` from `aws-cli`

## [0.0.9] - 2022-09-06

- Added cloudfront distribution

## [0.0.8] - 2022-09-05

- Initial release
