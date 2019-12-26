package com.sie.application.pc.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.joinforwin.toolkit.kit.ExceptionKit;
import com.sie.application.pc.entity.SieInstallation;
import com.sie.application.pc.mapper.SieInstallationMapper;
import com.sie.framework.kit.DockerHelper;
import com.sie.framework.kit.NodeInfoKit;
import com.sie.framework.kit.ShellHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.*;

/**
 * <p>
 * Title :LinuxScheduleService
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Author : wxxx 2018/10/8
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
@Service
public class LinuxScheduleService {

    @Autowired
    MsgService msgService;

    @Autowired
    NodeInfoKit nodeInfoKit;

    @Autowired
    SieInstallationMapper sieInstallationMapper;

    private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    private BlockingQueue queue = new LinkedBlockingDeque<>(10000);

    private ExecutorService executor = new ThreadPoolExecutor(10, 20, 10 * 60 * 1000, TimeUnit.MILLISECONDS, queue);

    private static String QUERY_CPUMEMORY_CMD = "top -b -n 1";

    private static String QUERY_DISK_CMD = "df -hl";

    private static String QUERY_CACHE_CMD = "free -m";

    public void connectSieInstallations() {
        List loginInfoList = getSieInstallationsIpList();
        loginInfoList.forEach(loginInfo -> {
                    executor.execute(new Runnable() {
                        @Override
                        public void run() {
                            listContainersMessages((Map) loginInfo);
                        }
                    });
                }
        );
    }

    /**
     * 去重获取sieInstallation里的ip、username、password
     */
    public List getSieInstallationsIpList() {
        List sieInstallationsIpList = new ArrayList();
        sieInstallationMapper.selectList(new EntityWrapper<SieInstallation>()).forEach(
                sieInstallation -> {
                    Map sieMap = new HashMap();
                    if (null != sieInstallation.getIp() && !sieInstallation.getIp().isEmpty()) {
                        sieMap.put("ip", sieInstallation.getIp());
                        sieMap.put("serverUserName", sieInstallation.getServerUserName());
                        sieMap.put("serverPassword", sieInstallation.getServerPassword());
                        sieInstallationsIpList.add(sieMap);
                    }
                }
        );
        List newList = new ArrayList(new HashSet(sieInstallationsIpList));
        return newList;
    }

    /**
     * cpuMemoryUsageMap=>key:{cpuUsage,memoryUsage}，diskUsageMap=>key:{diskUsage}
     *
     * @param loginInfoMap
     */
    public void listContainersMessages(Map loginInfoMap) {
        String format = simpleDateFormat.format(new Date());
        Map linuxUsageMap = new HashMap();
        DockerHelper dockerHelper = new DockerHelper(new ShellHelper(loginInfoMap.get("ip").toString(),
                loginInfoMap.get("serverUserName").toString(),
                loginInfoMap.get("serverPassword").toString()));
        try {
            listCmdResults(dockerHelper, linuxUsageMap, loginInfoMap);
        } catch (Exception e) {
            Map map = new HashMap() {{
                put("time", simpleDateFormat.format(new Date()));
                put("type", "system");
                put("nodeId", "");
                put("code", "LINUX_CONNECT_ERROR");
                put("tips", loginInfoMap.get("ip").toString() + "的Linux服务器连接失败");
                put("exceptionMessage", e.getMessage());
                put("exceptionType", e.getClass().getName());
                put("exceptionMessageDetail", ExceptionKit.getPrintMessage(e));
            }};
            msgService.onMessage(map);
        }

    }

    public void listCmdResults(DockerHelper dockerHelper, Map linuxUsageMap, Map loginInfoMap) {
        String format = simpleDateFormat.format(new Date());
        try {
            List cpuMemoryUsageList = new ArrayList(dockerHelper.getShellExecuteResult(QUERY_CPUMEMORY_CMD));
            List cacheMemoryUsageList = new ArrayList(dockerHelper.getShellExecuteResult(QUERY_CACHE_CMD));
            Map cpuMemoryUsageMap = getCpuMemoryUsageInfo(cpuMemoryUsageList, cacheMemoryUsageList);
            List diskUsageList = new ArrayList(dockerHelper.getShellExecuteResult(QUERY_DISK_CMD));
            Map diskUsageMap = getDiskUsageInfo(diskUsageList);
            linuxUsageMap = getLinuxMap(linuxUsageMap, loginInfoMap, cpuMemoryUsageMap, diskUsageMap);
            saveEsInfos(linuxUsageMap);
            sendLinuxMonitorMessage(linuxUsageMap);
        } catch (Exception e) {
            Map map = new HashMap() {{
                put("time", simpleDateFormat.format(new Date()));
                put("type", "system");
                put("nodeId", "");
                put("code", "LINUX_CMD_ERROR");
                put("tips", loginInfoMap.get("ip").toString() + "的Linux命令执行失败");
                put("exceptionMessage", e.getMessage());
                put("exceptionType", e.getClass().getName());
                put("exceptionMessageDetail", ExceptionKit.getPrintMessage(e));
            }};
            msgService.onMessage(map);
        }
    }

    public Map getLinuxMap(Map linuxUsageMap, Map loginInfoMap, Map cpuMemoryUsageMap, Map diskUsageMap) {
        linuxUsageMap.put("ip", loginInfoMap.get("ip").toString());
        linuxUsageMap.put("cpuUsage", cpuMemoryUsageMap.get("cpuUsage"));
        linuxUsageMap.put("memoryUsage", cpuMemoryUsageMap.get("memoryUsage"));
        linuxUsageMap.put("diskUsage", diskUsageMap.get("diskUsage"));
        linuxUsageMap.put("memoryUsageNoCache", cpuMemoryUsageMap.get("memoryUsageNoCache"));
        return linuxUsageMap;
    }

    public void saveEsInfos(Map map) {
        map.forEach((k, v) -> {
            String tips = "";
            String unit = "%";
            switch ((String) k) {
                case "ip":
                    tips = "IP";
                    unit = "";
                    break;
                case "cpuUsage":
                    tips = "CPU使用率";
                    break;
                case "memoryUsageNoCache":
                    tips = "内存使用率";
                    break;
                case "diskUsage":
                    tips = "磁盘使用率";
                    break;
                default:
                    break;
            }
            addValue(k, tips, v, unit);
        });
    }

    public void sendLinuxMonitorMessage(Map linuxUsageMap) {
        double usageThreshold = 95;
        double cpuUsage = (double) linuxUsageMap.get("cpuUsage");
        double memoryUsage = (double) linuxUsageMap.get("memoryUsage");
        double memoryUsageNoCache = (double) linuxUsageMap.get("memoryUsageNoCache");
        double diskUsage = (double) linuxUsageMap.get("diskUsage");
        String format = simpleDateFormat.format(new Date());
        String ip = linuxUsageMap.get("ip").toString();
        if (cpuUsage >= usageThreshold || memoryUsageNoCache >= usageThreshold || diskUsage >= usageThreshold) {
            Map map = new HashMap() {{
                put("time", simpleDateFormat.format(new Date()));
                put("type", "system");
                put("nodeId", "");
                put("code", "LINUX_USAGE_ERROR");
                put("tips", ip + "的Linux系统资源占用过高,CPU使用率:"
                        + cpuUsage + "%,内存使用率" + memoryUsageNoCache + "%,磁盘使用率" + diskUsage + "%");
            }};
            msgService.onMessage(map);
        }
    }

    public Map getCpuMemoryUsageInfo(List cpuMemoryUsageList, List cacheMemoryUsageList) {
        HashMap cpuMemoryUsageMap = new HashMap();
        //cpu信息
        String cpuInfo = cpuMemoryUsageList.get(2).toString();
        double cpuFreeDouble = Double.parseDouble(cpuInfo.substring(cpuInfo.indexOf("ni,") + 3, cpuInfo.indexOf("id")).replace(" ", ""));
        cpuMemoryUsageMap.put("cpuUsage", nodeInfoKit.stringToDouble(String.valueOf((100 - cpuFreeDouble))));
        //memory信息
        String memoryInfo = cpuMemoryUsageList.get(3).toString();
        String memoryTotal = memoryInfo.substring(memoryInfo.indexOf(":") + 1, memoryInfo.indexOf("total"));
        String memoryUsed = memoryInfo.substring(memoryInfo.indexOf("free,") + 6, memoryInfo.indexOf("used"));
        double memoryUsagePercent = getMemoryUsagePercent(memoryTotal.replace(" ", ""), memoryUsed.replace(" ", ""));
        cpuMemoryUsageMap.put("memoryUsage", memoryUsagePercent);
        //除去cache的memory信息
        String[] umnc = cacheMemoryUsageList.get(2).toString().split(" +");
        String[] um = cacheMemoryUsageList.get(1).toString().split(" +");
        double memoryNoCacheUsagePercent = getMemoryUsagePercent(um[1], umnc[2]);
        cpuMemoryUsageMap.put("memoryUsageNoCache", memoryNoCacheUsagePercent);
        return cpuMemoryUsageMap;
    }

    public double getMemoryUsagePercent(String memoryTotal, String memoryUsed) {
        Long memoryTotalInt = Long.parseLong(memoryTotal);
        Long memoryUsedInt = Long.parseLong(memoryUsed);
        double memoryUsagePercent = memoryUsedInt * 100 / memoryTotalInt;
        return memoryUsagePercent;
    }

    /**
     * 返回的数据格式
     * Filesystem            Size  Used Avail Use% Mounted on
     * /dev/sda3             442G  327G   93G  78% /
     * tmpfs                  32G     0   32G   0% /dev/shm
     * /dev/sda1             788M   60M  689M   8% /boot
     * /dev/md0              1.9T  483G  1.4T  26% /ezsonar
     * <p>
     * ====这里的变量avail和use不能删除,否则数据对应不上，会把avail，use算到size和used里，造成计算值错误。===
     *
     * @param commandResult 处理系统磁盘状态shell执行结果
     * @return 处理后的结果
     */
    private Map getDiskUsageInfo(List commandResult) {
        double size = 0, used = 0, avail = 0, use = 0;
        Map diskInfoMap = new HashMap();
        for (int i = 0; i <= commandResult.size() - 1; i++) {
            if (i == 0) {
                continue;
            }
            int temp = 0;
            for (String s : commandResult.get(i).toString().split(" ")) {
                if (temp == 0) {
                    temp++;
                    continue;
                }
                if (!s.trim().isEmpty()) {
                    if (temp == 1) {
                        size += disposeUnit(s);
                        temp++;
                    } else if (temp == 2) {
                        used += disposeUnit(s);
                        temp++;
                    } else if (temp == 3) {
                        avail += disposeUnit(s);
                        temp++;
                    } else if (temp == 4) {
                        use += disposeUnit(s);
                        temp = 0;
                    }
                }
            }
        }
        double diskUsage = ((Math.round(used * 100) / 100.0) * 100) / (Math.round(size * 100) / 100.0);
        diskInfoMap.put("diskUsage", (Math.round(diskUsage * 100) / 100.0));
        return diskInfoMap;
    }

    /**
     * 处理单位转换,转换为G
     *
     * @param s 带单位的数据字符串
     * @return 以G 为单位处理后的数值
     */
    private double disposeUnit(String s) {
        try {
            s = s.toUpperCase();
            String lastIndex = s.substring(s.length() - 1);
            String num = s.substring(0, s.length() - 1);
            Double parseDouble = Double.parseDouble(num);
            if (lastIndex.equals("G")) {
                return parseDouble;
            } else if (lastIndex.equals("T")) {
                return parseDouble * 1024;
            } else if (lastIndex.equals("M")) {
                return parseDouble / 1024;
            } else if (lastIndex.equals("K") || lastIndex.equals("KB")) {
                return parseDouble / (1024 * 1024);
            }
        } catch (NumberFormatException e) {
            return 0;
        }
        return 0;
    }

    public void addValue(Object key, String tips, Object value, String unit) {
        Map map = new HashMap<>();
        map.put("groupId", "Linux");
        map.put("tips", tips);
        map.put("key", key);
        map.put("value", value);
        map.put("unit", unit);
        map.put("createDate", simpleDateFormat.format(new Date()));
    }
}
