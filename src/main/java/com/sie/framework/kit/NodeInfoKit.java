package com.sie.framework.kit;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * <p>
 * Title :NodeInfoKit
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Author : wxxx 2018/9/30
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
@Component
public class NodeInfoKit {

    private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    String format = simpleDateFormat.format(new Date());

    public HashMap getResultMap(Map value) {
        HashMap<String, Object> hashMap = new LinkedHashMap<>();
        Map otherValue = (Map) value.get("value");
        hashMap.put("date", format);
        //system.load.average
        hashMap.put("system.load.average", stringToDouble(getCorrectValue(value.get("systemLoad"))));
        //jvm.threads.live
        hashMap.put("jvm.threads.live", getCorrectValue(((Map) otherValue.get("thread")).get("size")));
        //jvm.memory.max
        hashMap.put("jvm.memory.max", getCorrectValue(((Map) otherValue.get("jvm")).get("total")));
        //jvm.memory.used
        hashMap.put("jvm.memory.used", getCorrectValue(((Map) otherValue.get("jvm")).get("usage")));
        //ramTotal
        hashMap.put("ramTotal", getCorrectValue(((Map) otherValue.get("ram")).get("total")));
        //ramUsage
        hashMap.put("ramUsage", getCorrectValue(((Map) otherValue.get("ram")).get("usage")));
        //diskSpaceTotal,diskSpaceFree
        JSONArray diskJsonArray = (JSONArray) otherValue.get("disk");
        Map diskInfoMap = getDiskInfo(diskJsonArray);
        hashMap.put("diskSpaceTotal", diskInfoMap.get("diskTotal"));
        hashMap.put("diskSpaceFree", diskInfoMap.get("diskFree"));
        return hashMap;
    }

    public void formatNodeInfo(String key, JSONObject value, Map msgMap, Map map) {
        msgMap.put("createDate", map.get("createDate"));
        switch (key) {
            case "jvm":
                value.forEach((k, v) -> {
                    if ("unit" != k) {
                        msgMap.put("value", v.toString());
                        msgMap.put("unit", value.get("unit"));
                        msgMap.put("tips", "jvm_" + k);
                    }
                });
                break;
            case "cpu":
                msgMap.put("value", value.get("ratio"));
                msgMap.put("unit", value.get("unit"));
                msgMap.put("tips", "cpu使用情况");
                break;
            case "thread":
                msgMap.put("value", value.get("size"));
                msgMap.put("tips", "线程数量");
                break;
            case "ram":
                value.forEach((k, v) -> {
                    if ("unit" != k) {
                        msgMap.put("value", v.toString());
                        msgMap.put("unit", value.get("unit"));
                        msgMap.put("tips", "ram_" + k);
                    }
                });
                break;
            default:
                break;
        }
    }

    public void formatNodeInfo(String key, JSONArray value, Map msgMap, Map map) {
        msgMap.put("createDate", map.get("createDate"));
        switch (key) {
            case "disk":
                JSONObject disk = (JSONObject) value.get(0);
                disk.forEach((k, v) -> {
                    if ("unit" != k && "partition" != k && "name" != k) {
                        msgMap.put("value", v.toString());
                        msgMap.put("unit", disk.get("unit"));
                        msgMap.put("tips", "disk_" + k);
                    }
                });
                break;
            default:
                break;
        }
    }

    public Map getDiskInfo(JSONArray diskJsonArray) {
        int diskTotal = 0;
        int diskFree = 0;
        Map disk = new HashMap();
        for (int i = 0; i < diskJsonArray.size(); i++) {
            diskTotal += StringToInt(getCorrectValue(((Map) diskJsonArray.get(i)).get("total")));
            diskFree += StringToInt(getCorrectValue(((Map) diskJsonArray.get(i)).get("free")));
        }
        disk.put("diskTotal", diskTotal);
        disk.put("diskFree", diskFree);
        return disk;
    }

    public double stringToDouble(String num) {
        if (null != num) {
            BigDecimal toDouble = new BigDecimal(num);
            String str = toDouble.toPlainString();
            double d = Double.valueOf(str);
            double value = new BigDecimal(d).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            return value;
        } else {
            return Double.parseDouble("0");
        }
    }

    public int StringToInt(String num) {
        if (null != num) {
            return Integer.parseInt(num);
        } else {
            return 0;
        }
    }

    public String getCorrectValue(Object num) {
        if (null != num && "" != num) {
            return num.toString();
        } else {
            return null;
        }
    }
}
