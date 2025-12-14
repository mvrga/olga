'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  MapPin, 
  Sprout, 
  Tractor, 
  Droplets, 
  Target, 
  CheckCircle, 
  ChevronRight,
  ChevronLeft,
  Home,
  Phone,
  Mail,
  FileText,
  Award,
  Zap
} from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  // Dados Pessoais
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  
  // Dados da Fazenda
  nomeFazenda: string;
  tamanho: string;
  cep: string;
  cidade: string;
  estado: string;
  tipoPropriedade: string;
  
  // Solo e Clima
  tipoSolo: string;
  temAnalise: string;
  topografia: string;
  
  // Infraestrutura
  fonteAgua: string[];
  energia: string;
  equipamentos: string[];
  
  // Produção Atual
  culturasAtuais: string[];
  sistemaProdução: string;
  certificacoes: string[];
  
  // Objetivos
  culturasDesejadas: string[];
  mercadoAlvo: string[];
}

export function FarmRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    nomeFazenda: '',
    tamanho: '',
    cep: '',
    cidade: '',
    estado: '',
    tipoPropriedade: '',
    tipoSolo: '',
    temAnalise: '',
    topografia: '',
    fonteAgua: [],
    energia: '',
    equipamentos: [],
    culturasAtuais: [],
    sistemaProdução: '',
    certificacoes: [],
    culturasDesejadas: [],
    mercadoAlvo: [],
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = () => {
    console.log('Dados do cadastro:', formData);
    // Aqui você enviaria para a API
    router.push('/cadastro-sucesso');
  };

  const progress = (currentStep / 6) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white px-4 py-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white p-2 rounded-lg">
              <Sprout className="size-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-white text-lg">Cadastro de Fazenda</h1>
              <p className="text-green-100 text-sm">Passo {currentStep} de 6</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-green-700 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 pb-24 max-w-2xl mx-auto">
        {/* Step 1: Dados Pessoais */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="bg-green-100 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="size-8 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Dados Pessoais</h2>
              <p className="text-sm text-gray-600">Vamos começar com suas informações básicas</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">Nome Completo *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => updateFormData('nome', e.target.value)}
                  placeholder="João da Silva"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">CPF *</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => updateFormData('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">WhatsApp *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 size-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => updateFormData('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 size-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="joao@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Dados da Fazenda */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="bg-green-100 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="size-8 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Sua Propriedade</h2>
              <p className="text-sm text-gray-600">Informações sobre a fazenda</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">Nome da Fazenda *</label>
                <div className="relative">
                  <Home className="absolute left-3 top-3.5 size-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.nomeFazenda}
                    onChange={(e) => updateFormData('nomeFazenda', e.target.value)}
                    placeholder="Fazenda São José"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">Tamanho (hectares) *</label>
                <input
                  type="number"
                  value={formData.tamanho}
                  onChange={(e) => updateFormData('tamanho', e.target.value)}
                  placeholder="5"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">CEP</label>
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={(e) => updateFormData('cep', e.target.value)}
                    placeholder="13315-000"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">Estado *</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => updateFormData('estado', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione</option>
                    <option value="SP">SP</option>
                    <option value="MG">MG</option>
                    <option value="RJ">RJ</option>
                    <option value="PR">PR</option>
                    <option value="SC">SC</option>
                    <option value="RS">RS</option>
                    <option value="BA">BA</option>
                    <option value="GO">GO</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">Cidade *</label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => updateFormData('cidade', e.target.value)}
                  placeholder="Cabreúva"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">Tipo de Propriedade *</label>
                <div className="space-y-2">
                  {['Própria', 'Arrendada', 'Parceria', 'Familiar'].map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => updateFormData('tipoPropriedade', tipo)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors text-left ${
                        formData.tipoPropriedade === tipo
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Solo e Características */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="bg-green-100 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="size-8 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Solo e Terreno</h2>
              <p className="text-sm text-gray-600">Características da terra</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">Tipo de Solo *</label>
                <div className="space-y-2">
                  {['Arenoso', 'Argiloso', 'Siltoso', 'Misto', 'Não sei'].map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => updateFormData('tipoSolo', tipo)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors text-left ${
                        formData.tipoSolo === tipo
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">Tem análise de solo recente?</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Sim', 'Não'].map((opcao) => (
                    <button
                      key={opcao}
                      onClick={() => updateFormData('temAnalise', opcao)}
                      className={`px-4 py-3 rounded-xl border-2 transition-colors ${
                        formData.temAnalise === opcao
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">Topografia do Terreno</label>
                <div className="space-y-2">
                  {['Plano', 'Levemente inclinado', 'Muito inclinado', 'Misto'].map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => updateFormData('topografia', tipo)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors text-left ${
                        formData.topografia === tipo
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Infraestrutura */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="bg-green-100 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tractor className="size-8 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Infraestrutura</h2>
              <p className="text-sm text-gray-600">Recursos disponíveis na fazenda</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">
                  <Droplets className="inline size-4 mr-1" />
                  Fontes de Água * (múltipla escolha)
                </label>
                <div className="space-y-2">
                  {['Poço artesiano', 'Poço comum', 'Rio/córrego', 'Açude/represa', 'Chuva (cisterna)', 'Rede pública'].map((fonte) => (
                    <button
                      key={fonte}
                      onClick={() => toggleArrayItem('fonteAgua', fonte)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors text-left flex items-center justify-between ${
                        formData.fonteAgua.includes(fonte)
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <span>{fonte}</span>
                      {formData.fonteAgua.includes(fonte) && (
                        <CheckCircle className="size-5 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">
                  <Zap className="inline size-4 mr-1" />
                  Energia Elétrica
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Sim', 'Não'].map((opcao) => (
                    <button
                      key={opcao}
                      onClick={() => updateFormData('energia', opcao)}
                      className={`px-4 py-3 rounded-xl border-2 transition-colors ${
                        formData.energia === opcao
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">Equipamentos Disponíveis (múltipla escolha)</label>
                <div className="space-y-2">
                  {['Trator', 'Arado', 'Grade', 'Plantadeira', 'Pulverizador', 'Roçadeira', 'Irrigação', 'Nenhum'].map((equip) => (
                    <button
                      key={equip}
                      onClick={() => toggleArrayItem('equipamentos', equip)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors text-left flex items-center justify-between ${
                        formData.equipamentos.includes(equip)
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <span>{equip}</span>
                      {formData.equipamentos.includes(equip) && (
                        <CheckCircle className="size-5 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Produção Atual */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="bg-green-100 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="size-8 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Produção Atual</h2>
              <p className="text-sm text-gray-600">O que você já cultiva hoje</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">Culturas Atuais (múltipla escolha)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Milho', 'Feijão', 'Soja', 'Tomate', 'Alface', 'Couve', 'Cenoura', 'Mandioca', 'Abóbora', 'Batata', 'Cebola', 'Nenhuma'].map((cultura) => (
                    <button
                      key={cultura}
                      onClick={() => toggleArrayItem('culturasAtuais', cultura)}
                      className={`px-3 py-2 rounded-lg border-2 transition-colors text-sm flex items-center justify-between ${
                        formData.culturasAtuais.includes(cultura)
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <span>{cultura}</span>
                      {formData.culturasAtuais.includes(cultura) && (
                        <CheckCircle className="size-4 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">Sistema de Produção</label>
                <div className="space-y-2">
                  {['Orgânico certificado', 'Orgânico (sem certificação)', 'Convencional', 'Transição para orgânico', 'Agroflorestal'].map((sistema) => (
                    <button
                      key={sistema}
                      onClick={() => updateFormData('sistemaProdução', sistema)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors text-left ${
                        formData.sistemaProdução === sistema
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {sistema}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">
                  <Award className="inline size-4 mr-1" />
                  Certificações (múltipla escolha)
                </label>
                <div className="space-y-2">
                  {['Orgânico Brasil', 'Fair Trade', 'Rainforest Alliance', 'DAP (Declaração de Aptidão ao PRONAF)', 'Nenhuma'].map((cert) => (
                    <button
                      key={cert}
                      onClick={() => toggleArrayItem('certificacoes', cert)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors text-left flex items-center justify-between ${
                        formData.certificacoes.includes(cert)
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <span>{cert}</span>
                      {formData.certificacoes.includes(cert) && (
                        <CheckCircle className="size-5 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Objetivos */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="bg-green-100 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="size-8 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Seus Objetivos</h2>
              <p className="text-sm text-gray-600">O que você deseja alcançar</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">O que deseja cultivar? (múltipla escolha)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Milho', 'Feijão', 'Tomate', 'Alface', 'Couve', 'Cenoura', 'Rúcula', 'Beterraba', 'Abóbora', 'Pepino', 'Morango', 'Ervas'].map((cultura) => (
                    <button
                      key={cultura}
                      onClick={() => toggleArrayItem('culturasDesejadas', cultura)}
                      className={`px-3 py-2 rounded-lg border-2 transition-colors text-sm flex items-center justify-between ${
                        formData.culturasDesejadas.includes(cultura)
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <span>{cultura}</span>
                      {formData.culturasDesejadas.includes(cultura) && (
                        <CheckCircle className="size-4 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">Mercado Alvo (múltipla escolha)</label>
                <div className="space-y-2">
                  {['Consumo próprio', 'Feira local', 'Restaurantes', 'Supermercados', 'Cestas orgânicas', 'Atravessador', 'Cooperativa', 'Venda online'].map((mercado) => (
                    <button
                      key={mercado}
                      onClick={() => toggleArrayItem('mercadoAlvo', mercado)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors text-left flex items-center justify-between ${
                        formData.mercadoAlvo.includes(mercado)
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <span>{mercado}</span>
                      {formData.mercadoAlvo.includes(mercado) && (
                        <CheckCircle className="size-5 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <p className="text-sm text-green-900 mb-1">Quase lá!</p>
                    <p className="text-xs text-green-700">
                      Com base nas suas respostas, vamos criar recomendações personalizadas para sua fazenda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-40">
        <div className="max-w-2xl mx-auto flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="size-5" />
              Voltar
            </button>
          )}
          
          {currentStep < 6 ? (
            <button
              onClick={nextStep}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            >
              Próximo
              <ChevronRight className="size-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="size-5" />
              Concluir Cadastro
            </button>
          )}
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}