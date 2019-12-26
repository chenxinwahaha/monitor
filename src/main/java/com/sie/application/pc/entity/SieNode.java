package com.sie.application.pc.entity;

import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;

@TableName("SIE_NODE")
public class SieNode extends Model<SieNode> {

    private static final long serialVersionUID = 1L;

    @TableId("ID")
	private String id;
	@TableField("NAME")
	private String name;
	@TableField("IP")
	private String ip;
	@TableField("PORT")
	private String port;
	@TableField("STATUS_CODE")
	private String statusCode;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}

	@Override
	protected Serializable pkVal() {
		return this.id;
	}

}
