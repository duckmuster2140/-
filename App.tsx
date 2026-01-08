
import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Layout, 
  Copy, 
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AnalysisStatus, VideoAnalysis } from './types';
import { analyzeVideo } from './services/geminiService';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<VideoAnalysis | null>(null);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url) {
      setError('请输入有效的视频链接');
      return;
    }
    
    setStatus(AnalysisStatus.LOADING);
    setError('');
    
    try {
      const data = await analyzeVideo(url, note);
      setResult(data);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || '系统繁忙，请稍后重试');
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-morphism border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              ViralVideo <span className="text-blue-600">Insight</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">爆款库</a>
            <a href="#" className="hover:text-blue-600 transition-colors">文案工坊</a>
            <a href="#" className="hover:text-blue-600 transition-colors">VIP特权</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-8 lg:mt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            短视频 <span className="gradient-text">核心资产</span> 拆解专家
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            输入任何热门视频链接，AI 将为你拆解背后的流量密码、脚本逻辑及改写高转化文案。
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 mb-12 border border-gray-100">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                视频直链 URL
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ExternalLink className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="粘贴抖音、快手等平台无水印视频链接..."
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                可选备注（标题、需求、受众等）
              </label>
              <textarea
                placeholder="例如：这是个知识分享类视频，我想针对大学生群体重写，强调副业赚钱..."
                rows={2}
                className="block w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={status === AnalysisStatus.LOADING}
              className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 text-white font-bold transition-all ${
                status === AnalysisStatus.LOADING 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30'
              }`}
            >
              {status === AnalysisStatus.LOADING ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>AI 正在深度拆解内容，请稍候...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>立即开始爆款拆解</span>
                </>
              )}
            </button>
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Area */}
        {status === AnalysisStatus.SUCCESS && result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sidebar / Quick Navigation */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 space-y-2">
                {[
                  { icon: FileText, label: '基础信息' },
                  { icon: TrendingUp, label: '核心总结' },
                  { icon: Layout, label: '节奏拆解' },
                  { icon: MessageSquare, label: '话术逻辑' },
                  { icon: TrendingUp, label: '爆款原因' },
                  { icon: FileText, label: '可复用模板' },
                  { icon: MessageSquare, label: '文案改写' },
                  { icon: Copy, label: '标题建议' },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-600 rounded-lg transition-all border border-transparent hover:border-blue-100">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-8">
              {/* Section 1 & 2: Overview */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-50 p-6 border-b border-blue-100">
                  <h2 className="text-xl font-bold text-blue-900 flex items-center">
                    <FileText className="mr-2 w-5 h-5" />
                    视频基础信息 & 核心总结
                  </h2>
                </div>
                <div className="p-6">
                  <div className="mb-8 prose max-w-none text-gray-700">
                    <p className="whitespace-pre-wrap leading-relaxed">{result.basicInfo}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {result.summary.map((point, idx) => (
                      <div key={idx} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <p className="text-sm font-medium text-gray-800">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Detailed Breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Layout className="mr-2 w-5 h-5 text-indigo-600" />
                  分镜与节奏拆解（专业级）
                </h2>
                <div className="relative pl-6 border-l-2 border-dashed border-indigo-100 space-y-8">
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-loose">
                    {result.breakdown}
                  </div>
                </div>
              </div>

              {/* Section 4 & 5 & 6: Strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="mr-2 w-5 h-5 text-emerald-600" />
                    话术逻辑拆解
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.logic}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="mr-2 w-5 h-5 text-orange-600" />
                    运营视角：爆款原因
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.viralReasons}</p>
                </div>
              </div>

              {/* Section 7: Templates */}
              <div className="bg-gray-900 rounded-2xl shadow-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-8 flex items-center">
                  <Zap className="mr-2 w-6 h-6 text-yellow-400 fill-yellow-400" />
                  可直接复用的爆款模板
                </h2>
                <div className="space-y-6">
                  {result.templates.map((tpl, i) => (
                    <div key={i} className="group relative bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
                      <button 
                        onClick={() => copyToClipboard(tpl, `tpl-${i}`)}
                        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                      >
                        {copyStatus === `tpl-${i}` ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                      <pre className="text-sm font-mono whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {tpl}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 8: Rewrites */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">爆款文案改写 (5条)</h2>
                <div className="space-y-4">
                  {result.rewrites.map((text, i) => (
                    <div key={i} className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex justify-between items-start group">
                      <p className="text-sm text-gray-800 leading-relaxed flex-1 mr-4">{text}</p>
                      <button 
                        onClick={() => copyToClipboard(text, `rw-${i}`)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                      >
                        {copyStatus === `rw-${i}` ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 10: Titles */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">抖音 SEO 爆款标题 (20条)</h2>
                  <button className="text-sm text-blue-600 font-medium flex items-center hover:underline">
                    下载完整报告 <Download className="ml-1 w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.titleSuggestions.map((title, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                      <span className="text-sm text-gray-700 truncate mr-2">{title}</span>
                      <button 
                        onClick={() => copyToClipboard(title, `title-${i}`)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copyStatus === `title-${i}` ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {status === AnalysisStatus.IDLE && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 space-y-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900">1. 输入链接</h3>
              <p className="text-sm text-gray-500 leading-relaxed">支持主流短视频平台，粘贴即可开始深度分析</p>
            </div>
            <div className="text-center p-6 space-y-4">
              <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900">2. AI 智能拆解</h3>
              <p className="text-sm text-gray-500 leading-relaxed">毫秒级还原分镜、话术、爆款逻辑及运营策略</p>
            </div>
            <div className="text-center p-6 space-y-4">
              <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <Copy className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900">3. 直接服用</h3>
              <p className="text-sm text-gray-500 leading-relaxed">获得可直接口播的文案及符合 SEO 的爆款标题</p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-24 py-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gray-900 p-1 rounded">
              <Zap className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold">ViralVideo Insight</span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 ViralVideo Insight. 专业短视频内容生产力工具.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
