package com.sie.framework.exception;

/**
 * <p>
 * Title :
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Author :欧瑞荫 2017/12/5
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
public class SieException extends RuntimeException {

    private String code;

    private String data;

    public SieException(String message) {
        super(message);
        this.code = "E";
        this.data = "";
    }

    public SieException(String message, String data) {
        super(message);
        this.code = "E";
        this.data = data;
    }

    public SieException(String code, String message, String data) {
        super(message);
        this.code = code;
        this.data = data;
    }

    public SieException(String message, Throwable cause) {
        super(message, cause);
        this.code = "";
        this.data = "";
    }

    public SieException(String message, String data, Throwable cause) {
        super(message, cause);
        this.code = "E";
        this.data = data;
    }

    public SieException(String code, String message, String data, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.data = data;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
