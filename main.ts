import { scrape } from "jsr:@panha/scrape/";

const LIMIT = 1;
const URL = "https://www.royalroad.com";
const FICTION_NUMBER = "102061";

const scrapeChapters = async (
    chapters: string[] | Set<string>,
    limit: number = LIMIT
) => {
    let count = 0;
    for (const chapter of chapters) {
        if (count++ >= limit) {
            break;
        }
        await getChapter(chapter);
    }
};

const getChapter = async (chapter: string) => {
    const chapScraper = await scrape(chapter);

    const chapterContent = chapScraper.text("div.chapter-inner");
    console.log(chapterContent.join("\n"));
};

const scrapeById = async (id: string) => {
    const scraper = await scrape(`${URL}/fiction/${id}`);

    const list = scraper
        .href("a")
        .filter((e) => e.startsWith("/fiction/" + id))
        .map((e) => `${URL}${e}`);

    const chapters = new Set<string>(list);

    console.log(chapters);

    scrapeChapters(chapters);
};

scrapeById(FICTION_NUMBER);
