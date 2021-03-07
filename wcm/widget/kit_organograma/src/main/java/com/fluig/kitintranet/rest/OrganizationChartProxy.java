package com.fluig.kitintranet.rest;

import java.util.List;

import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.fluig.kitintranet.parse.model.TeamVO;
import com.fluig.kitintranet.parse.services.RMServices;
import com.fluig.util.Utils;
import com.totvs.technology.wcm.sdk.rest.WCMRest;

@Path("/organizationchart")
@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
public class OrganizationChartProxy extends WCMRest {

    public static final String SERVICE = "/wsDataServer/IwsDataServer";

	@GET
    @Path("chart")
    @Produces(MediaType.APPLICATION_JSON)
    public Response today(@QueryParam("code") String code, @QueryParam("user") String user,
    		@QueryParam("password") String password, @QueryParam("url") String url) {
    	RMServices rm = new RMServices(url, user, password);
    	String result = null;
		try {
			List<TeamVO> teams = rm.getOrganizationChart(code);
			result = Utils.objectToJSON(teams);
		} catch (Exception e) {
            System.out.println("Error obtaining data from the RM service: " + e.getMessage());
		}
        return Response.status(Status.OK).entity(result).build();
    }
}
