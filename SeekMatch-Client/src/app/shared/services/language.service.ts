import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    private readonly languageStorageKey = 'language';

    public getBrowserLanguageCode(): string {
        const userLanguage = navigator.language || navigator.languages[0];
        return userLanguage.split('-')[0];
    }

    public getCurrentLanguageCode(): string {
        return this.getSavedLanguageCode() || this.getBrowserLanguageCode();
    }

    public getSavedLanguageCode(): string | null {
        return localStorage.getItem(this.languageStorageKey);
    }

    public saveLanguageCode(language: string): void {
        localStorage.setItem(this.languageStorageKey, language);
    }

}
