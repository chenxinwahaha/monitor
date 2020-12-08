package com.sie.application.pc.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.google.gson.JsonArray;
import com.joinforwin.toolkit.result.Result;
import com.joinforwin.toolkit.result.ResultBuilder;
import com.sie.application.pc.entity.IotReqResLog;
import com.sie.application.pc.entity.JianYeOrg;
import com.sie.application.pc.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("transaction")
public class IotController {
    @Autowired
    IotReqService iotReqService;

    @Autowired
    JianYeOrgService jianYeOrgService;

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

    @RequestMapping("selectIotBoxListByOrg")
    public Result selectIotBoxListByOrg() {
        List list = iotReqService.selectIotBoxListByOrg();
        return ResultBuilder.withPayload(list).build();
    }

    @RequestMapping("queryTransactionByDateJianye")
    public Result queryTransactionByDateJianye(@RequestBody Map map) {
        List<IotReqResLog> jsonElements = new ArrayList<>();
        List<JianYeOrg> jianYeOrgs = jianYeOrgService.selectList(null);
        List<IotReqResLog> list = iotReqService.queryIotListByDate((Integer) map.get("type"));
        if (list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                IotReqResLog iotReqResLog = list.get(i);
                String organizer = iotReqResLog.getOrganizer();
                Boolean flag = false;
                for (int j = 0; j < jianYeOrgs.size(); j++) {
                    JianYeOrg jianYeOrg = jianYeOrgs.get(j);
                    if (jianYeOrg.getName().equals(organizer)) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    jsonElements.add(iotReqResLog);
                }
            }
        }
        return ResultBuilder.withPayload(jsonElements).build();
    }

    @RequestMapping("monitorNodeJianye")
    public Result monitorNodeJianye() {
        List list = iotReqService.queryIotList();
        return ResultBuilder.withPayload(list).build();
    }

    @RequestMapping("selectIotBoxListByOrgJianye")
    public Result selectIotBoxListByOrgJianye() {
        List<IotReqResLog> jsonElements = new ArrayList<>();
        List<JianYeOrg> jianYeOrgs = jianYeOrgService.selectList(null);
        List<IotReqResLog> list = iotReqService.selectIotBoxListByOrg();
        if (list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                IotReqResLog iotReqResLog = list.get(i);
                String organizer = iotReqResLog.getOrganizer();
                Boolean flag = false;
                for (int j = 0; j < jianYeOrgs.size(); j++) {
                    JianYeOrg jianYeOrg = jianYeOrgs.get(j);
                    if (jianYeOrg.getName().equals(organizer)) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    jsonElements.add(iotReqResLog);
                }
            }
        }
        return ResultBuilder.withPayload(jsonElements).build();
    }
}