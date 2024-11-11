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
        for (const emoji of list[category]) {
            const item = document.createElement("button");
            item.className = "item";
            item.style.backgroundImage = `url("https://gh.vercte.net/forumoji/assets/emoji/15x15/${emoji}.png")`;
            item.setAttribute("onclick", `select("${emoji}")`);
            document.getElementById(id).appendChild(item);
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

    console.log(EmojiList);
    console.log(UnicodeList);
    console.log(HiddenEmoji);

    for (const collection of UnicodeList.contents) {
        const category = collection.category;
        if (category == "Component") continue;
        for (const subcollection of collection.contents) {
            for (const emoji of subcollection.contents) {
                const codepoint = normalizeCodepoint(emoji.codepoint);
                if (EmojiList.hasOwnProperty(codepoint)) {
                    if(!toReturn[category]) toReturn[category] = [];
                    toReturn[category].push(codepoint);
                }
            }
        }
    }
    return toReturn;
}