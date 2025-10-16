import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    public getBrowserLanguageCode(): string {
        const userLanguage = navigator.language || navigator.languages[0];
        return userLanguage.split('-')[0];
    }

}
