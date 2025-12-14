'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', formData);
    // Aqui você faria a autenticação com a API
    router.push('/');
  };

  const handleCreateAccount = () => {
    router.push('/bem-vindo');
  };

  const handleForgotPassword = () => {
    router.push('/recuperar-senha');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-700 flex flex-col">
      {/* Header */}
      <header className="px-4 py-8 text-center md:py-12">
        <div className="bg-white size-20 md:size-24 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <Sprout className="size-10 md:size-12 text-green-600" />
        </div>
        <h1 className="text-white text-3xl md:text-4xl mb-2">MeuAgronomo</h1>
        <p className="text-green-100 md:text-lg">Bem-vindo de volta!</p>
      </header>

      {/* Login Form */}
      <main className="flex-1 px-4 pb-8 md:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl">
            {/* Login Method Toggle */}
            <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  loginMethod === 'phone'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Smartphone className="size-4" />
                <span className="text-sm">WhatsApp</span>
              </button>
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  loginMethod === 'email'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Mail className="size-4" />
                <span className="text-sm">Email</span>
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Phone Input */}
              {loginMethod === 'phone' && (
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">WhatsApp</label>
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
                </div>
              )}

              {/* Email Input */}
              {loginMethod === 'email' && (
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">Email</label>
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
                </div>
              )}

              {/* Password Input */}
              <div>
                <label className="block text-gray-700 mb-2 text-sm">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 size-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Entrar</span>
                <ArrowRight className="size-5" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
              >
                <svg className="size-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continuar com Google</span>
              </button>

              <button
                type="button"
                className="w-full px-6 py-3 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] transition-colors flex items-center justify-center gap-3"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Continuar com Facebook</span>
              </button>
            </div>
          </div>

          {/* Create Account */}
          <div className="mt-6 text-center">
            <p className="text-white text-sm mb-3">Ainda não tem uma conta?</p>
            <button
              onClick={handleCreateAccount}
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/20 transition-colors"
            >
              Criar Conta Grátis
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <p className="text-white text-sm mb-3">🌱 Por que usar o MeuAgronomo?</p>
            <ul className="text-white/90 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-300 mt-1">✓</span>
                <span>IA especializada em agricultura familiar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 mt-1">✓</span>
                <span>Previsões de clima e pragas em tempo real</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 mt-1">✓</span>
                <span>Conecte-se com sua comunidade local</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 mt-1">✓</span>
                <span>100% gratuito para pequenos produtores</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}