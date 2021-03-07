function validateForm(form) {
    if (form.getValue('fullName') == null || form.getValue('fullName') == '') {
        throw i18n.translate("kit.aniversary.validation.fullName");
    }

    if (form.getValue('birthDay') == null || form.getValue('birthDay') == '') {
        throw i18n.translate("kit.aniversary.validation.birthDay");
    }

    if (form.getValue('birthMonth') == null || form.getValue('birthMonth') == '') {
        throw i18n.translate("kit.aniversary.validation.birthMonth");
    }

    if(form.getValue('birthDay') < 1 || form.getValue('birthDay') > 31){
        throw i18n.translate("kit.aniversary.validation.birthDayInvalid");
    }

    if(form.getValue('birthMonth') < 1 || form.getValue('birthMonth') > 12){
        throw i18n.translate("kit.aniversary.validation.birthMonthInvalid");
    }

    if(isNaN(form.getValue('birthDay'))){
        throw i18n.translate("kit.aniversary.validation.dayNaN");
    }

    if(isNaN(form.getValue('birthMonth'))){
        throw i18n.translate("kit.aniversary.validation.monthNaN");
    }
}
