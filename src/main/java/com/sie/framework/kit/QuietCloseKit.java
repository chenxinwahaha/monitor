package com.sie.framework.kit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * Title :
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Author :韩洪举 2017/5/16
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
public class QuietCloseKit {

    private static final Logger logger = LoggerFactory.getLogger(QuietCloseKit.class);

    private QuietCloseKit() {
    }

    public static void close(AutoCloseable s) {
        if(s != null) {
            try {
                s.close();
                s = null;
            } catch (Exception var2) {
                logger.error("关闭失败", var2);
            }
        }
    }
}
