package com.sie.framework.kit;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * Title :
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Author :李雪 2018/1/15
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
public class CookieKit {
    public static void setLongCookieParam(HttpServletResponse response, String key, String value, int maxAge){
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    public static String getCookieValueByName(HttpServletRequest request,String key){
        Map<String,Cookie> cookieMap = ReadCookieMap(request);
        if(cookieMap.containsKey(key)){
            Cookie cookie = (Cookie)cookieMap.get(key);
            return cookie.getValue();
        }else{
            return "";
        }
    }

    private static Map<String,Cookie> ReadCookieMap(HttpServletRequest request){
        Map<String,Cookie> cookieMap = new HashMap<String,Cookie>();
        Cookie[] cookies = request.getCookies();
        if(null!=cookies){
            for(Cookie cookie : cookies){
                cookieMap.put(cookie.getName(), cookie);
            }
        }
        return cookieMap;
    }

    public static void delCookieParam(HttpServletResponse response,String key){
        Cookie cookie =  new Cookie(key, null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}
