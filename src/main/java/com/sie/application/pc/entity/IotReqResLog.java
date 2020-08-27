package com.sie.application.pc.entity;



import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;

@TableName("iot_req_res_log")
public class IotReqResLog extends Model<IotReqResLog> {
    /**
     * 主键
     */
    @TableId("id")
    private Long id;

    /**
     * 姓名
     */
    @TableField("name")
    private String name;

    @TableField("act_no")
    private String actNo;

    /**
     * 活动标题
     */
    @TableField("title")
    private String title;

    /**
     * 状态码
     */
    @TableField("status_code")
    private String statusCode;

    /**
     * 设备ID
     */
    @TableField("box_id")
    private Long boxId;

    @TableField("name")
    private String boxSn;

    /**
     * 提示信息
     */
    @TableField("message")
    private String message;

    /**
     * 主办单位
     */
    @TableField("organizer")
    private String organizer;

    /**
     * 活动地点
     */
    @TableField("organize_location")
    private String organizeLocation;

    /**
     * 消耗时间
     */
    @TableField("consume_time")
    private Long consumeTime;

    /**
     * 调用请求的openId
     */
    @TableField("open_key_id")
    private Integer openKeyId;

    /**
     * 身份证
     */
    @TableField("userid")
    private String userid;

    /**
     * 状态码
     */
    @TableField("level_data")
    private String levelData;

    /**
     * 红码原因
     */
    @TableField("exception_code_reason")
    private String exceptionCodeReason;

    /**
     * 温度
     */
    @TableField("temperature")
    private Double temperature;

    /**
     * 创建时间
     */
    @TableField("create_time")
    private Date createTime;

    @TableField(exist = false)
    private String num;
    /**
     *  自己的
     */
    @Override
    protected Serializable pkVal() {
        return null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getActNo() {
        return actNo;
    }

    public void setActNo(String actNo) {
        this.actNo = actNo;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public Long getBoxId() {
        return boxId;
    }

    public void setBoxId(Long boxId) {
        this.boxId = boxId;
    }

    public String getBoxSn() {
        return boxSn;
    }

    public void setBoxSn(String boxSn) {
        this.boxSn = boxSn;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public String getOrganizeLocation() {
        return organizeLocation;
    }

    public void setOrganizeLocation(String organizeLocation) {
        this.organizeLocation = organizeLocation;
    }

    public Long getConsumeTime() {
        return consumeTime;
    }

    public void setConsumeTime(Long consumeTime) {
        this.consumeTime = consumeTime;
    }

    public Integer getOpenKeyId() {
        return openKeyId;
    }

    public void setOpenKeyId(Integer openKeyId) {
        this.openKeyId = openKeyId;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getLevelData() {
        return levelData;
    }

    public void setLevelData(String levelData) {
        this.levelData = levelData;
    }

    public String getExceptionCodeReason() {
        return exceptionCodeReason;
    }

    public void setExceptionCodeReason(String exceptionCodeReason) {
        this.exceptionCodeReason = exceptionCodeReason;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getNum() {
        return num;
    }

    public void setNum(String num) {
        this.num = num;
    }


}
