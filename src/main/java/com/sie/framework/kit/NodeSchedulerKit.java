package com.sie.framework.kit;

import com.alibaba.fastjson.JSONObject;
import com.sie.application.pc.entity.SieNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class NodeSchedulerKit {
    private static Logger logger = LoggerFactory.getLogger(NodeSchedulerKit.class);

    public static Map<String, Object> getNodeSchedulerInfo(SieNode node) {
        Map<String, Object> map = new HashMap<>();
        //调用节点并获取监控信息
        map.put("name", node.getName());
        String url = "http://" + node.getIp() + ":" + node.getPort() + "/api/scheduler";
        try {
            map = (Map<String, Object>) JSONObject.parse(HttpKit.get(url, null, 5));
            return map;
        } catch (Exception e) {
            map.put("error", "节点异常");
            return map;
        }
    }

    //node
    public static Map<String, Object> getInfo(SieNode node) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", node.getId());
        map.put("name", node.getName());
        String apiUrl = "http://" + node.getIp() + ":" + node.getPort() + "/api/usage";
        try {
            //查询ram
            String value = HttpKit.get(apiUrl, null, 5);
            map.put("value", JSONObject.parse(value));
            return map;
        } catch (Exception e) {
            map.put("error", "节点异常~");
            return map;
        }
    }



    //ide
    public static Map getInfo(String ideIp) {
        Map<String, Object> map = new HashMap<>();
        String url = ideIp + "/api/usage";
        try {
            String value = HttpKit.get(url, null, 2);
            map.put("value", JSONObject.parse(value));
            return map;
        } catch (Exception e) {
            map.put("error", "查询异常");
            return map;
        }
    }
}
