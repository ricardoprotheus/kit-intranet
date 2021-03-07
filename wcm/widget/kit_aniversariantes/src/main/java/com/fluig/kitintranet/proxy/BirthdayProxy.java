package com.fluig.kitintranet.proxy;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.fluig.sdk.api.FluigAPI;
import com.fluig.sdk.api.common.SDKException;
import com.totvs.technology.wcm.sdk.rest.WCMRest;

@Path("/birthdays")
@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
public class BirthdayProxy extends WCMRest {

    public static final String METHOD = "/wsDataServer/IwsDataServer";
    public static final int SQL = 1;
    public static final int ORACLE = 2;
    private List<String> listBirthDayFunc;
    public static final boolean DEBUG_MODE = false;

    @GET
    @Path("today")
    @Produces(MediaType.APPLICATION_JSON)
    public Response today(@QueryParam("month") String month, @QueryParam("instanceId") Long instanceId) {

        Map<String, String> widgetPreferences = null;
        try {
            widgetPreferences = new FluigAPI().getPageService().getWidgetPreferences(instanceId);
        } catch (SDKException e) {
            System.out.println("Error obtaining preferences from widget: " + e.getMessage());
        }
        if (widgetPreferences != null && !widgetPreferences.isEmpty()) {
            String serviceUrl = widgetPreferences.get("rmLink");
            String user = widgetPreferences.get("rmUser");
            String password = widgetPreferences.get("rmPass");
            return getBirthdays(month, serviceUrl, user, password);
        } else {
            return Response.status(500).entity("Error obtaining data from the RM service").build();
        }

    }

    private Response getBirthdays(String month, String serviceUrl, String user, String password) {
        Map<String, String> map = new HashMap<String, String>();
        map = getConnection(SQL, month, serviceUrl, user, password);

        if (map.get("status").equals("999")) {
            map = getConnection(ORACLE, month, serviceUrl, user, password);
        }

        return Response.status(Integer.parseInt(map.get("status").toString())).entity(map.get("response")).build();
    }

    public Map<String, String> getConnection(Integer type, String month, String serviceUrl, String user, String password) {

        if (BirthdayProxy.DEBUG_MODE) {
            System.out.println("getConnection **********");
        }
        FuncUtil funcProxy = new FuncUtil();
        listBirthDayFunc = funcProxy.listBirthDayFunc(month, serviceUrl, user, password);
        if (BirthdayProxy.DEBUG_MODE) {
            System.out.println("List Birthday Func Size: " + listBirthDayFunc.size());
        }

        String response = null;
        Integer status = 200;

        Map<String, String> map = new HashMap<String, String>();

        if (BirthdayProxy.DEBUG_MODE) {
            System.out.println("Getting Detailed Data ********************");
        }
        try {
            URL url = new URL(serviceUrl + METHOD); // Endereco do servico
            HttpURLConnection con = (HttpURLConnection) url.openConnection(); //Se precisar de proxy tem que passar como parametro
            con.setDoOutput(true);
            con.setDoInput(true);

            String soap = buildSoapEnvelope(month, type);
            String userPassword = user + ":" + password;
            String encoding = Base64.getEncoder().encodeToString(userPassword.getBytes());
            if (BirthdayProxy.DEBUG_MODE) {
                System.out.println("SOAP Envelope ********************");
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
                    System.out.println("Success **************");
                    System.out.println(con.getResponseMessage());
                }
                byte[] buf = new byte[10000];
                int bytesRead = con.getInputStream().read(buf);
                while (bytesRead != -1) {
                    String line = new String(buf, 0, bytesRead);
                    xml.append(line);
                    bytesRead = con.getInputStream().read(buf);
                }
                if (BirthdayProxy.DEBUG_MODE) {
                    System.out.println("Content Read **************");
                    System.out.println(xml);
                }
                String result = normalizeResult(xml.toString().split("<s:Body>")[1].split("</s:Body>")[0]);
                if (BirthdayProxy.DEBUG_MODE) {
                    System.out.println("Normalized Content **************");
                    System.out.println(result);
                }
                try {
                    JSONObject xmlJSONObj = XML.toJSONObject(result);
                    response = xmlJSONObj.toString();
                } catch (JSONException je) {
                    je.printStackTrace();
                }
            } else {
                if (BirthdayProxy.DEBUG_MODE) {
                    System.out.println("Error **********************");
                    System.out.println(con.getResponseMessage());
                }
                status = con.getResponseCode();
                if (status.intValue() == 500 && type == SQL) {
                    status = 999;
                }
            }
            con.disconnect();
        } catch (Exception e) {
            if (BirthdayProxy.DEBUG_MODE) {
                System.out.println("Exception ****************");
                e.printStackTrace();
                System.out.println(e.getMessage());
                System.out.println(e.getCause());
            }
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
                + "           </tot:Filtro> \n"
                + "           <tot:Contexto> "
                + getContext()
                + "           </tot:Contexto> \n"
                + "      </tot:ReadView> \n" + "   </soapenv:Body>\n" + "</soapenv:Envelope>";
    }

    private String getContext() {
        return "CODCOLIGADA=1;CODSISTEMA=V;CODUSUARIO=mestre";
    }

    private String getDataServerName() {
        return "RhuPessoaData";
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
        StringBuilder stringBuilder = new StringBuilder();
        if (type == SQL) {
            stringBuilder.append("month(DTNASCIMENTO) = '");
            stringBuilder.append(month);
            stringBuilder.append("'");
        } else if (type == ORACLE) {
            stringBuilder.append("to_char(DTNASCIMENTO,'MM') = '");
            stringBuilder.append(month);
            stringBuilder.append("'");
        }

        if (stringBuilder.length() > 0) {

            if (listBirthDayFunc != null && !listBirthDayFunc.isEmpty()) {
                stringBuilder.append(" AND PPESSOA.CODIGO IN ( ");
                for (String string : listBirthDayFunc) {
                    stringBuilder.append(string);
                    stringBuilder.append(",");
                }
                stringBuilder.deleteCharAt(stringBuilder.length() - 1);
                stringBuilder.append(")");
            }

        }

        return stringBuilder.toString();
    }
}
