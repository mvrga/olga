'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Sprout, Sparkles } from 'lucide-react';

export default function CadastroSucessoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar automaticamente após 5 segundos
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleContinue = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl mb-6">
          <div className="relative mb-6">
            <div className="bg-green-100 size-24 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="size-12 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 text-4xl animate-pulse">🎉</div>
            <div className="absolute -bottom-2 -left-2 text-4xl animate-pulse delay-100">✨</div>
          </div>

          <h1 className="text-gray-900 text-2xl mb-3">Cadastro Concluído!</h1>
          <p className="text-gray-600 mb-6">
            Bem-vindo ao MeuAgronomo! Sua fazenda está registrada e pronta para começar.
          </p>

          <div className="bg-green-50 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="size-6 text-green-600 flex-shrink-0 mt-1" />
              <div className="text-left">
                <p className="text-sm text-gray-900 mb-1">Próximos Passos:</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✅ Explore o dashboard personalizado</li>
                  <li>✅ Veja sugestões de culturas para sua região</li>
                  <li>✅ Conecte-se com agricultores locais</li>
                  <li>✅ Configure seus primeiros planos de cultivo</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Sprout className="size-5" />
            <span>Ir para o Dashboard</span>
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Redirecionando automaticamente em 5 segundos...
          </p>
        </div>

        {/* Tips Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
          <p className="text-sm mb-2 opacity-90">💡 Dica:</p>
          <p className="text-sm opacity-80">
            Comece adicionando suas culturas atuais na aba "Início" para receber recomendações personalizadas!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
}
