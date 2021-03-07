package com.fluig;

import javax.ejb.Singleton;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fluig.sdk.api.component.activation.ActivationEvent;
import com.fluig.sdk.api.component.activation.ActivationListener;
import com.fluig.sdk.api.workflow.CardIndexVO;

@Singleton(mappedName = "activator/kit_convenios", name = "activator/kit_convenios")
public class Activate implements ActivationListener {

    private static final String LANGUAGE = FormUtils.LOCALE_PT_BR;

    private static Logger log = LoggerFactory.getLogger(Activate.class);
    private FormUtils formUtils;

    @Override
    public String getArtifactFileName() throws Exception {
        return "wcm-widget-convenios.war";
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void install(ActivationEvent event) throws Exception {
        formUtils = new FormUtils(getArtifactFileName());

        CardIndexCreator cardIndexCreator = new CardIndexCreator();
        CardIndexVO cardIndexVO = cardIndexCreator.createCardIndex(getArtifactFileName(), LANGUAGE);

        if(cardIndexVO != null){
            System.out.println("Iniciando criação de fichas.");
            formUtils.createRecords(cardIndexVO, LANGUAGE);
        } else {
            System.out.println("Fichas não serão criadas.");
        }

    }

    @Override
    public void disable(ActivationEvent evt) throws Exception {
    }

    @Override
    public void enable(ActivationEvent evt) throws Exception {
    }

}
