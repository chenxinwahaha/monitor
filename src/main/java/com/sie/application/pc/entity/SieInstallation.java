package com.sie.application.pc.entity;

import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;

@TableName("SIE_INSTALLATION")
public class SieInstallation extends Model<SieInstallation> {

    private static final long serialVersionUID = 1L;

    @TableId("ID")
	private String id;
	@TableField("PROJECT_ID")
	private String projectId;
	@TableField("CONTENT")
	private String content;
	@TableField("CREATED_BY")
	private String createdBy;
	@TableField("CREATE_DATE")
	private Date createDate;
	@TableField("MODIFIED_BY")
	private String modifiedBy;
	@TableField("MODIFY_DATE")
	private Date modifyDate;
	@TableField("SERVER_USERNAME")
	private String serverUserName;
	@TableField("SERVER_PASSWORD")
	private String serverPassword;
	@TableField("IP")
	private String ip;


	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public Date getModifyDate() {
		return modifyDate;
	}

	public void setModifyDate(Date modifyDate) {
		this.modifyDate = modifyDate;
	}

    public String getServerUserName() {
        return serverUserName;
    }

    public void setServerUserName(String serverUserName) {
        this.serverUserName = serverUserName;
    }

    public String getServerPassword() {
        return serverPassword;
    }

    public void setServerPassword(String serverPassword) {
        this.serverPassword = serverPassword;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    @Override
	protected Serializable pkVal() {
		return this.id;
	}

	@Override
	public String toString() {
		return "SieInstallationService{" +
			"id=" + id +
			", projectId=" + projectId +
			", content=" + content +
			", createdBy=" + createdBy +
			", createDate=" + createDate +
			", modifiedBy=" + modifiedBy +
			", modifyDate=" + modifyDate +
			"}";
	}
}
