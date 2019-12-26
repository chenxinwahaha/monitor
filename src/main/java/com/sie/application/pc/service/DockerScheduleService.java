package com.sie.application.pc.service;

import com.alibaba.fastjson.JSON;
import com.joinforwin.toolkit.kit.ExceptionKit;
import com.sie.application.pc.mapper.SieInstallationMapper;
import com.sie.framework.kit.DockerHelper;
import com.sie.framework.kit.ShellHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 *
 * @author:陈鑫 </p>
 * <p>
 * @Date:2018/10/9 </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
@Service
public class DockerScheduleService {

    @Autowired
    LinuxScheduleService linuxScheduleService;

    @Autowired
    SieInstallationMapper sieInstallationMapper;

    @Autowired
    MsgService msgService;

    private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    private BlockingQueue queue = new LinkedBlockingDeque<>(10000);

    private ExecutorService executor = new ThreadPoolExecutor(10, 20, 10 * 60 * 1000, TimeUnit.MILLISECONDS, queue);

    private static String RUNNING_CONTAINER_CMD = "docker ps --filter status=running --format={{.Names}}";

    private static String EXITED_CONTAINER_CMD = "docker ps --filter status=exited --format={{.Names}}";

//    private static String CONTAINER_STATS_CMD = "docker stats --all --format \"table {{.Container}}\\t{{.MemUsage}}\" --no-stream $(docker ps --format={{.Names}})";

    private static String CONTAINER_STATS_CMD = "docker stats --no-stream -a $(docker ps --format={{.Names}})";

    private static String GB = "GB";

    private static String GiB = "GiB";

    private static String MiB = "MiB";

    private static String MB = "MB";

    private static Integer MEMORY_WARNING = 2;

    private static String DOCKER_VERSION = "docker -v";

    public void connectSieInstallations() {
        String format = simpleDateFormat.format(new Date());
        List<Map> sieInstallationsIpList = linuxScheduleService.getSieInstallationsIpList();
        sieInstallationsIpList.forEach(
                sieInstallation -> {
                    executor.execute(new Runnable() {
                        @Override
                        public void run() {
                            ShellHelper shellHelper = new ShellHelper(sieInstallation.get("ip").toString(),
                                    sieInstallation.get("serverUserName").toString(),
                                    sieInstallation.get("serverPassword").toString());
                            DockerHelper dockerHelper = new DockerHelper(shellHelper);
                            try {
                                listCmdResults(dockerHelper);
                                listRunningContainer(dockerHelper);
                            } catch (Exception e) {
                                Map map = new HashMap() {{
                                    put("time", simpleDateFormat.format(new Date()));
                                    put("type", "system");
                                    put("nodeId", "");
                                    put("code", "DOCKER_CONNECT_ERROR");
                                    put("tips", sieInstallation.get("ip") + "连接失败");
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

    public void listCmdResults(DockerHelper dockerHelper) {
        String format = simpleDateFormat.format(new Date());
        List<String> dockerVersion = dockerHelper.getShellExecuteResult(DOCKER_VERSION);
        try {
            listContainerStats(dockerHelper);
        } catch (Exception e) {
            Map map = new HashMap() {{
                put("time", simpleDateFormat.format(new Date()));
                put("type", "system");
                put("nodeId", "");
                put("code", "DOCKER_CMD_ERROR");
                put("tips", JSON.toJSONString(dockerVersion) + CONTAINER_STATS_CMD + "命令执行失败");
                put("exceptionMessage", e.getMessage());
                put("exceptionType", e.getClass().getName());
                put("exceptionMessageDetail", ExceptionKit.getPrintMessage(e));
            }};
            msgService.onMessage(map);
        }
    }


    public void listRunningContainer(DockerHelper dockerHelper) {
        List<String> runningContainerResult = dockerHelper.getShellExecuteResult(RUNNING_CONTAINER_CMD);
        deleteTitle(runningContainerResult);
        Map map = new HashMap() {{
            put("time", simpleDateFormat.format(new Date()));
            put("type", "system");
            put("nodeId", "");
            put("code", "CONTAINER_RUNNING");
            put("tips", "容器名称：" + runningContainerResult.toString());
        }};
        msgService.onMessage(map);
    }

    public void listExitedContainer(DockerHelper dockerHelper) {
        List<String> runningContainerResult = dockerHelper.getShellExecuteResult(EXITED_CONTAINER_CMD);
        deleteTitle(runningContainerResult);
        runningContainerResult.forEach(value -> {
            addValue("exitedContainer", "停用的容器", value, "");
        });
    }

    public void listContainerStats(DockerHelper dockerHelper) {
        List<String> containerStatsResult = dockerHelper.getShellExecuteResult(CONTAINER_STATS_CMD);
        deleteTitle(containerStatsResult);
        containerStatsResult.forEach(content -> {
            monitorMemory(content);
        });
    }

    public void monitorMemory(String content) {
        String[] contents = content.split("\\s+");
        String s = contents[3];
        if (s.contains(MiB)) {
            String memory = s.split(MiB)[0];
            addWarningMiB(memory, contents);
        } else if (s.contains(GiB)) {
            String memory = s.split(GiB)[0];
            addWarning(memory, contents);
        }
    }

    public void addValue(String key, String tips, String value, String unit) {
        Map map = new HashMap<>();
        map.put("groupId", "Docker");
        map.put("tips", tips);
        map.put("key", key);
        map.put("value", value);
        map.put("unit", unit);
        map.put("createDate", simpleDateFormat.format(new Date()));
    }

    public void addWarning(String memory, String[] contents) {
        if (Double.parseDouble(memory) > MEMORY_WARNING) {
            Map map = new HashMap() {{
                put("time", simpleDateFormat.format(new Date()));
                put("type", "system");
                put("nodeId", "");
                put("code", "CONTAINER_MEMORY_WARNING");
                put("tips", "容器名称：" + contents[1] + "\n" + "内存使用情况：" + contents[3]);
            }};
            msgService.onMessage(map);
        }
    }

    public void addWarningMiB(String memory, String[] contents) {
        if (Double.parseDouble(memory) > 1000) {
            Map map = new HashMap() {{
                put("time", simpleDateFormat.format(new Date()));
                put("type", "system");
                put("nodeId", "");
                put("code", "CONTAINER_MEMORY_WARNING");
                put("tips", "容器名称：" + contents[1] + "\n" + "内存使用情况：" + contents[3]);
            }};
            msgService.onMessage(map);
        }
    }

    public void deleteTitle(List<String> list) {
        if (null != list && !list.isEmpty()) {
            list.remove(0);
        }
    }
}
