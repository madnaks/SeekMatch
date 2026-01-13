import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BePasswordsMatchValidator, BePasswordValidator } from "@app/shared/validators/password-validator";

export function createRegisterForm(fb: FormBuilder): FormGroup {
    return fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, BePasswordValidator()]],
        confirmPassword: ['', Validators.required]
    }, { validators: BePasswordsMatchValidator() });
}