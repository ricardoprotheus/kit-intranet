package com.fluig.kitintranet.proxy;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
public class FuncUtil {

    public static final String METHOD = "/wsDataServer/IwsDataServer";
    public static final int SQL = 1;
    public static final int ORACLE = 2;

    @SuppressWarnings("unchecked")
    public List<String> listBirthDayFunc(String month, String serviceUrl, String user, String password) {
        if (BirthdayProxy.DEBUG_MODE) {
            System.out.println("FuncUtil.listBirthDayFunc called ***********");
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map = getConnection(SQL, month, serviceUrl, user, password);

        if (map.get("status").equals("999")) {
            map = getConnection(ORACLE, month, serviceUrl, user, password);
        }

        if (BirthdayProxy.DEBUG_MODE) {
            System.out.println("Connection Map Size: " + map.size());
        }

        List<String> resultList = new ArrayList<String>();

        if (map.get("response") instanceof List) {
            resultList = (List<String>) map.get("response");
        }
        if (BirthdayProxy.DEBUG_MODE) {
            System.out.println("END Of FuncUtil.listBirthDayFunc ***************");
        }
        return resultList;
    }

    public Map<String, Object> getConnection(Integer type, String month, String serviceUrl, String user, String password) {

        List<String> response = new ArrayList<String>();
        Integer status = 200;

        Map<String, Object> map = new HashMap<String, Object>();

        try {
            URL url = new URL(serviceUrl + METHOD); // Endereco do servico
            HttpURLConnection con = (HttpURLConnection) url.openConnection(); //Se precisar de proxy tem que passar como parametro
            con.setDoOutput(true);
            con.setDoInput(true);

            String soap = buildSoapEnvelope(month, type);
            String userPassword = user + ":" + password;
            String encoding = Base64.getEncoder().encodeToString(userPassword.getBytes());
            if (BirthdayProxy.DEBUG_MODE) {
                System.out.println("Getting Users List *****************");
                System.out.println(soap);
            }
            byte[] msg = soap.getBytes();
            con.setRequestProperty("Authorization", "Basic " + encoding);
            con.setRequestProperty("Content-Length", Integer.toString(msg.length));
            con.setRequestProperty("SOAPAction", "http://www.totvs.com/IwsDataServer/ReadView"); //nome do metodo
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "text/xml; charset=UTF-8");
            //Dependendo do WS é preciso passar mais headers Tipo: content-type usario senha, etc

            con.connect();
            con.getOutputStream().write(msg);
            StringBuilder xml = new StringBuilder();
            if (con.getResponseCode() == 200) {
                if (BirthdayProxy.DEBUG_MODE) {
                    System.out.println("Success ************");
                    System.out.println(con.getResponseMessage());
                }
                byte[] buf = new byte[10000];
                int bytesRead = con.getInputStream().read(buf);
                while (bytesRead != -1) {
                    String line = new String(buf, 0, bytesRead);
                    xml.append(line);
                    bytesRead = con.getInputStream().read(buf);
                }
                String result = normalizeResult(xml.toString().split("<s:Body>")[1].split("</s:Body>")[0]);
                try {
                    JSONObject xmlJSONObj = XML.toJSONObject(result);
                    JSONArray jsonArray = xmlJSONObj.getJSONObject("ReadViewResponse").getJSONObject("ReadViewResult")
                            .getJSONObject("NewDataSet").getJSONArray("PFunc");
                    for (int i = 0; i < jsonArray.length() && i < 1000; i++) {
                        JSONObject jsonObject = jsonArray.getJSONObject(i);
                        String codPessoa = jsonObject.get("CODPESSOA").toString();
                        response.add(codPessoa);
                    }
                } catch (JSONException je) {
                    if (BirthdayProxy.DEBUG_MODE) {
                        System.out.println("Error ************************");
                        System.out.println(je.getMessage());
                    }
                    je.printStackTrace();
                }
            } else {
                if (BirthdayProxy.DEBUG_MODE) {
                    System.out.println("Error ***************************");
                    System.out.println(con.getResponseMessage());
                }
                status = con.getResponseCode();
                if (status.intValue() == 500 && type == SQL) {
                    status = 999;
                }
            }
            con.disconnect();
        } catch (Exception e) {
            status = 500;
            System.out.println("Error obtaining data from the RM service: " + e.getMessage());
        }

        map.put("status", status.toString());
        map.put("response", response);

        return map;

    }

    private String buildSoapEnvelope(String month, Integer type) {
        return "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tot=\"http://www.totvs.com/\">"
                + "   <soapenv:Header/>\n"
                + "   <soapenv:Body>\n"
                + "      <tot:ReadView> \n"
                + "           <tot:DataServerName>"
                + getDataServerName()
                + "</tot:DataServerName> \n"
                + "           <tot:Filtro> "
                + getFiltro(month, type)
                + " AND DATADEMISSAO IS NULL "
                + "           </tot:Filtro> \n"
                + "           <tot:Contexto> "
                + getContext()
                + "           </tot:Contexto> \n"
                + "      </tot:ReadView> \n"
                + "   </soapenv:Body>\n"
                + "</soapenv:Envelope>";
    }

    private String getContext() {
        return "CODCOLIGADA=1;CODSISTEMA=V;CODUSUARIO=mestre";
    }

    private String getDataServerName() {
        return "FopFuncData";
    }

    private String normalizeResult(String s) {
        String result = s;
        result = result.replace("xmlns=\"http://www.totvs.com/\"", "");
        result = result.replace("&lt;", "<");
        result = result.replace("&gt;", ">");
        result = result.replace("&#xD;", "");
        return result;
    }

    private String getFiltro(String month, Integer type) {
        if (Integer.valueOf(month) < 10) {
            month = "0" + month;
        }
        String filter = null;
        if (type == SQL) {
            filter = "month(DTNASCIMENTO) = '" + month + "'";
        } else if (type == ORACLE) {
            filter = "to_char(DTNASCIMENTO,'MM') = '" + month + "'";
        }
        return filter;
    }

}
