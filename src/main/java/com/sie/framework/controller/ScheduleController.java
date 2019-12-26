package com.sie.framework.controller;

import com.joinforwin.toolkit.result.Result;
import com.joinforwin.toolkit.result.ResultBuilder;
import com.sie.application.pc.service.DockerScheduleService;
import com.sie.application.pc.service.LinuxScheduleService;
import com.sie.application.pc.service.TaskScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api")
public class ScheduleController {
    @Autowired
    DockerScheduleService dockerScheduleService;

    @Autowired
    LinuxScheduleService linuxScheduleService;

    @Autowired
    TaskScheduleService taskScheduleService;

    @RequestMapping("docker")
    public void docker() {
        dockerScheduleService.connectSieInstallations();
    }

    @RequestMapping("linux")
    public void linux() {
        linuxScheduleService.connectSieInstallations();
    }

    @RequestMapping("task")
    public void task() throws Exception {
        taskScheduleService.queryNode();
    }
}