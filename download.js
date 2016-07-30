#! /usr/bin/env node

const url = require('url')

const Nightmare = require('nightmare')
const vo = require('vo')

require('dotenv').config()

const signinUrl = 'https://www.gishwhes.com/signin.php'
const listUrl = 'https://www.gishwhes.com/items.php'

vo(function* () {
    var nightmare = Nightmare({ show: true })

    yield nightmare.viewport(1200, 800)

    yield nightmare
        .goto(signinUrl)
        .wait('input#username')
        .type('input#username', process.env.USERNAME)
        .type('input#password', process.env.PASSWORD)
        .click('input.action-button[name="login"]')
        .wait('.logged-in')

    var items = yield nightmare
        .goto(listUrl)
        .wait('.item-description')
        .evaluate(() => {
            var $items= $('.item-row')
            var _items = []

            $items.each(function() {
                var $this = $(this)
                _items.push([
                    $this.find('div .item-number').text().trim().substr(1),
                    $this.find('div .item-status').attr('src').replace('images/item-icons/', '').replace('.png', '').replace('-', '/'),
                    $this.find('div .item-points').text().trim().replace(' POINTS', ''),
                    $this.find('div .item-description').text().trim().replace('\t', '    ')
                ])
            })

            return _items
        })

    items.unshift(['Number', 'Type', 'Points', 'Description'])

    items.forEach(item => {
        console.log(item.join('\t'))
    })


    yield nightmare.run(console.log)
    yield nightmare.end()

})(console.log)
