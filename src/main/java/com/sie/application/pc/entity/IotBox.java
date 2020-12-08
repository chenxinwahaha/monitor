package com.sie.application.pc.entity;

import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;

import java.io.Serializable;
import java.util.Date;

/**
 * iot设备对象 iot_box
 *
 * @author ruoyi
 * @date 2020-07-05
 */
public class IotBox extends Model<IotBox>
{
    private static final long serialVersionUID = 1L;

    /** 主键 */
    @TableId("id")
    private Long id;

    /** 编号 */
    @TableField("numer")
    private Long numer;

    /** 设备类型 */
    @TableField("type")
    private String type;

    /** 机器SN码 */
    @TableField("sn")
    private String sn;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNumer() {
        return numer;
    }

    public void setNumer(Long numer) {
        this.numer = numer;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    @Override
    protected Serializable pkVal() {
        return null;
    }
}
