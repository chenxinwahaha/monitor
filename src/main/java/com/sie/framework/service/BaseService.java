package com.sie.framework.service;

import com.joinforwin.toolkit.helper.ConfigHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * <p>
 * Title :
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Author :李雪 2017/8/1
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
public class BaseService {

    @Autowired
    JdbcTemplate jdbcTemplate;

    /**
     * @param key
     * @return
     */
    public String getConfigValue(String key) {
        String value = ConfigHelper.getStringValue(jdbcTemplate, key);
        if (value != null) {
            return value;
        } else {
            return "";
        }
    }
}
