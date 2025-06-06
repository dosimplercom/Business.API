import { sys_language_enum } from "src/enums/language.enum";

export function getLanguageId(language: string): number {
    const id = sys_language_enum[language as keyof typeof sys_language_enum];
    if (id) return id;

    throw 'Language was not properly specified';
}