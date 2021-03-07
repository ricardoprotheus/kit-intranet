package com.fluig.kitintranet.parse.core.binder;

import java.io.InputStream;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class BooleanBinder extends DefaultHandler {

	private StringBuffer tagContent = new StringBuffer();
	private String validQName;
	private boolean ret;
	
	public BooleanBinder(String validQName){
		this.validQName = validQName;
	}

	public boolean bind(InputStream xml) {
		SAXParserFactory factory = SAXParserFactory.newInstance();
	    factory.setValidating(false);
	    factory.setNamespaceAware(false);
	    
	    try{
	      SAXParser parser = factory.newSAXParser();
	      parser.parse(xml, this);
	    }catch(Exception e){
	      e.printStackTrace();
	    }
	    
	    return ret;
	}

	@Override
	public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
		tagContent.delete(0, tagContent.length());
	}

	@Override
	public void characters(char[] ch, int start, int length) throws SAXException {
		tagContent.append(ch,start,length);
	}

	@Override
	public void endElement(String uri, String localName, String qName) throws SAXException {
		if(qName.equals(this.validQName)){
			ret = tagContent.toString().equals("0");
		}
	}
}