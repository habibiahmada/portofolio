/**
 * Simple translation utility using Google Translate's public endpoint.
 * Note: For high volume, a paid API key from Google Cloud is recommended.
 */

export async function translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = "auto"
): Promise<string> {
    if (!text || !targetLanguage) return text;
    if (targetLanguage === sourceLanguage) return text;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url);
        if (!response.ok) {
            console.error("Translation API error:", response.statusText);
            return text;
        }

        const json = await response.json();

        // Google Translate single 't' result structure is: [[["translated_text", "original_text", ...], ...], ...]
        if (json && json[0] && Array.isArray(json[0])) {
            return (json[0] as string[][]).map((item) => item[0]).join("");
        }

        return text;
    } catch (error) {
        console.error("Translation error:", error);
        return text;
    }
}

/**
 * Translates an object of strings.
 */
export async function translateObject<T extends object>(
    obj: T,
    targetLanguage: string,
    sourceLanguage: string = "auto",
    keysToTranslate: (keyof T)[]
): Promise<T> {
    const translated = { ...obj };

    for (const key of keysToTranslate) {
        const original = obj[key];
        if (typeof original === "string" && original.trim()) {
            translated[key] = (await translateText(original, targetLanguage, sourceLanguage)) as T[keyof T];
        } else if (Array.isArray(original)) {
            // Handle array of strings (like 'bullets')
            translated[key] = (await Promise.all(
                (original as unknown[]).map((item) =>
                    typeof item === "string" ? translateText(item, targetLanguage, sourceLanguage) : item
                )
            )) as T[keyof T];
        }
    }

    return translated;
}
