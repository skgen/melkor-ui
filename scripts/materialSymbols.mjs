import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
    args: [
        '--disable-setuid-sandbox',
        '--start-maximized'
    ],
    args: [],
    defaultViewport: null,
    'ignoreHTTPSErrors': true
});

const  page = await browser.newPage();

await page.goto('https://fonts.google.com/icons?icon.set=Material+Symbols', {
    waitUntil: 'domcontentloaded',
});

async function crawl(page) {
    return await page.evaluate(async () => {
        return await new Promise(resolve => {
            setTimeout(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, scrollHeight);
                setTimeout(() => {
                    const d = document;
                    function camelCase(str) {
                        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
                            return index === 0 ? word.toLowerCase() : word.toUpperCase();
                        }).replace(/\s+/g, '');
                    }
                    const qsa = (s,q) => [...(q || d).querySelectorAll(s)];
                    const qs = (s,q) => (q || d).querySelector(s);
                    const groups = qsa('icons-group');
                    const data = {};
                    let counter = 0;
                    for(const g of groups) {
                        const title = qs('.group-title', g).textContent;
                        const icons = qsa('.icon-asset span', g);
                        const e = [];
                        for(i of icons) {
                            if(!e.includes(i.textContent)) {
                                e.push(i.textContent);
                                counter += 1;
                            }
                        }
                        data[camelCase(title)] = e;
                    }
                    resolve({
                        counter,
                        data
                    });
                }, 1000);
            }, 1000);
        });
    });
}

const { data, counter } = await crawl(page);

const file = fileURLToPath(new URL('../src/__generated__/material-symbols.json', import.meta.url));
fs.writeFileSync(file, JSON.stringify(data, null, 0));
console.log(`${counter} icons registered`);