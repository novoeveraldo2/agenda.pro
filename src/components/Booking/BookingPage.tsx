import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, User, Phone, CheckCircle, ArrowLeft, Building } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Comerciante {
  id: string
  slug: string
  nome_fantasia: string
  logo_url: string | null
  servicos: Array<{
    nome: string
    descricao: string
    preco: number
    duracao: number
  }>
  dias_funcionamento: string[]
  horario_abertura: string
  horario_fechamento: string
}

interface Agendamento {
  id: string
  data_agendamento: string
  horario_inicio: string
  horario_fim: string
}

export const BookingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const [comerciante, setComerciante] = useState<Comerciante | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchComerciante()
    }
  }, [slug])

  useEffect(() => {
    if (selectedService && selectedDate && comerciante) {
      fetchAvailableTimes()
    }
  }, [selectedService, selectedDate, comerciante])

  const fetchComerciante = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('comerciantes')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        throw error
      }

      if (!data) {
        setError('Comerciante não encontrado')
        return
      }

      setComerciante(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do comerciante')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableTimes = async () => {
    if (!comerciante || !selectedService || !selectedDate) return

    try {
      // Buscar agendamentos existentes para a data
      const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('horario_inicio, horario_fim')
        .eq('comerciante_id', comerciante.id)
        .eq('data_agendamento', selectedDate)
        .in('status', ['pendente', 'confirmado'])

      if (error) {
        throw error
      }

      // Gerar horários disponíveis
      const times = generateAvailableTimes(
        comerciante.horario_abertura,
        comerciante.horario_fechamento,
        selectedService.duracao,
        agendamentos || []
      )

      setAvailableTimes(times)
    } catch (err) {
      console.error('Erro ao buscar horários:', err)
      setAvailableTimes([])
    }
  }

  const generateAvailableTimes = (
    abertura: string,
    fechamento: string,
    duracao: number,
    agendamentos: Agendamento[]
  ): string[] => {
    const times: string[] = []
    const [aberturaHour, aberturaMin] = abertura.split(':').map(Number)
    const [fechamentoHour, fechamentoMin] = fechamento.split(':').map(Number)

    const startTime = aberturaHour * 60 + aberturaMin
    const endTime = fechamentoHour * 60 + fechamentoMin

    for (let time = startTime; time + duracao <= endTime; time += 30) {
      const hour = Math.floor(time / 60)
      const min = time % 60
      const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
      
      // Verificar se o horário está disponível
      const endTimeSlot = time + duracao
      const endHour = Math.floor(endTimeSlot / 60)
      const endMin = endTimeSlot % 60
      const endTimeString = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`

      const isAvailable = !agendamentos.some(agendamento => {
        const agendamentoStart = agendamento.horario_inicio
        const agendamentoEnd = agendamento.horario_fim
        
        return (
          (timeString >= agendamentoStart && timeString < agendamentoEnd) ||
          (endTimeString > agendamentoStart && endTimeString <= agendamentoEnd) ||
          (timeString <= agendamentoStart && endTimeString >= agendamentoEnd)
        )
      })

      if (isAvailable) {
        times.push(timeString)
      }
    }

    return times
  }

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hour, min] = startTime.split(':').map(Number)
    const totalMinutes = hour * 60 + min + duration
    const endHour = Math.floor(totalMinutes / 60)
    const endMin = totalMinutes % 60
    return `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`
  }

  const handleSubmit = async () => {
    if (!comerciante || !selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      return
    }

    setIsSubmitting(true)

    try {
      const endTime = calculateEndTime(selectedTime, selectedService.duracao)

      const { error } = await supabase
        .from('agendamentos')
        .insert({
          comerciante_id: comerciante.id,
          cliente_nome: clientName,
          cliente_telefone: clientPhone,
          servico_nome: selectedService.nome,
          servico_preco: selectedService.preco,
          servico_duracao: selectedService.duracao,
          data_agendamento: selectedDate,
          horario_inicio: selectedTime,
          horario_fim: endTime,
          status: 'pendente'
        })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (err: any) {
      alert('Erro ao criar agendamento: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDayOfWeek = (date: string) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[new Date(date).getDay()]
  }

  const isDateAvailable = (date: string) => {
    if (!comerciante) return false
    const dayOfWeek = getDayOfWeek(date)
    return comerciante.dias_funcionamento.includes(dayOfWeek)
  }

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error || !comerciante) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-4">Estabelecimento não encontrado</h2>
          <p className="text-gray-600 mb-6">
            {error || 'Este estabelecimento não está disponível para agendamentos no momento.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agendamento Realizado!</h2>
          <p className="text-gray-600 mb-6">
            Seu agendamento foi criado com sucesso. O estabelecimento entrará em contato para confirmar.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Resumo do Agendamento</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Cliente:</strong> {clientName}</p>
              <p><strong>Serviço:</strong> {selectedService?.nome}</p>
              <p><strong>Data:</strong> {formatDate(selectedDate)}</p>
              <p><strong>Horário:</strong> {selectedTime}</p>
              <p><strong>Valor:</strong> {formatCurrency(selectedService?.preco || 0)}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fazer Novo Agendamento
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 lg:py-6">
          <div className="flex items-center space-x-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {comerciante.logo_url && (
              <img
                src={comerciante.logo_url}
                alt={comerciante.nome_fantasia}
                className="w-12 h-12 lg:w-16 lg:h-16 object-contain rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                {comerciante.nome_fantasia}
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">Agendamento Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`flex items-center ${stepNumber < 4 ? 'flex-1' : ''}`}>
                  <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium ${
                    step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  <span className={`ml-2 text-xs lg:text-sm font-medium ${
                    step >= stepNumber ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {stepNumber === 1 ? 'Serviço' : stepNumber === 2 ? 'Data' : stepNumber === 3 ? 'Horário' : 'Dados'}
                  </span>
                </div>
                {stepNumber < 4 && (
                  <div className={`flex-1 h-1 mx-2 lg:mx-4 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
          {/* Step 1: Escolher Serviço */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Escolha o Serviço</h2>
                <p className="text-gray-600">Selecione o serviço desejado</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {comerciante.servicos.map((servico, index) => (
                  <div
                    key={index}
                    className={`p-4 lg:p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedService?.nome === servico.nome
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedService(servico)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">{servico.nome}</h3>
                      <span className="text-lg lg:text-xl font-bold text-green-600">
                        {formatCurrency(servico.preco)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{servico.descricao}</p>
                    <p className="text-xs text-gray-500">⏱️ {servico.duracao} minutos</p>
                  </div>
                ))}
              </div>

              {selectedService && (
                <div className="mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-blue-600 text-white py-3 lg:py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Escolher Data */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Escolha a Data</h2>
                <p className="text-gray-600">Selecione quando deseja ser atendido</p>
              </div>

              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data Desejada
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    const date = e.target.value
                    if (isDateAvailable(date)) {
                      setSelectedDate(date)
                    } else {
                      alert('Esta data não está disponível para agendamentos.')
                    }
                  }}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Dias de Funcionamento</h4>
                  <div className="text-sm text-blue-800">
                    <p>Horário: {comerciante.horario_abertura} às {comerciante.horario_fechamento}</p>
                    <p className="mt-1">
                      Dias: {comerciante.dias_funcionamento.map(day => {
                        const dayNames: { [key: string]: string } = {
                          monday: 'Segunda',
                          tuesday: 'Terça',
                          wednesday: 'Quarta',
                          thursday: 'Quinta',
                          friday: 'Sexta',
                          saturday: 'Sábado',
                          sunday: 'Domingo'
                        }
                        return dayNames[day]
                      }).join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {selectedDate && (
                <div className="mt-6">
                  <button
                    onClick={() => setStep(3)}
                    className="w-full bg-blue-600 text-white py-3 lg:py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Escolher Horário */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Escolha o Horário</h2>
                <p className="text-gray-600">Selecione o horário disponível</p>
              </div>

              {availableTimes.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum horário disponível</h3>
                  <p className="text-gray-500">Não há horários disponíveis para esta data. Tente outra data.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        selectedTime === time
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}

              {selectedTime && (
                <div className="mt-6">
                  <button
                    onClick={() => setStep(4)}
                    className="w-full bg-blue-600 text-white py-3 lg:py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Dados do Cliente */}
          {step === 4 && (
            <div>
              <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Seus Dados</h2>
                <p className="text-gray-600">Informe seus dados para finalizar o agendamento</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Seu Telefone
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>

                {/* Resumo */}
                <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Resumo do Agendamento</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Serviço:</strong> {selectedService?.nome}</p>
                    <p><strong>Data:</strong> {formatDate(selectedDate)}</p>
                    <p><strong>Horário:</strong> {selectedTime}</p>
                    <p><strong>Duração:</strong> {selectedService?.duracao} minutos</p>
                    <p><strong>Valor:</strong> {formatCurrency(selectedService?.preco || 0)}</p>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!clientName || !clientPhone || isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 lg:py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Criando Agendamento...' : 'Confirmar Agendamento'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}