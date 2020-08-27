package com.sie.application.pc.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.joinforwin.toolkit.result.Result;
import com.joinforwin.toolkit.result.ResultBuilder;
import com.sie.application.pc.service.DockerScheduleService;
import com.sie.application.pc.service.IotReqService;
import com.sie.application.pc.service.LinuxScheduleService;
import com.sie.application.pc.service.TaskScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("transaction")
public class IotController {
    @Autowired
    IotReqService iotReqService;

    @RequestMapping("queryTransactionByDate")
    public Result queryTransactionByDate(@RequestBody Map map) {
        List list = iotReqService.queryIotListByDate((Integer) map.get("type"));
        return ResultBuilder.withPayload(list).build();
    }

    @RequestMapping("monitorNode")
    public Result monitorNode() {
        List list = iotReqService.queryIotList();
        return ResultBuilder.withPayload(list).build();
    }
}