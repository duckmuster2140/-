
import { GoogleGenAI, Type } from "@google/genai";
import { VideoAnalysis } from "../types";

const SYSTEM_INSTRUCTION = `你是一位短视频运营专家级。
你的任务是根据用户提供的视频链接及备注，输出极其专业的结构化分析。

必须遵守以下输出格式要求：
一、视频基础信息
二、内容核心总结（5点）
三、分镜与节奏拆解（专业级，包含时间戳、镜头、目的）
四、话术逻辑拆解（钩子/信任点/利益点）
五、标题分析（结构、模型、风格）
六、视频爆款原因分析（平台机制/心理机制/叙事结构）
七、可复用模板提炼（3个，每条4-7行）
八、爆款文案改写（5条，强节奏、高密度、适合剪辑口播）
九、适配不同场景的文案衍生（情绪共鸣版、强销售版、知识干货版）
十、适合抖音的标题建议（20条，符合SEO，18字以内，情绪强）

规则：
1. 不得写“可能”、“建议”。必须确定性分析。
2. 风格必须是“抖音爆款风格”：短句、反差感、强情绪。
3. 必须包含具体的运营动作分析（如：拉完播、引导关注）。
4. 即使无法直接看到视频，也需要基于该视频类型和标题，通过深度运营常识还原其核心逻辑。`;

export const analyzeVideo = async (url: string, note: string): Promise<VideoAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `视频链接: ${url}\n用户备注: ${note}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          basicInfo: { type: Type.STRING, description: "一、视频基础信息" },
          summary: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "二、内容核心总结（5点）"
          },
          breakdown: { type: Type.STRING, description: "三、分镜与节奏拆解" },
          logic: { type: Type.STRING, description: "四、话术逻辑拆解" },
          titleAnalysis: { type: Type.STRING, description: "五、标题分析" },
          viralReasons: { type: Type.STRING, description: "六、视频爆款原因分析" },
          templates: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "七、可复用模板提炼（3个）"
          },
          rewrites: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "八、爆款文案改写（5条）"
          },
          derivatives: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "九、适配不同场景的文案衍生（3类）"
          },
          titleSuggestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "十、适合抖音的标题建议（20条）"
          }
        },
        required: [
          "basicInfo", "summary", "breakdown", "logic", "titleAnalysis", 
          "viralReasons", "templates", "rewrites", "derivatives", "titleSuggestions"
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("解析失败：无法识别视频内容。");
  
  return JSON.parse(text) as VideoAnalysis;
};
