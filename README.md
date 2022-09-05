<a id="readme-top" name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Next-S3</h3>

  <p align="center">
    Deploy your static Next.js sites in one command
    <br />
    <a href="#getting-started"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/szalaybalazs/next-s3/issues">Report Bug</a>
    ·
    <a href="https://github.com/szalaybalazs/next-s3/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
    <a href="#usage">Usage</a>
      <ul>
        <li><a href="#parameters">Parameters</a></li>
        <li><a href="#examples">Examples</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

![Product Name Screen Shot](/assets/banner.png)

A tiny CLI tool to host any of your static next.js sites on AWS S3 and Cloudfront.

There are many great ways to host a Next.js app, especially vercel but there are times, when they are simply just overkill - and can even result in slower load times than a regular static site.

With that said, there are some pros and cons against hosting on S3;

**Pros:**

* There is no need for a server, your files will be hosted statically, which is simply faster.
* You can utilize Cloudfront's built-in GZipping, which will reduce your load times even more

**Cons:**

* Only static sites can be hosted on S3, with absolutely no SSR or ISG.
* You can not use any of Next's built-in API or middle-ware logic.
* A 3rd party image optimizer has to be used - or none at all.

I know there are other web frameworks, created for such type of hosting but let's be honest; working on a next.js project can't be compared DX-wise to any other production framework.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisit

**IMPORTANT:** This package uses the latest version of the [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html). Please make sure you are also [logged in with your AWS account](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).

### Installation
Using NPM

```shell
npm install --save-dev next-s3
```

or using yarn

```shell
yarn add -D next-s3
```

**Note:** It is recommended to install the page as a dev dependency.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Run the following command from inside your Next.js project:

```bash
next-s3 deploy --bucket <bucket-name> --distribution <cloudfront distribution id>
```

**Note:** I assume the package has been installed globally.

### Parameters

All the parameters available to use:

| Option             | Required | Description                                          | Default |
| ------------------ | :------: | ---------------------------------------------------- | :-----: |
| -b, --bucket       | Yes      | The name of the S3 bucket to be used.                | -       |
| -d, --distribution | No       | Cloudformation ID to be invaidated after deployment. | -       |
| -p, --basepath     | No       | Base path the site will be available under.          | '/'     |
| --manager          | No       | Package manager to be used to run commands.          | 'yarn'  |
| -v, --verbose      | No       | Enable verbose logging                               | false   |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Examples

Upload a site to an S3 bucket and Cloudfront:

```bash
next-s3 deploy --bucket <bucket-name> --distribution <cloudfront distribution id>
```

Upload a site to an S3 bucket and Cloudfront using a different profile:

```bash
next-s3 deploy --bucket <bucket-name> --distribution <cloudfront distribution id> --profile <profile>
```

Upload a site to an S3 bucket and Cloudfront using and host under the `/production` basepath:

```bash
next-s3 deploy --bucket <bucket-name> --distribution <cloudfront distribution id> --basepath "/production"
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Create initial version
- [ ] Add `dotenv^ support
- [ ] Add custom config options
- [ ] Create additional commands
    - [ ] Project scaffolding

See the [open issues](https://github.com/szalaybalazs/next-s3/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License
Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Balazs Szalay - [@szalayme](https://twitter.com/szalayme) - balazs@szalay.me

<p align="right">(<a href="#readme-top">back to top</a>)</p>
