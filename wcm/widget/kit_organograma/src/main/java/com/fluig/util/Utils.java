package com.fluig.util;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

public class Utils {
	public static String bytesToString(InputStream is) throws IOException{
		StringBuilder xml = new StringBuilder();
		byte[] buf = new byte[10000000];
		int bytesRead = is.read(buf);
		while (bytesRead != -1) {
			String line = new String(buf, 0, bytesRead);
			xml.append(line);
			bytesRead = is.read(buf);
		}
		return normalizeResult(xml.toString().split("<s:Body>")[1].split("</s:Body>")[0]);
	}
	
	public static String bytesToString(HttpURLConnection con) throws IOException{
		String response = null;
		StringBuilder xml = new StringBuilder();
		byte[] buf = new byte[10000000];
		int bytesRead = con.getInputStream().read(buf);
		while (bytesRead != -1) {
			String line = new String(buf, 0, bytesRead);
			xml.append(line);
			bytesRead = con.getInputStream().read(buf);
		}
		String result = normalizeResult(xml.toString().split("<s:Body>")[1].split("</s:Body>")[0]);
		try {
			JSONObject xmlJSONObj = XML.toJSONObject(result);
			response = xmlJSONObj.toString();
		} catch (JSONException je) {
			je.printStackTrace();
		}
		return response;
	}
	
	public static <T> String objectToJSON(T param) 
			throws JsonGenerationException, JsonMappingException, IOException{
		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(param);
	}

	private static String normalizeResult(String s) {
        String result = s;
        result = result.replace("xmlns=\"http://www.totvs.com/\"", "");
        result = result.replace("&lt;", "<");
        result = result.replace("&gt;", ">");
        result = result.replace("&#xD;", "");
        result = result.replace("<![CDATA[", "");
        result = result.replace("]]>", "");
        return result;
    }
	
	public static String buildSoapEnvelope(String dataServerName, String filter, String context) {
        return "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tot=\"http://www.totvs.com/\">\n" +
                "   <soapenv:Header/>\n" +
                "   <soapenv:Body>\n" +
                "      <tot:ReadView>\n" +
                "           <tot:DataServerName>" + dataServerName + "</tot:DataServerName>\n" +
                "           <tot:Filtro><![CDATA[" + filter + "]]></tot:Filtro>\n" +
                "           <tot:Contexto>" + context + "</tot:Contexto>\n" +
                "      </tot:ReadView>\n" +
                "   </soapenv:Body>\n" +
                "</soapenv:Envelope>";
    }
}
