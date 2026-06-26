import fs from "fs";

export function generateMapping() {
    const map = {};

    // 英字
    const letters = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < letters.length; i++) {
        map[letters[i]] = String(i + 1).padStart(4, "0");
    }

    // 数字
    for (let i = 0; i < 10; i++) {
        map[String(i)] = String(100 + i).padStart(4, "0");
    }

    // ひらがな
    const hira = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
    for (let i = 0; i < hira.length; i++) {
        map[hira[i]] = String(200 + i).padStart(4, "0");
    }

    // カタカナ
    const kata = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    for (let i = 0; i < kata.length; i++) {
        map[kata[i]] = String(300 + i).padStart(4, "0");
    }

    // CJK 漢字（例として100文字）
    const kanji = "日一国会人年大十二本中長出三同時政事自社月分議後前生東間部";
    for (let i = 0; i < kanji.length; i++) {
        map[kanji[i]] = String(400 + i).padStart(4, "0");
    }

    return map;
}

export function generateMappingText() {
    const map = generateMapping();
    return Object.entries(map)
        .map(([char, code]) => `${char}=${code}`)
        .join("\n");
}
