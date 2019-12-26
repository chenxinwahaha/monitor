package com.sie.framework.kit;

/**
 * Created by llb on 2018/5/8.
 */

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * <p>
 * Title :
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Author :李雪 2018/3/20
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
public class DateCalculatorKit {

    public static final SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static long minute(Date date1, Date date2) {
        long minute = Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60);
        return minute;
    }


}

