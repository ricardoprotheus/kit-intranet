function validateForm(form) {
    if (form.getValue('partner') == null || form.getValue('partner') == '') {
        throw i18n.translate("kit_convenios.validation.title");
    }

    if (form.getValue('partnerBenefits') == null || form.getValue('partnerBenefits') == '') {
        throw i18n.translate("kit_convenios.validation.benefits");
    }
}
