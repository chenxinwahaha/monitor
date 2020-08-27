package com.sie.application.pc.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.sie.application.pc.entity.SieNode;
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
public class NodeService extends ServiceImpl<SieNodeMapper, SieNode> {

    /**
     * 报告应用程序的健康指标
     * 路径
     * 定时删除一个月前的es
     */

    @Autowired
    SieNodeMapper nodeMapper;


    private Logger logger = LoggerFactory.getLogger(NodeService.class);

    private BlockingQueue queue = new LinkedBlockingDeque<>(10000);

    private ExecutorService executor = new ThreadPoolExecutor(10, 20, 10 * 60 * 1000, TimeUnit.MILLISECONDS, queue);

    public List queryNodeList() {
        return nodeMapper.selectList(new EntityWrapper<SieNode>().orderBy("NAME"));
    }


    public void deleteNode(Map param) {
        String id = (String) param.get("id");
        nodeMapper.deleteById(id);
    }

    public void updateNode(Map param) {
        JSONObject jsonObject = new JSONObject(param);
        SieNode node = jsonObject.toJavaObject(SieNode.class);
        nodeMapper.updateById(node);
    }

    public List queryEnableNodeList() {
        Wrapper entityWrapper = new EntityWrapper()
                .eq("STATUS_CODE", "enable")
                .orderBy("NAME");
        return nodeMapper.selectList(entityWrapper);
    }

    public List queryYesterdayNodeInfo() {
        List list = new ArrayList();
        List<SieNode> nodeList = nodeMapper.selectList(new EntityWrapper().orderBy("NAME"));
        CountDownLatch latch = new CountDownLatch(nodeList.size());
        if (null != nodeList) {
            for (SieNode node : nodeList) {
                Thread thread = new Thread() {
                    @Override
                    public void run() {
                        Boolean flag = queryNodeStatus(node);
                        if (flag) {
                            int diskUsage = 0, diskTotal = 0;
                            Map<String, Object> nodeInfo = getNodeInfo(node);
                            if (null != nodeInfo && null != nodeInfo.get("value")) {
                                Map<String, Object> value = (Map<String, Object>) nodeInfo.get("value");
                                Map<String, Object> jvm = (Map<String, Object>) value.get("jvm");
                                Integer usage = (Integer) jvm.get("usage");
                                Integer total = (Integer) jvm.get("total");
                                JSONArray disk = (JSONArray) value.get("disk");
                                for (int i = 0; i < disk.size(); i++) {
                                    diskUsage += Integer.parseInt(((JSONObject) disk.get(i)).get("usage").toString());
                                    diskTotal += Integer.parseInt(((JSONObject) disk.get(i)).get("total").toString());
                                }
                                Map<String, Object> ram = (Map<String, Object>) value.get("ram");
                                Integer ramUsage = (Integer) ram.get("usage");
                                Integer ramTotal = (Integer) ram.get("total");
                                double ramPercent = ramUsage * 100 / ramTotal;
                                double diskPercent = diskUsage * 100 / diskTotal;
                                double percent = usage * 100 / total;
                                if (percent >= 80 || diskPercent >= 80 || ramPercent >= 80) {
                                    StringBuilder stringBuilder = new StringBuilder("节点【").append(node.getName()).append("】");
                                    if (percent >= 80) {
                                        stringBuilder.append("JVM使用率:").append(percent).append("%");
                                        if (ramPercent >= 80 || diskPercent >= 80) {
                                            stringBuilder.append(";");
                                        } else {
                                            stringBuilder.append("\n");
                                        }
                                    }
                                    if (ramPercent >= 80) {
                                        stringBuilder.append("内存使用率:").append(ramPercent).append("%");
                                        if (diskPercent >= 80) {
                                            stringBuilder.append(";");
                                        } else {
                                            stringBuilder.append("\n");
                                        }
                                    }
                                    if (diskPercent >= 80) {
                                        stringBuilder.append("磁盘使用率:").append(diskPercent).append("%\n");
                                    }
                                    list.add(stringBuilder.toString());
                                }
                            }
                        } else {
                            StringBuilder stringBuilder = new StringBuilder("节点【").append(node.getName()).append("】目前无法连通\n");
                            list.add(stringBuilder.toString());
                        }
                        latch.countDown();
                    }
                };
                thread.start();
            }
        }
        try {
            latch.await();
        } catch (InterruptedException e) {
        }
        return list;
    }

    public Map<String, Object> getNodeInfo(SieNode node) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", node.getName());
        String url = "http://" + node.getIp() + ":" + node.getPort();
        try {
            String value = HttpKit.get(url, null, 5);
//            map.put("value", JSONObject.parse(value));
            return map;
        } catch (Exception e) {
            map.put("error", "节点异常");
            return map;
        }
    }

    public Boolean queryNodeStatus(SieNode sieNode) {
        String nodeIp = sieNode.getIp();
        String nodePort = sieNode.getPort();
        StringBuilder nodeBuilder = new StringBuilder("http://").append(nodeIp).append(":").append(nodePort).append("/ha/isAlive");
        try {
            String value = HttpKit.get(nodeBuilder.toString(), null, 5);
            if (null != value && "yes".equals(value)) {
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }

    public String getKeyword() {
        Calendar calendar = Calendar.getInstance();
        if (1 == calendar.get(Calendar.MONTH) + 1) {
            calendar.add(Calendar.YEAR, -1);
            calendar.set(Calendar.MONTH, 12);
        } else {
            calendar.add(Calendar.MONTH, -1);
        }
        return DateCalculatorKit.SIMPLE_DATE_FORMAT.format(calendar.getTime());
    }

}
