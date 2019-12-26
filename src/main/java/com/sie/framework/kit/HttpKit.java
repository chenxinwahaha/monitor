package com.sie.framework.kit;

import com.sie.framework.exception.SieException;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * Title :
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Author :欧瑞荫 2017/12/7
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
public class HttpKit {

    public static String service(String url
            , Map<String, String> headers
            , String method
            , Map<String, String> parameters
            , String mediaType
            , String payload, int connectTimeout) throws IOException, URISyntaxException {
        CloseableHttpClient httpclient = null;
        CloseableHttpResponse httpResponse = null;
        try {
            httpclient = HttpClients.createDefault();
            RequestConfig requestConfig = RequestConfig.custom()
                    .setConnectTimeout(connectTimeout * 1000)
                    .setConnectionRequestTimeout(connectTimeout * 1000)
                    .setSocketTimeout(connectTimeout * 1000).build();
            if (RequestMethod.GET.name().equals(method)) {
                URIBuilder uriBuilder = new URIBuilder(url);
                if (parameters != null) {
                    for (Map.Entry<String, String> entry : parameters.entrySet()) {
                        uriBuilder.addParameter(entry.getKey(), entry.getValue());
                    }
                }
                HttpGet httpGet = new HttpGet(uriBuilder.build());
                if (headers != null) {
                    for (Map.Entry<String, String> entry : headers.entrySet()) {
                        httpGet.setHeader(entry.getKey(), entry.getValue());
                    }
                }
                httpGet.setConfig(requestConfig);
                httpResponse = httpclient.execute(httpGet);
            } else {
                HttpPost httpPost = new HttpPost(url);
                if (headers != null) {
                    for (Map.Entry<String, String> entry : headers.entrySet()) {
                        httpPost.setHeader(entry.getKey(), entry.getValue());
                    }
                }
                StringEntity entity;
                if (mediaType == null || mediaType.startsWith("application/x-www-form-urlencoded")) {
                    List<NameValuePair> paramList = new ArrayList<>();
                    for (Map.Entry<String, String> entry : parameters.entrySet()) {
                        paramList.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
                    }
                    entity = new UrlEncodedFormEntity(paramList, "UTF-8");
                } else {
                    entity = new StringEntity(payload, ContentType.create(mediaType, "UTF-8"));
                }

                httpPost.setEntity(entity);
                httpPost.setConfig(requestConfig);
                httpResponse = httpclient.execute(httpPost);
            }
            int statusCode = httpResponse.getStatusLine().getStatusCode();
            if (statusCode == 200) {
                HttpEntity httpEntity = httpResponse.getEntity();
                return EntityUtils.toString(httpEntity);//取出应答字符串
            } else {
                throw new SieException("http处理异常,错误代码:" + statusCode);
            }
        } finally {
            QuietCloseKit.close(httpclient);
            QuietCloseKit.close(httpResponse);
        }
    }

    public static String get(String url, Map<String, String> headers, int connectTimeout) throws IOException, URISyntaxException {
        url = url.replaceAll(" ", "%20");
        return service(url, headers, HttpMethod.GET.name(), null, null, null, connectTimeout);
    }


    public static void head(String heartUrl) throws IOException {
        URL url = new URL(heartUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("HEAD");
        Map<String, List<String>> headerMap = conn.getHeaderFields();
        Iterator<String> iterator = headerMap.keySet().iterator();
        List<String> firstLine = headerMap.get(null);
        if (!firstLine.get(0).contains("200")) {
            throw new SieException("服务未正确响应", "code:" + firstLine.get(0));
        }
    }

}
