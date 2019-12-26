package com.sie.framework.kit;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;

/**
 * <p>
 * Title : 拼音码生成工具
 * </p>
 * <p>
 * Description: * GB 2312-80 把收录的汉字分成两级。第一级汉字是常用汉字，计 3755 个， 置于 16～55 区，按汉语拼音字母／笔形顺序排列；第二级汉字是次常用汉字， 计 3008 个，置于 56～87
 * 区，按部首／笔画顺序排列，所以本程序只能查到 对一级汉字的声母。同时对符合声母（zh，ch，sh）只能取首字母（z，c，s）
 * </p>
 * <p>
 * Author :欧瑞荫 Nov 17, 2011
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p>Copyright : ©2014-2014 江苏汇鑫融智软件科技有限公司 </p>
 */
public class PyKit {

    private static HanyuPinyinOutputFormat fm = new HanyuPinyinOutputFormat();

    /**
     * <p>
     * 作用描述：获取一个字符串的拼音码
     * </p>
     * <p>
     * 修改说明：
     * </p>
     *
     * @param
     * @return
     */
    public static String getPym(String word) {
        if (word == null || word.length() == 0) {
            return word;
        }
        try {
            fm.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
            String result = "";
            for (int i = 0; i < word.length(); i++) {
                char ch = word.charAt(i);
                if (Character.toString(ch).matches("[\\u4E00-\\u9FA5]+")) {
                    String[] py = PinyinHelper.toHanyuPinyinStringArray(ch, fm);
                    if (py != null && py.length > 0) {
                        result += py[0].substring(0, 1);
                    }
                } else {
                    result += ch;
                }
            }
            return result;
        } catch (Exception e) {
        }
        return null;
    }

    /**
     * <p>
     * 作用描述：该方法返回一个字符串的拼音，对于要做敏感字 检查时应该一个字一个字来获取其拼音以免无法 得知每个字对应的拼音。
     * </p>
     * <p>
     * 修改说明：
     * </p>
     *
     * @param word
     * @return
     */
    public static String getPinyin(String word) {
        if (word == null || word.length() == 0) {
            return word;
        }
        try {
            fm.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
            String result = "";
            for (int i = 0; i < word.length(); i++) {
                char ch = word.charAt(i);
                if (Character.toString(ch).matches("[\\u4E00-\\u9FA5]+")) {
                    String[] py = PinyinHelper.toHanyuPinyinStringArray(ch, fm);
                    if (py != null && py.length > 0) {
                        result += py[0];
                    }
                } else {
                    result += ch;
                }
            }
            return result;
        } catch (Exception e) {
        }
        return null;
    }
}