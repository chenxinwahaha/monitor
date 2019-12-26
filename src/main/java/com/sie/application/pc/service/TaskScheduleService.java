package com.sie.application.pc.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.joinforwin.toolkit.kit.ExceptionKit;
import com.joinforwin.toolkit.kit.IdKit;
import com.sie.application.pc.entity.SieNode;
import com.sie.framework.kit.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.*;

@Service
public class TaskScheduleService {
    private static Logger logger = LoggerFactory.getLogger(TaskScheduleService.class);

    @Autowired
    MsgService msgService;

    @Autowired
    NodeService nodeService;

    @Autowired
    NodeInfoKit nodeInfoKit;

    private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");


    private BlockingQueue queue = new LinkedBlockingDeque<>(10000);

    private ExecutorService executor = new ThreadPoolExecutor(10, 20, 10 * 60 * 1000, TimeUnit.MILLISECONDS, queue);


    public void queryNode() throws Exception {
        List<SieNode> nodeList = nodeService.queryNodeList();
        List resultList = new ArrayList();
        nodeList.forEach(
                node -> {
                    executor.execute(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                Map<String, Object> result = nodeService.getNodeInfo(node);
                                if (result.get("error")!=null){
                                    Map map = new HashMap() {{
                                        put("time", simpleDateFormat.format(new Date()));
                                        put("type", "system");
                                        put("nodeId", "");
                                        put("code", "NODE_CONNECT_ERROR");
                                        put("tips", node.getName() + "连接失败");
                                    }};
                                    msgService.onMessage(map);
                                }
                            } catch (Exception e) {
                                Map map = new HashMap() {{
                                    put("time", simpleDateFormat.format(new Date()));
                                    put("type", "system");
                                    put("nodeId", "");
                                    put("code", "NODE_CONNECT_ERROR");
                                    put("tips", node.getName() + "连接失败");
                                    put("exceptionMessage", e.getMessage());
                                    put("exceptionType", e.getClass().getName());
                                    put("exceptionMessageDetail", ExceptionKit.getPrintMessage(e));
                                }};
                                msgService.onMessage(map);
                            }
                        }
                    });
                }
        );
    }
}
