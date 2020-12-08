package com.sie.application.pc.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.sie.application.pc.entity.IotReqResLog;
import com.sie.application.pc.entity.JianYeOrg;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface JianYeOrgMapper extends BaseMapper<JianYeOrg>{

}
