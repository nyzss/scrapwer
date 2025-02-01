import { DOMParser } from "jsr:@b-fuze/deno-dom@~0.1.48";
import { Readability } from "npm:@mozilla/readability";

const data = await fetch(
    "https://www.royalroad.com/fiction/102061/dao-of-healing-transmigration-healer-xianxia/chapter/1985731/chapter-1"
);

const html = await data.text();
const document = new DOMParser().parseFromString(html, "text/html");

const reader = new Readability(document);

const parsed = reader.parse();

console.log(parsed);

const metadata = {
    title: parsed?.title,
    siteName: parsed?.siteName,
    length: parsed?.length,
    excerpt: parsed?.excerpt,
    lang: parsed?.lang,
    byline: parsed?.byline,
    dir: parsed?.dir,
    publishedTime: parsed?.publishedTime,
};

const DIRECTORY = "./reader";
const ID = "chapter-1";
const OUTPUT = `${DIRECTORY}/${ID}`;

await Deno.mkdir(OUTPUT, { recursive: true });
const createFiles = async () => {
    try {
        await Deno.writeTextFile(
            `${OUTPUT}/chapter-1.html`,
            parsed?.content || ""
        );

        await Deno.writeTextFile(
            `${OUTPUT}/metadata.json`,
            JSON.stringify(metadata, null, 4)
        );
    } catch (error) {
        console.log("Error has occurred");
        console.error(error);
    }
};
await createFiles();
