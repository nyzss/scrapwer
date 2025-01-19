import { scrape } from "jsr:@panha/scrape/";

let COUNT = 0;

const LIMIT = 1;
const URL = "https://www.royalroad.com";
const FICTION_NUMBER = "102061";

const scraper = await scrape(`${URL}/fiction/${FICTION_NUMBER}`);

const list = scraper
    .href("a")
    .filter((e) => e.startsWith("/fiction/" + FICTION_NUMBER))
    .map((e) => `${URL}${e}`);

const chapters = new Set<string>(list);

console.log(chapters);

for (const chapter of chapters) {
    if (COUNT++ >= LIMIT) {
        break;
    }

    const chapScraper = await scrape(chapter);

    const chapterContent = chapScraper.text("div.chapter-inner");
    console.log(chapterContent.join("\n"));
}
