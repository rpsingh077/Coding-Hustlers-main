import { useState, useEffect } from 'react';
import { X, Lightbulb, BookOpen } from 'lucide-react';

interface ChapterOverviewProps {
  chapterTitle: string;
  chapterDescription: string;
  difficulty: string;
  onContinue: () => void;
}

interface OverviewContent {
  overview: string;
  proTip: string;
}

async function generateChapterOverview(title: string, description: string, difficulty: string): Promise<OverviewContent> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Generate a brief overview for a programming chapter.

Chapter Title: ${title}
Description: ${description}
Difficulty: ${difficulty}

Please provide:
1. A concise overview (5-7 lines) explaining what the learner will learn and how it will help them in next levels. Focus on theory only.
2. A practical pro tip related to this topic.

Return ONLY a JSON object with this structure (no markdown, no asterisks):
{
  "overview": "Plain text overview here",
  "proTip": "Plain text pro tip here"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      overview: parsed.overview.replace(/\*/g, '').trim(),
      proTip: parsed.proTip.replace(/\*/g, '').trim()
    };
  }

  throw new Error('Failed to generate overview');
}

const ChapterOverview = ({ chapterTitle, chapterDescription, difficulty, onContinue }: ChapterOverviewProps) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<OverviewContent | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        const overview = await generateChapterOverview(chapterTitle, chapterDescription, difficulty);
        setContent(overview);
      } catch (err) {
        console.error('Error generating overview:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [chapterTitle, chapterDescription, difficulty]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
        background: `
          radial-gradient(27.33% 40.65% at 78.12% 29.89%, #F5FF7F 0%, rgba(48, 83, 118, 0) 100%),
          radial-gradient(33.55% 50.83% at 55.38% 89.56%, #8CBCFE 0%, rgba(221, 130, 255, 0) 100%),
          radial-gradient(58.68% 99.14% at 0% 0%, #C2F9F9 0%, rgba(83, 214, 255, 0) 100%),
          radial-gradient(30.1% 50.86% at 100% 100%, #9949FF 0%, rgba(255, 81, 217, 0) 100%),
          #F5F5F5
        `
      }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-['Syne'] text-lg">Preparing your chapter overview...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    onContinue();
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: `
        radial-gradient(27.33% 40.65% at 78.12% 29.89%, #F5FF7F 0%, rgba(48, 83, 118, 0) 100%),
        radial-gradient(33.55% 50.83% at 55.38% 89.56%, #8CBCFE 0%, rgba(221, 130, 255, 0) 100%),
        radial-gradient(58.68% 99.14% at 0% 0%, #C2F9F9 0%, rgba(83, 214, 255, 0) 100%),
        radial-gradient(30.1% 50.86% at 100% 100%, #9949FF 0%, rgba(255, 81, 217, 0) 100%),
        #F5F5F5
      `
    }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <h2 className="text-lg sm:text-2xl font-bold font-['Syne'] text-white">Chapter Overview</h2>
              </div>
              <h3 className="text-base sm:text-xl font-semibold font-['Syne'] text-white/90">{chapterTitle}</h3>
            </div>
            <button
              onClick={onContinue}
              className="ml-2 sm:ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          <div>
            <h4 className="font-['Syne'] font-bold text-gray-800 text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              What You Will Learn
            </h4>
            <p className="text-gray-700 font-['Syne'] leading-relaxed text-sm sm:text-base">
              {content.overview}
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 sm:p-6">
            <h4 className="font-['Syne'] font-bold text-gray-800 text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0" />
              Pro Tip
            </h4>
            <p className="text-gray-700 font-['Syne'] leading-relaxed text-sm sm:text-base">
              {content.proTip}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 sm:pt-4">
            <button
              onClick={onContinue}
              className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-xl font-['Syne'] text-base sm:text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Chapter Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterOverview;
