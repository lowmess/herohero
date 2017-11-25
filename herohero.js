#!/usr/bin/env node

const path = require('path')
const yargs = require('yargs')
const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')

const args = yargs
  .command('$0 <path> [options]', 'Generate social media hero images from HTML files', yargs => {
    // eslint-disable-line
    yargs.positional('path', {
      alias: 'p',
      describe: 'The relative path to the HTML file to capture',
      type: 'string',
    })
  })
  .option('output', {
    alias: 'o',
    default: 'heroes',
    describe: 'Relative path to output directory',
    type: 'string',
  })
  .help().argv

if (path.extname(args.path) !== '.html') {
  console.error('Please provide a path to an HTML file.')
  process.exit()
}

const networks = [
  {
    name: 'Facebook',
    width: 820,
    height: 312,
  },
  {
    name: 'Twitter',
    width: 1500,
    height: 500,
  },
  {
    name: 'LinkedIn',
    width: 1584,
    height: 396,
  },
  {
    name: 'GooglePlus',
    width: 1080,
    height: 608,
  },
  {
    name: 'YouTube',
    width: 2560,
    height: 1440,
  },
]

mkdirp(args.output, err => {
  if (err) {
    console.error(err)
    process.exit()
  }
})

networks.forEach(network => {
  ;(async () => {
    const browser = await puppeteer.launch({
      timeout: 60000,
    })
    const page = await browser.newPage()
    await page.setViewport({
      width: network.width,
      height: network.height,
    })
    await page.goto(`file://${path.resolve(process.cwd(), args.path)}`)
    await page.screenshot({
      path: `${path.resolve(process.cwd(), args.output)}/${network.name}.png`,
    })
    browser.close()
  })()
})

console.log(`Hero images are available at ${args.output}`)
