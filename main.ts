import { scrape } from "jsr:@panha/scrape/";

const LIMIT = 1; // number of chapters to scrape from the novel
const URL = "https://www.royalroad.com";
const FICTION_NUMBER = "102061"; // fiction id of royalroad novel (you can find it in the url)
const DELAY = 500; // time between requests in ms

await Deno.mkdir(FICTION_NUMBER, { recursive: true });

const scrapeChapters = async (
    chapters: string[] | Set<string>,
    limit: number = LIMIT
) => {
    let count = 0;
    for (const chapter of chapters) {
        if (count++ >= limit) {
            break;
        }
        await getChapter(chapter, count);
        await new Promise((resolve) => setTimeout(resolve, DELAY));
    }
};

const getChapter = async (chapter: string, id: number) => {
    const chapScraper = await scrape(chapter);

    const rawChapter = chapScraper.text("div.chapter-inner");
    const content = rawChapter.join("\r\n");

    await Deno.writeTextFile(`./${FICTION_NUMBER}/chapter-${id}.txt`, content);
};

const scrapeById = async (id: string, limit: number = LIMIT) => {
    const scraper = await scrape(`${URL}/fiction/${id}`);

    const list = scraper
        .href("a")
        .filter((e) => e.startsWith("/fiction/" + id))
        .map((e) => `${URL}${e}`);

    const chapters = new Set<string>(list);

    console.log(chapters);

    await scrapeChapters(chapters, limit);
};

await scrapeById(FICTION_NUMBER, 5);
