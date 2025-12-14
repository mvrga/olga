'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, Mail, Smartphone, ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'phone'>('phone');
  const [step, setStep] = useState<'send' | 'success'>('send');
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recuperar senha:', formData);
    // Aqui você enviaria o código/link de recuperação
    setStep('success');
  };

  const handleBack = () => {
    router.push('/login');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-700 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
            <div className="bg-green-100 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="size-10 text-green-600" />
            </div>
            
            <h1 className="text-gray-900 text-2xl mb-3">Código Enviado!</h1>
            <p className="text-gray-600 mb-6">
              {method === 'phone' 
                ? `Enviamos um código de verificação via WhatsApp para ${formData.phone}`
                : `Enviamos um link de recuperação para ${formData.email}`
              }
            </p>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-green-900 mb-2">📱 Próximos passos:</p>
              <ul className="text-sm text-green-700 text-left space-y-2">
                <li>1. Verifique suas mensagens</li>
                <li>2. Copie o código de 6 dígitos</li>
                <li>3. Crie uma nova senha segura</li>
              </ul>
            </div>

            <button
              onClick={handleBack}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              Voltar para o Login
            </button>

            <button
              onClick={() => setStep('send')}
              className="w-full px-6 py-3 text-green-600 text-sm hover:text-green-700 transition-colors mt-3"
            >
              Não recebi o código
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-700 flex flex-col">
      {/* Header */}
      <header className="px-4 py-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white hover:text-green-100 transition-colors mb-8"
        >
          <ArrowLeft className="size-5" />
          <span>Voltar</span>
        </button>

        <div className="text-center">
          <div className="bg-white size-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Sprout className="size-10 text-green-600" />
          </div>
          <h1 className="text-white text-2xl mb-2">Recuperar Senha</h1>
          <p className="text-green-100 text-sm">
            Enviaremos um código para redefinir sua senha
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            {/* Method Toggle */}
            <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setMethod('phone')}
                className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  method === 'phone'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                <Smartphone className="size-4" />
                <span className="text-sm">WhatsApp</span>
              </button>
              <button
                onClick={() => setMethod('email')}
                className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  method === 'email'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                <Mail className="size-4" />
                <span className="text-sm">Email</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Input */}
              {method === 'phone' && (
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    WhatsApp Cadastrado
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3.5 size-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enviaremos um código de 6 dígitos via WhatsApp
                  </p>
                </div>
              )}

              {/* Email Input */}
              {method === 'email' && (
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Email Cadastrado
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 size-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enviaremos um link de recuperação no seu email
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="text-xl">🔒</div>
                  <div>
                    <p className="text-sm text-blue-900 mb-1">Segurança</p>
                    <p className="text-xs text-blue-700">
                      Nunca compartilhe seu código de recuperação com ninguém. 
                      Nossa equipe nunca pedirá essa informação.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="size-5" />
                <span>Enviar Código</span>
              </button>
            </form>
          </div>

          {/* Help */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <p className="text-white text-sm mb-3">💡 Precisa de ajuda?</p>
            <p className="text-white/90 text-sm mb-4">
              Se você não tem mais acesso ao seu WhatsApp ou email, entre em contato 
              com nosso suporte:
            </p>
            <a 
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 bg-white/20 text-white text-center rounded-xl hover:bg-white/30 transition-colors"
            >
              Falar com Suporte
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
