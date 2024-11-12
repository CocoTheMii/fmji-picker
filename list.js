const CategoryIds = {
    "Smileys & Emotion": "se",
    "People & Body": "pb",
    "Animals & Nature": "an",
    "Food & Drink": "fd",
    "Travel & Places": "tp",
    "Activities": "a",
    "Objects": "o",
    "Symbols": "s",
    "Flags": "f"
}

function populate(list) {
    for (const category in CategoryIds) {
        const id = CategoryIds[category];
        const section = document.getElementById(id);
        for (const emoji of list[category]) {
            const name = emoji["name"];
            const codepoint = emoji["codepoint"];
            const item = document.createElement("button");

            item.className = "item";
            item.title = name;
            item.style.backgroundImage = `url("https://gh.vercte.net/forumoji/assets/emoji/15x15/${codepoint}.png")`;
            item.setAttribute("onclick", `select("${codepoint}")`);

            section.appendChild(item);
        }
    }
}

function normalizeCodepoint(codepoint) {
    const unspaced = codepoint.split(" ");
    const joined = unspaced.join("-");
    const withoutPrefix = joined.replace(/U\+/g, "");
    return withoutPrefix.toLowerCase();
}

async function getEmojiList() {
    const toReturn = {};
    //TODO: ideally get these from the forumoji repository instead
    const EmojiList = await (await fetch("assets/emoji.json")).json();
    const UnicodeList = await (await fetch("assets/unicode-emoji.json")).json();
    const HiddenEmoji = await (await fetch("assets/hidden-emoji.json")).json();

    for (const collection of UnicodeList.contents) {
        const category = collection.category;
        if (category == "Component") continue;
        for (const subcollection of collection.contents) {
            for (const emoji of subcollection.contents) {
                const name = emoji.name;
                const codepoint = normalizeCodepoint(emoji.codepoint);

                if (EmojiList.hasOwnProperty(codepoint) && !(HiddenEmoji.hasOwnProperty(codepoint))) {
                    if(!toReturn[category]) toReturn[category] = [];
                    toReturn[category].push({name, codepoint});
                }
            }
        }
    }
    return toReturn;
}