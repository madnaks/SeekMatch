import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";

export function createResetPasswordForm(fb: FormBuilder) {
    return fb.group({
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { validators: passwordsMatchValidator() });
}

export function passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const formGroup = control as FormGroup;

        const newPasswordCtrl = formGroup.get('newPassword');
        const confirmCtrl = formGroup.get('confirmNewPassword');

        if (!newPasswordCtrl || !confirmCtrl) {
            return null;
        }

        if (confirmCtrl.errors && !confirmCtrl.errors['mismatch']) {
            return null;
        }

        if (newPasswordCtrl.value !== confirmCtrl.value) {
            confirmCtrl.setErrors({ mismatch: true });
        } else {
            confirmCtrl.setErrors(null);
        }

        return null;
    };
}