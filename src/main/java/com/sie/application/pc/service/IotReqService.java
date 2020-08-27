package com.sie.application.pc.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.sie.application.pc.entity.IotReqResLog;
import com.sie.application.pc.entity.SieNode;
import com.sie.application.pc.mapper.IotReqMapper;
import com.sie.application.pc.mapper.SieNodeMapper;
import com.sie.framework.kit.DateCalculatorKit;
import com.sie.framework.kit.HttpKit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.*;

@Service
public class IotReqService extends ServiceImpl<IotReqMapper, IotReqResLog> {

    @Autowired
    IotReqMapper iotReqMapper;

    public List<IotReqResLog> queryIotList(){
        return iotReqMapper.queryIotList();
    }


    public List<IotReqResLog> queryIotListByDate(Integer type){
        List<IotReqResLog> list = new ArrayList<>();
        Date beforeDate = getTimesmorning();
        Date afterDate = getTimesevening();
        switch (type) {
            case 1:
                //今日
                list = iotReqMapper.queryIotListByDate(beforeDate, new Date());
                break;
            case 2:
                //昨日
                beforeDate = new Date(beforeDate.getTime() - 86400000L);
                afterDate = new Date(afterDate.getTime() - 86400000L);
                list = iotReqMapper.queryIotListByDate(beforeDate, afterDate);
                break;
            case 3:
                //本周
                beforeDate = getBeginDayOfWeek();
                list = iotReqMapper.queryIotListByDate(beforeDate, new Date());
                break;
            default:
                break;
        }
        return list;
    }

    public Date getTimesmorning() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        return cal.getTime();
    }

    public Date getTimesevening() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        return cal.getTime();
    }

    public Date getThirtyDaysBefore(Date date) {
        Calendar theCa = Calendar.getInstance();
        theCa.setTime(date);
        //最后一个数字30可改，30天的意思
        theCa.add(Calendar.DATE, -30);
        return theCa.getTime();
    }

    /**
     * 获取本周的开始时间
     *
     * @return
     */
    public Date getBeginDayOfWeek() {
        Date date = getTimesmorning();
        if (date == null) {
            return null;
        }
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int dayofweek = cal.get(Calendar.DAY_OF_WEEK);
        if (dayofweek == 1) {
            dayofweek += 7;
        }
        cal.add(Calendar.DATE, 2 - dayofweek);
        return cal.getTime();
    }
}
