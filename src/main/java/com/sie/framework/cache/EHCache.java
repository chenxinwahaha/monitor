package com.sie.framework.cache;

import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import org.apache.ibatis.cache.Cache;
import org.apache.ibatis.cache.CacheException;

import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

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
public class EHCache implements Cache {

    private static final CacheManager CACHE_MANAGER = createCacheManager();
    private final ReadWriteLock readWriteLock = new ReentrantReadWriteLock();
    private final String id;

    private static CacheManager createCacheManager() {
        InputStream input = EHCache.class.getResourceAsStream("/ehcache/ehcache.xml");
        CacheManager cacheManager;
        if (input != null) {
            try {
                cacheManager = CacheManager.create(input);
            } catch (Throwable var11) {
                cacheManager = CacheManager.create();
            } finally {
                try {
                    input.close();
                } catch (IOException var10) {
                }
            }
        } else {
            cacheManager = CacheManager.create();
        }

        return cacheManager;
    }

    public EHCache(String id) {
        if (id == null) {
            throw new IllegalArgumentException("Cache instances require an ID");
        } else {
            this.id = id;
            if (!CACHE_MANAGER.cacheExists(this.id)) {
                CACHE_MANAGER.addCache(this.id);
            }

        }
        CacheSaver.addCache(this);
    }

    @Override
    public void clear() {
        this.getCache().removeAll();
    }

    @Override
    public String getId() {
        return this.id;
    }

    @Override
    public Object getObject(Object key) {
        try {
            Element t = this.getCache().get(Integer.valueOf(key.hashCode()));
            return t == null ? null : t.getObjectValue();
        } catch (Throwable var3) {
            throw new CacheException(var3);
        }
    }

    @Override
    public ReadWriteLock getReadWriteLock() {
        return this.readWriteLock;
    }

    @Override
    public int getSize() {
        try {
            return this.getCache().getSize();
        } catch (Throwable var2) {
            throw new CacheException(var2);
        }
    }

    @Override
    public void putObject(Object key, Object value) {
        try {
            this.getCache().put(new Element(Integer.valueOf(key.hashCode()), value));
        } catch (Throwable var4) {
            throw new CacheException(var4);
        }
    }

    @Override
    public Object removeObject(Object key) {
        try {
            Object t = this.getObject(key);
            this.getCache().remove(Integer.valueOf(key.hashCode()));
            return t;
        } catch (Throwable var3) {
            throw new CacheException(var3);
        }
    }

    private Ehcache getCache() {
        return CACHE_MANAGER.getCache(this.id);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        } else if (obj == null) {
            return false;
        } else if (!(obj instanceof Cache)) {
            return false;
        } else {
            Cache otherCache = (Cache) obj;
            return this.id.equals(otherCache.getId());
        }
    }

    @Override
    public int hashCode() {
        return this.id.hashCode();
    }

    @Override
    public String toString() {
        return "EHCache {" + this.id + "}";
    }
}
