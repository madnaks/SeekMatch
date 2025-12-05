import { NonNullableFormBuilder, Validators } from "@angular/forms";

export function createLoginForm(fb: NonNullableFormBuilder) {
    return fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });
}