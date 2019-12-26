package com.sie.framework.kit;

import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ActuatorKit {


    private static Map paramsMap;

    private static String health = "/health";

    private static Logger logger = LoggerFactory.getLogger(ActuatorKit.class);


    static
    {
        paramsMap = new HashMap<String, String>();
        paramsMap.put("memoryMax", "/metrics/jvm.memory.max");
        paramsMap.put("memoryUsed", "/metrics/jvm.memory.used");
        paramsMap.put("systemLoad", "/metrics/system.load.average.1m");
    }

    /**
     * 根据路径报告应用程序的内部状况
     *
     * @param url
     * @return
     * @throws Exception
     */
    public static Map<String, Object> getInfoFromActuator(String url) throws Exception {
        return JSONObject.parseObject(HttpKit.get(url, null, 3));
    }

    /**
     * 报告指定名称的应用程序度量值
     *
     * @param url
     * @return
     * @throws Exception
     */
    public static Object getValueFromActuatorMetrics(String url) throws Exception {
        List measurements = (List) getInfoFromActuator(url).get("measurements");
        return ((Map) measurements.get(0)).get("value");
    }

    /**
     * 请求节点相关信息
     *
     * @param map
     * @param string
     */
    public static void getExtendValues(Map map, String string) {
        //查询度量指标
        paramsMap.forEach((k,v)->{
            String url = string + v;
            try {
                map.put(k, ActuatorKit.getValueFromActuatorMetrics(url));
            } catch (Exception e) {
                logger.info("查询失败,地址为" + url, e);
            }
        });
        //查询健康信息
        String healthUrl = string + health;
        try {
            map.put("health", ActuatorKit.getInfoFromActuator(healthUrl));
        } catch (Exception e) {
            logger.info("查询失败,地址为" + healthUrl, e);
        }
    }
}
