import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { BePasswordsMatchValidator, BePasswordValidator } from "@app/shared/validators/password-validator";

export function createChangePasswordForm(fb: FormBuilder) {
    return fb.group({
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, BePasswordValidator()]],
        confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { validators: BePasswordsMatchValidator('newPassword', 'confirmNewPassword') });
}