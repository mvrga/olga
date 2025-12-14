'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, TrendingUp, Users, Brain, ArrowRight, CheckCircle } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Brain className="size-12 text-green-600" />,
      title: 'IA para Agricultores',
      description: 'Tecnologia que grandes produtores usam, agora acessível para você',
      emoji: '🧠'
    },
    {
      icon: <TrendingUp className="size-12 text-green-600" />,
      title: 'Previsões Inteligentes',
      description: 'Clima, pragas, melhor época de plantio e colheita baseados na sua região',
      emoji: '📊'
    },
    {
      icon: <Users className="size-12 text-green-600" />,
      title: 'Comunidade Local',
      description: 'Conecte-se com agricultores da região, compartilhe conhecimento e equipamentos',
      emoji: '🤝'
    }
  ];

  const benefits = [
    'Aumente sua produtividade até 40%',
    'Reduza perdas com previsões precisas',
    'Economize com compartilhamento de recursos',
    'Venda direto ao consumidor final'
  ];

  const handleStart = () => {
    router.push('/cadastro');
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-700 flex flex-col">
      {/* Header */}
      <header className="px-4 py-6 text-center">
        <div className="bg-white size-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sprout className="size-8 text-green-600" />
        </div>
        <h1 className="text-white text-2xl mb-2">MeuAgronomo</h1>
        <p className="text-green-100 text-sm">Democratizando a agricultura de precisão</p>
      </header>

      {/* Slides */}
      <main className="flex-1 px-4 pb-32 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-6">{slides[currentSlide].emoji}</div>
            <h2 className="text-gray-900 text-xl mb-4">{slides[currentSlide].title}</h2>
            <p className="text-gray-600 mb-8">{slides[currentSlide].description}</p>
            
            {/* Dots */}
            <div className="flex gap-2 justify-center mb-6">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'w-8 bg-green-600' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Benefits on last slide */}
            {currentSlide === slides.length - 1 && (
              <div className="bg-green-50 rounded-2xl p-4 mb-6 text-left">
                <p className="text-sm text-gray-700 mb-3">Com o MeuAgronomo você vai:</p>
                <div className="space-y-2">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 px-4 py-6 bg-gradient-to-t from-green-800 to-transparent">
        <div className="max-w-md mx-auto space-y-3">
          <button
            onClick={nextSlide}
            className="w-full px-6 py-4 bg-white text-green-600 rounded-xl flex items-center justify-center gap-2 hover:bg-green-50 transition-colors shadow-lg"
          >
            <span className="font-medium">
              {currentSlide < slides.length - 1 ? 'Próximo' : 'Começar Cadastro'}
            </span>
            <ArrowRight className="size-5" />
          </button>
          
          {currentSlide < slides.length - 1 && (
            <button
              onClick={handleStart}
              className="w-full px-6 py-3 text-white text-sm hover:text-green-100 transition-colors"
            >
              Pular introdução
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
