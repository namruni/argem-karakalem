import React, { useState } from 'react';
import { Search, Loader2, Download, AlertCircle, Star, Heart, Cloud } from 'lucide-react';
import { validateInput, generateSketches } from '../services/geminiService';
import { GeneratedImage, GenerationStatus } from '../types';

interface SketchGeneratorProps {
  apiKey: string;
}

const SketchGenerator: React.FC<SketchGeneratorProps> = ({ apiKey }) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setStatus(GenerationStatus.VALIDATING);
    setErrorMsg('');
    setImages([]);

    try {
      // Step 1: Validate
      const validation = await validateInput(apiKey, input.trim());
      
      if (!validation.isValid) {
        setStatus(GenerationStatus.ERROR);
        setErrorMsg(validation.reason || "Geçersiz giriş. Lütfen somut bir nesne adı giriniz.");
        return;
      }

      // Step 2: Generate
      setStatus(GenerationStatus.GENERATING);
      const generatedImages = await generateSketches(apiKey, validation.sanitizedQuery || input.trim());
      
      setImages(generatedImages);
      setStatus(GenerationStatus.SUCCESS);
      
    } catch (error: any) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
      setErrorMsg(error.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const downloadImage = (base64Data: string, index: number) => {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = `argem_sketch_vangogh_${input.replace(/\s+/g, '_')}_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 w-full">
      
      {/* Kawaii Container */}
      <div className="relative bg-white dark:bg-zinc-900 border-4 border-dashed border-gray-800 dark:border-gray-200 rounded-[3rem] p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] transition-all">
        
        {/* Decorative Elements (Kawaii Vibes) */}
        <div className="absolute -top-6 -left-6 text-gray-800 dark:text-gray-200 rotate-[-12deg] hidden md:block">
          <Star className="w-12 h-12 fill-current opacity-20" />
        </div>
        <div className="absolute -bottom-6 -right-6 text-gray-800 dark:text-gray-200 rotate-[12deg] hidden md:block">
          <Heart className="w-12 h-12 fill-current opacity-20" />
        </div>

        {/* Atatürk Portrait - Centered & Framed */}
        <div className="flex justify-center mb-8 relative z-10">
           <div className="relative group perspective-1000">
              {/* Pushpin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-700 shadow-sm z-20 border border-black/20"></div>
              
              {/* Photo Frame */}
              <div className="bg-white p-2 pb-8 shadow-lg rotate-1 border border-gray-200 transform transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105">
                 <img 
                   src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Gazi_Mustafa_Kemal_Atat%C3%BCrk.jpg/477px-Gazi_Mustafa_Kemal_Atat%C3%BCrk.jpg" 
                   alt="Mustafa Kemal Atatürk" 
                   className="w-32 h-44 object-cover grayscale sepia-[.15]"
                 />
                 <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span className="font-handwritten text-gray-500 text-sm font-bold">Başöğretmen</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-4xl md:text-5xl font-handwritten text-center mb-4 font-bold tracking-wide text-gray-800 dark:text-gray-100">
             ARGEM Sanat Atölyesi
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-lg text-lg font-handwritten leading-relaxed">
            Van Gogh tarzında kara kalem çizimler oluşturmak için bir nesne adı girin.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-lg mx-auto mb-8 relative z-10">
          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Buraya yazın (Örn: Çiçek)..."
              className="relative w-full bg-white dark:bg-zinc-950 border-2 border-gray-800 dark:border-gray-200 rounded-2xl py-4 px-6 text-2xl font-handwritten text-center focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-zinc-800 transition-all placeholder:text-gray-300 dark:placeholder:text-zinc-700"
              disabled={status === GenerationStatus.VALIDATING || status === GenerationStatus.GENERATING}
            />
            <button 
              type="submit"
              disabled={!input || status === GenerationStatus.VALIDATING || status === GenerationStatus.GENERATING}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Status Indicators */}
          <div className="h-8 mt-4 flex items-center justify-center font-handwritten text-lg font-bold">
            {status === GenerationStatus.VALIDATING && (
              <span className="flex items-center gap-2 text-gray-500 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                Öğretmen kontrol ediyor...
              </span>
            )}
            {status === GenerationStatus.GENERATING && (
              <span className="flex items-center gap-2 text-gray-500 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                Sanatçı çiziyor...
              </span>
            )}
            {status === GenerationStatus.ERROR && (
              <span className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                {errorMsg}
              </span>
            )}
          </div>
        </div>

        {/* Results Section */}
        {status === GenerationStatus.SUCCESS && images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in mt-8">
            {images.map((img, idx) => (
              <div key={img.id} className="group relative flex flex-col items-center">
                <div className="relative w-full aspect-square bg-white border-4 border-gray-800 dark:border-gray-200 rounded-xl shadow-md overflow-hidden transform transition-all duration-500 hover:scale-105 hover:-rotate-1">
                  <div 
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/sketch-paper.png')] opacity-20 pointer-events-none z-10" 
                    aria-hidden="true"
                  />
                  <img 
                    src={img.url} 
                    alt={`${input} charcoal sketch ${idx + 1}`} 
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                
                <div className="mt-4">
                   <button
                    onClick={() => downloadImage(img.url, idx)}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black font-handwritten font-bold text-lg rounded-full hover:shadow-lg transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Kaydet
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty State / Decorator */}
        {status === GenerationStatus.IDLE && (
          <div className="flex justify-center mt-8 opacity-10 grayscale">
              <Cloud className="w-32 h-32 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SketchGenerator;