package com.fluig.kitintranet.parse.core.binder;

import java.io.InputStream;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import com.fluig.kitintranet.parse.core.annotation.WSBinderFieldSetter;
import com.fluig.kitintranet.parse.core.annotation.WSBinderObject;

public class AnnotationXMLBinder<T> extends DefaultHandler {
	private Logger log = LoggerFactory.getLogger(AnnotationXMLBinder.class);
	private StringBuffer tagContent;
	private Map<String, Method> setters;
	private String objectTag;
	private Class<T> klazz;
	private List<T> ret;
	private T current;
	
	public AnnotationXMLBinder(Class<T> klazz){
		this.klazz = klazz;
		this.objectTag = klazz.getAnnotation(WSBinderObject.class).tag();
		this.setters = new HashMap<String, Method>();
		this.tagContent = new StringBuffer();

		Method[] declaredMethods = klazz.getDeclaredMethods();

		for(Method method : declaredMethods) {
			WSBinderFieldSetter fieldSetter = method.getAnnotation(WSBinderFieldSetter.class);
			if(!(fieldSetter == null)){
				setters.put(fieldSetter.tag(), method);
			}
		}
	}

	public List<T> bind(InputStream is) {
		SAXParserFactory factory = SAXParserFactory.newInstance();
	    factory.setValidating(false);
	    factory.setNamespaceAware(false);
	    
	    ret = new ArrayList<T>();
	    try{
	    	SAXParser parser = factory.newSAXParser();
	    	parser.parse(is, this);
	    }catch(Exception e){
	    	e.printStackTrace();
	    }
	    
	    return ret;
	}
	
	@Override
	public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
		tagContent.delete(0, tagContent.length());
		if(qName.equals(objectTag)){
			try{
				current = klazz.newInstance();
			}catch(Exception e){
				e.printStackTrace();
			}
		}
	}

	@Override
	public void characters(char[] ch, int start, int length) throws SAXException {
		tagContent.append(ch,start,length);
	}

	@Override
	public void endElement(String uri, String localName, String qName) throws SAXException {
		if(qName.equals(objectTag)){
			ret.add(current);
			current = null;
		}else{
			Method method = setters.get(qName);
			if(!(method == null)){
				try{
					method.invoke(current, tagContent.toString().trim());
				}catch(Exception e){
					log.debug(e.getMessage());
				}
			}
		}
	}
}