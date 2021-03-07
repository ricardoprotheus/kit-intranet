function validateForm(form) {
    var dayOfTheWeek = form.getValue('dayOfTheWeek');
    if (form.getValue('mealTitle') == null || form.getValue('mealTitle') == '') {
        throw i18n.translate("kit_cardapio.form.validation.mealTitle");
    }

    if (form.getValue('mealDesc') == null || form.getValue('mealDesc') == '') {
        throw i18n.translate("kit_cardapio.form.validation.mealDesc");
    }

    var constraint = DatasetFactory.createConstraint("dayOfTheWeek", dayOfTheWeek, dayOfTheWeek,
        ConstraintType.MUST);
    var constraintActive = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var dataset = DatasetFactory.getDataset("kit_cardapio", null, [constraint, constraintActive], ["id;desc"]);

    if (form.getFormMode() == 'ADD') {
        for (var i = 0; i < dataset.rowsCount; i++) {
            if (form.getDocumentId() != dataset.getValue(i, "metadata#id")) {
                throw i18n.translate("kit_cardapio.form.validation.dayOfTheWeek")
            }
        }
    } else if (form.getFormMode() == 'MOD') {
        for (var i = 0; i < dataset.rowsCount; i++) {
            if (form.getDocumentId() != dataset.getValue(i, "metadata#id") &&
                form.getValue('dayOfTheWeek') != dataset.getValue(i, "metadata#dayOfTheWeek")) {
                throw i18n.translate("kit_cardapio.form.validation.dayOfTheWeek")
            }
        }
    }

    form.setValue("metadata#dayOfTheWeek", dayOfTheWeek);
}
