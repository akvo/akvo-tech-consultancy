package org.akvo;
/*
 * WORKFLOW
 * 
 * To access the API endpoints a user must be registered with the akvo keycloak .
 * Also the user should be registered with THe AkvoFLOW instance
 */
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class GreenCoffee {
	private static String refreshToken;
	private static String surveyURL;
	Map<String,String> questionsMap=new HashMap<String, String>();
	/*
	 * Invoke the class with args
	 * 	1. username
	 * 	2. password
	 * These are the keycloak user credentials.
	 * The main first generates the refresh_token and access_token and then calls the survey definition endpoint
	 */
	public static void main(String[] args) throws ClientProtocolException,
	IOException {
		surveyURL="https://api.akvo.org/flow/orgs/"+args[0]+"/surveys/"+args[1];
		getOfflineToken(args);
		getSurvey(getAccessToken());
	}
	/*
	 *  A POST needs to be made to "https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token" with params
	 *  -client_id=curl
	 *  -username=<keycloakUserName>
	 *  -password=<keycloackPassword>
	 *  -grant_type=password
	 *  -scope=openid offline_access
	 *  
	 *  This will generate a json object with the refresh_token. This token needs to be used to generate the access_token 
	 * 
	 */
	public static String getOfflineToken(String[] args) throws ClientProtocolException,
	IOException {
        
		CloseableHttpClient client = HttpClients.createDefault();

		HttpPost post = new HttpPost(
				"https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token");
		List<NameValuePair> data = new ArrayList<NameValuePair>();
		data.add(new BasicNameValuePair("client_id", "curl"));
		data.add(new BasicNameValuePair("username", System.getenv("KC_USR")));
		data.add(new BasicNameValuePair("password", System.getenv("KC_PWD")));
		data.add(new BasicNameValuePair("grant_type", "password"));
		data.add(new BasicNameValuePair("scope", "openid offline_access"));
		post.setEntity(new UrlEncodedFormEntity(data));

		CloseableHttpResponse response = client.execute(post);

		JsonFactory jsonFactory = new JsonFactory();
		ObjectMapper objectMapper = new ObjectMapper(jsonFactory);
		JsonNode root = objectMapper.readTree(response.getEntity().getContent());

		return refreshToken = root.get("refresh_token").asText();

	}
	/*
	 * To make any API call to fetch data from AkvoFLOW , we need to generate an access_token.
	 * A new access_token should be generated before every API call
	 * To generate access_token POST to https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token with
	 * -client_id=curl
	 * -refresh_token=<refreshToken> (see getOfflineToken method)
	 * -grant_type=refresh_token
	 * 
	 * The POST returns a JSON object with the access_token
	 */
	public static String getAccessToken()
			throws ClientProtocolException, IOException {
		CloseableHttpClient client = HttpClients.createDefault();

		HttpPost post = new HttpPost("https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token");
		List<NameValuePair> data = new ArrayList<NameValuePair>();
		data.add(new BasicNameValuePair("client_id", "curl"));
		data.add(new BasicNameValuePair("refresh_token", refreshToken));
		data.add(new BasicNameValuePair("grant_type", "refresh_token"));
		post.setEntity(new UrlEncodedFormEntity(data));

		CloseableHttpResponse response = client.execute(post);

		JsonFactory jsonFactory = new JsonFactory();
		ObjectMapper objectMapper = new ObjectMapper(jsonFactory);
		JsonNode root = objectMapper.readTree(response.getEntity().getContent());

		JsonNode accessToken = root.get("access_token");
		return accessToken.asText();

	}

	static  void getSurvey(String accessToken)
			throws ClientProtocolException, IOException {
		String url=surveyURL;
		JsonNode surveyDef = getResponse(accessToken,url);
		createQuestionsMap(surveyDef);
	}

	private static JsonNode getResponse(String accessToken,String url) {
		HttpGet get = new HttpGet(url);
		get.addHeader("Authorization", "Bearer " + accessToken);
		get.addHeader("Accept", "application/vnd.akvo.flow.v2+json");
		get.addHeader("User-Agent", "java-flow-api-example");
		CloseableHttpClient client = HttpClients.createDefault();

		CloseableHttpResponse response = null;
		try {
			response = client.execute(get);
		} catch (ClientProtocolException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		JsonFactory jsonFactory = new JsonFactory();
		ObjectMapper objectMapper = new ObjectMapper(jsonFactory);
		JsonNode responseNode = null;
		try {
			HttpEntity entity = response.getEntity();
			responseNode = objectMapper.readTree(EntityUtils.toString(entity,"UTF-8"));
		} catch (UnsupportedOperationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return responseNode;
	}

	private static void createQuestionsMap(JsonNode surveyDefinition) {
		Map<JsonNode,String[]> questionsMap=new LinkedHashMap<JsonNode, String[]>();
		//Non-monitoring
		JsonNode form=((ArrayNode)surveyDefinition.path("forms")).get(0);
		String instancesURL=form.get("formInstancesUrl").asText();
		//		System.out.println("FormInstance URL"+instancesURL);
		ArrayNode questionGroups=(ArrayNode)((JsonNode)form).path("questionGroups");
		for(int i=0;i<questionGroups.size();i++){
			ArrayNode questions=(ArrayNode)questionGroups.get(i).path("questions");
			for(int j=0;j<questions.size();j++){
				JsonNode id=questions.get(j).get("id");
				String[] value={questions.get(j).get("name").toString(),questions.get(j).get("type").toString()};
				questionsMap.put(id,value);

			}
		}
		getFormInstances(questionsMap,instancesURL);
	}

	private static void getFormInstances(Map<JsonNode, String[]> qMap, String instancesURL) {
		JsonNode formObj=null;
		ArrayNode formInstances=null;
		try {
			formObj=getResponse(getAccessToken(), instancesURL);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		formInstances=(ArrayNode)formObj.path("formInstances");
		while(formObj.get("nextPageUrl") !=null){
			String nextPageUrl=formObj.get("nextPageUrl").asText();
			try {
				formObj=getResponse(getAccessToken(), nextPageUrl);
			} catch (ClientProtocolException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			//			 System.out.println("while"+formInstances.size());
			formInstances.addAll((ArrayNode)formObj.path("formInstances"));

		};

		//		System.out.println(formInstances.size());
		//		 Charset.forName("UTF-8").encode(formInstances.toString());
		//		System.out.println(formInstances.toString());

		createJsonFile(mergeFormAndQuestions(qMap,formInstances));
		//		System.out.println(mergeFormAndQuestions(qMap,formInstances).toString());
	}



	private static JSONArray mergeFormAndQuestions(Map<JsonNode, String[]> qMap, ArrayNode formInstances) {
		JSONArray jResponses = new JSONArray();
		for(int i=0;i<formInstances.size();i++){
			JsonNode responses=formInstances.get(i).get("responses");
			Iterator<JsonNode> qItr=qMap.keySet().iterator();
			JSONObject resObj=new JSONObject();
			JSONArray jResponse=new JSONArray();
			while(qItr.hasNext()){	
				JsonNode qID=qItr.next();
				JsonNode response=responses.findValue(qID.asText());
				createMapofResponses(jResponse,response,qMap.get(qID)[0].replaceAll(" ", "_"),qMap.get(qID)[1]);
			}
			addFormInstanceMetaData(formInstances.get(i),jResponse);
			jResponses.put(resObj.put("response",jResponse));
		}
		return jResponses;
	}

	private static void addFormInstanceMetaData(JsonNode responses, JSONArray jResponse) {
		JSONObject resObj=new JSONObject();
		//		resObj.put("deviceIdentifier", asText(responses.get("deviceIdentifier")));
		//		jResponse.put(resObj);
		resObj=new JSONObject();
		resObj.put("identifier", asText(responses.get("identifier")));
		jResponse.put(resObj);
		//		resObj=new JSONObject();
		//		resObj.put("submitter", asText(responses.get("submitter")));
		//		jResponse.put(resObj);
		//		resObj=new JSONObject();
		//		resObj.put("submissionDate", asText(responses.get("submissionDate")));
		//		jResponse.put(resObj);


	}
	private static String asText(JsonNode textNode){
		String text="";
		if(textNode != null){
			return textNode.asText();
		}else{
			return text;
		}
	}
	private static void createMapofResponses(JSONArray jResponse,
			JsonNode response, String qText, String qType) {
		qType=qType.replaceAll("^\"|\"$", "");
		qText=qText.replaceAll("^\"|\"$", "");
		JSONObject resObj=new JSONObject();
		if(response != null){

			switch(qType){

			case "OPTION" : 
				handleOptionQuestions(jResponse,response,qText);
				break;
			case "PHOTO" :
				handlePhotoQuestions(jResponse,response,qText);
				break;			
			case "CADDISFLY" : 
				handleCaddisflyQuestions(jResponse,response,qText);
				break;
			case "VIDEO" : 
				handleVideoQuestions(jResponse,response,qText);
				break;
			case "GEOSHAPE" : 
				handleGeoshapeQuestions(jResponse,response,qText);
				break;
			case "GEO" : 
				handleGeoQuestions(jResponse,response,qText);
				break;
			case "FREE_TEXT" : 
				handleFreetextQuestions(jResponse,response,qText);
				break;
			case "SCAN" : 
				handleBarcodeQuestions(jResponse,response,qText);
				break;
			case "DATE" : 
				handleDateQuestions(jResponse,response,qText);
				break;
			case "NUMBER" : 
				handleNumberQuestions(jResponse,response,qText);
				break;
			case "CASCADE" : 
				handleCascadeQuestions(jResponse,response,qText);
				break;


			}
		}else if(qType.equals("GEO")){
			handleGeoQuestions(jResponse,response,qText);
		}else{

			jResponse.put(resObj.put(qText, ""));
		}
	}


	private static void handleCascadeQuestions(JSONArray jResponse,
			JsonNode response, String qText) {
		// TODO Auto-generated method stub
		JSONObject resObj=new JSONObject();
		String responseStr="";
		ArrayNode values=(ArrayNode)response;
		for(int i=0;i<values.size();i++){
			JsonNode value=values.get(i).get("name");
			if(value !=null){
				if(responseStr.equals("")){
					responseStr=values.get(i).get("name").asText();
				}else{
					responseStr=responseStr+"|"+value.asText();
				}
			}
		}

		jResponse.put(resObj.put(qText, responseStr));

	}



	private static void handleNumberQuestions(JSONArray jResponse,
			JsonNode response, String qText) {
		// TODO Auto-generated method stub
//		Long responseStr;
//		responseStr=response.is;
		JSONObject resObj=new JSONObject();
		if(qText.equals("Hand-phone_number")){
			jResponse.put(resObj.put(qText, response.asLong()));
		}else{
		jResponse.put(resObj.put(qText, response.asDouble()));
		}
	}

	private static void handleDateQuestions(JSONArray jResponse,
			JsonNode response, String qText) {
		// TODO Auto-generated method stub
		String responseStr="";
		responseStr=response.asText();
		JSONObject resObj=new JSONObject();
		jResponse.put(resObj.put(qText, responseStr));
	}

	private static void handleBarcodeQuestions(JSONArray jResponse,
			JsonNode response, String qText) {
		// TODO Auto-generated method stub
		String responseStr="";
		responseStr=response.asText();
		JSONObject resObj=new JSONObject();
		jResponse.put(resObj.put(qText, responseStr));
	}

	private static void handleFreetextQuestions(JSONArray jResponse,
			JsonNode response, String qText) {
		// TODO Auto-generated method stub
		String responseStr="";
		responseStr=response.asText();
		JSONObject resObj=new JSONObject();
		jResponse.put(resObj.put(qText, responseStr));
	}

	private static void handleGeoQuestions(JSONArray jResponse,
			JsonNode response, String qText) {
		// TODO Auto-generated method stub
		JSONObject resObj=new JSONObject();
		String responseStr="";
		if(response != null){
			responseStr=response.get("lat").asText();
			resObj.put(qText+"-Latitude", responseStr);
			responseStr=response.get("long").asText();
			resObj.put(qText+"-Longitude", responseStr);
			jResponse.put(resObj);
		}else{
			resObj.put(qText+"-Latitude", responseStr);
			resObj.put(qText+"-Longitude", responseStr);
			jResponse.put(resObj);
		}

	}

	private static void handleGeoshapeQuestions(JSONArray jResponse,
			JsonNode response, String qText) {
		// TODO remove extra quotes from json
		String responseStr="";
		responseStr=response.toString();
		JSONObject resObj=new JSONObject();
		jResponse.put(resObj.put(qText, responseStr));

	}

	private static void handleVideoQuestions(JSONArray jResponse,
			JsonNode response, String qText) {
		String responseStr="";
		responseStr=response.get("filename").asText();
		JSONObject resObj=new JSONObject();
		jResponse.put(resObj.put(qText, responseStr));

	}

	private static void handleCaddisflyQuestions(JSONArray jResponse,
			JsonNode response, String qText) {
		// TODO Auto-generated method stub

	}

	private static void handlePhotoQuestions(JSONArray jResponse,
			JsonNode response, String qText) {
		String responseStr="";
		responseStr=response.get("filename").asText();
		JSONObject resObj=new JSONObject();
		jResponse.put(resObj.put(qText, responseStr));
	}

	private static void handleOptionQuestions(JSONArray jResponse,
			JsonNode response, String qText) {
		JSONObject resObj=new JSONObject();
		String responseStr="";
		ArrayNode values=(ArrayNode)response;
		for(int i=0;i<values.size();i++){
			JsonNode value=values.get(i).get("text");
			if(value !=null){
				if(responseStr.equals("")){
					responseStr=values.get(i).get("text").asText();
				}else{
					responseStr=responseStr+"|"+value.asText();
				}
			}
		}

		jResponse.put(resObj.put(qText, responseStr));

	}
	private static void createJsonFile(JSONArray mergeFormAndQuestions) {

		Writer out = null;
		try {
			out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("/Users/joyghosh/Documents/Misc/response.json"), "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			try {
				out.write(mergeFormAndQuestions.toString());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} finally {
			try {
				out.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		//		try {
		//			FileWriter file=new FileWriter("/Users/joyghosh/Documents/Misc/response.json");
		//			file.write(mergeFormAndQuestions.toString());
		//			file.flush();
		//			file.close();
		//
		//		} catch (IOException e) {
		//			// TODO Auto-generated catch block
		//			e.printStackTrace();
		//		}

	}

}
