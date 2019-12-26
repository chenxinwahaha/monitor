package com.sie.framework.cache;

import org.apache.ibatis.cache.Cache;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * @author:陈鑫
 * </p>
 * <p>
 * @Date:2018/9/17
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
public class CacheSaver {
    private static Map<String, Cache> cacheMap = new HashMap<>();

    public static void addCache(Cache cache) {
        cacheMap.put(cache.getId(), cache);
    }

    public synchronized static void clear() {
        cacheMap.forEach((id, cache) -> {
            cache.clear();
        });
    }

}
