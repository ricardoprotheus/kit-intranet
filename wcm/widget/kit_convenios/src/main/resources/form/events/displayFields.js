function displayFields(form, customHTML) {
    var partnerTitle = form.getValue('partner');
    partnerTitle = partnerTitle.replaceAll("\"", "'");
    form.setValue("partner", partnerTitle);

    var partnerBenefits = form.getValue('partnerBenefits');
    partnerBenefits = partnerBenefits.replaceAll("\"", "'");
    form.setValue("partnerBenefits", partnerBenefits);
}