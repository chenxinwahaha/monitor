package com.sie.application.pc.kit;

import com.alibaba.fastjson.JSONObject;

import java.util.Map;

public class SieInstallationParser {

    public static String getValueByKeyFromInstance(String content, String key) {
        Map instance = (Map) JSONObject.parseObject(content).get("instance");
        return instance.get(key).toString();
    }

    public static String getNodeNameFromConfig(String content) {
        Map config = (Map) JSONObject.parseObject(content).get("config");
        Map sie = (Map) config.get("sie");
        Map node = (Map) sie.get("node");
        return node.get("name").toString();
    }

    public static String getUrlFromInstance(String content) {
        StringBuilder stringBuilder = new StringBuilder("http://");
        return stringBuilder.append(getValueByKeyFromInstance(content, "sysIp"))
                .append(":")
                .append(getValueByKeyFromInstance(content, "instancePort")).toString();
    }

    public static String getFloatingIpFromInstance(String content) {
        StringBuilder stringBuilder = new StringBuilder();
        Map instance = (Map) JSONObject.parseObject(content).get("config");
        return stringBuilder.append(instance.get("vip")).toString();
    }

    public static Map getNodeFromConfig(String content) {
        Map config = (Map) JSONObject.parseObject(content).get("config");
        Map sie = (Map) config.get("sie");
        Map node = (Map) sie.get("node");
        return node;
    }
}
