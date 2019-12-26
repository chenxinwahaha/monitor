package com.sie.framework.schedule;

import com.sie.application.pc.service.DockerScheduleService;
import com.sie.application.pc.service.LinuxScheduleService;
import com.sie.application.pc.service.NodeService;
import com.sie.application.pc.service.TaskScheduleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 任务调度
 *
 * @author cx
 */
@Component
public class Jobs {

    private static Logger logger = LoggerFactory.getLogger(Jobs.class);


    @Autowired
    NodeService nodeService;

    @Autowired
    TaskScheduleService taskScheduleService;

    @Autowired
    LinuxScheduleService linuxScheduleService;

    @Autowired
    DockerScheduleService dockerScheduleService;

    /**
     * docker监控
     */
    @Scheduled(cron = "0 0 9 * * ? ")
    public void scheduledMonitorDocker() {
        dockerScheduleService.connectSieInstallations();
    }

    /**
     * linux监控 LinuxScheduleService
     */
    @Scheduled(cron = "0 0 9 * * ? ")
    public void scheduledLinuxMonitor() {
        linuxScheduleService.connectSieInstallations();
    }

    /**
     * 节点
     *
     * @throws Exception
     */
    @Scheduled(cron = "0 0 0/1 * * ? ")
    public void scheduledNodeInfoTask() throws Exception {
        taskScheduleService.queryNode();
    }
}
