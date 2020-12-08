package com.sie.application.pc.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.sie.application.pc.entity.IotBox;
import com.sie.application.pc.entity.IotReqResLog;
import com.sie.application.pc.entity.SieNode;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface IotReqMapper extends BaseMapper<IotReqResLog>{
    List<IotReqResLog> queryIotList();
    List<IotReqResLog> queryIotListByDate(@Param("b") Date b,@Param("e") Date e);
    List<IotReqResLog> selectIotBoxListByOrg();
}
