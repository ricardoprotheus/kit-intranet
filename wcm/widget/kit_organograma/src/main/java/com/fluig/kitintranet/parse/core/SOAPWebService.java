package com.fluig.kitintranet.parse.core;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.Base64;

import com.fluig.kitintranet.parse.model.ParameterVO;

public class SOAPWebService {
	private static final String SERVICE = "/wsDataServer/IwsDataServer";
	public static InputStream call(ParameterVO parameter) 
			throws MalformedURLException, IOException {
		
		String soap =
			"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
				"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tot=\"http://www.totvs.com/\">\n" +
                "   <soapenv:Header/>\n" +
                "   <soapenv:Body>\n" +
                "      <tot:ReadView>\n" +
                "           <tot:DataServerName>" + parameter.getType() + "</tot:DataServerName>\n" +
                "           <tot:Filtro><![CDATA[" + parameter.getFilter() + "]]></tot:Filtro>\n" +
                "           <tot:Contexto>" + parameter.getContext() + "</tot:Contexto>\n" +
                "      </tot:ReadView>\n" +
                "   </soapenv:Body>\n" +
                "</soapenv:Envelope>";

		String decodedURL = URLDecoder.decode(parameter.getUrl(), "UTF-8");
		URL url = new URL(decodedURL + SERVICE);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setDoOutput(true);
		con.setDoInput(true);
		String userPassword = parameter.getUser() + ":" + parameter.getPassword();
		String encoding = Base64.getEncoder().encodeToString(userPassword.getBytes());
		byte[] msg = soap.getBytes();
		con.setRequestProperty("Authorization", "Basic " + encoding);
		con.setRequestProperty("Content-Length", Integer.toString(msg.length));
		con.setRequestProperty("SOAPAction", "http://www.totvs.com/IwsDataServer/ReadView");
		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type", "text/xml; charset=UTF-8");
		con.connect();
		con.getOutputStream().write(msg);
		con.getOutputStream().flush();
		con.getOutputStream().close();
		return con.getInputStream();
	}
}