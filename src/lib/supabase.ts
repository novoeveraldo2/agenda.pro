import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      comerciantes: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          nome_fantasia: string
          logo_url?: string | null
          servicos: Array<{
            nome: string
            descricao: string
            preco: number
            duracao: number
          }>
          dias_funcionamento: string[]
          horario_abertura: string
          horario_fechamento: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          nome_fantasia?: string
          logo_url?: string | null
          servicos?: Array<{
            nome: string
            descricao: string
            preco: number
            duracao: number
          }>
          dias_funcionamento?: string[]
          horario_abertura?: string
          horario_fechamento?: string
          created_at?: string
          updated_at?: string
        }
      }
      agendamentos: {
        Row: {
          id: string
          comerciante_id: string
          cliente_nome: string
          cliente_telefone: string
          servico_nome: string
          servico_preco: number
          servico_duracao: number
          data_agendamento: string
          horario_inicio: string
          horario_fim: string
          status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          comerciante_id: string
          cliente_nome: string
          cliente_telefone: string
          servico_nome: string
          servico_preco: number
          servico_duracao: number
          data_agendamento: string
          horario_inicio: string
          horario_fim: string
          status?: 'pendente' | 'confirmado' | 'cancelado' | 'concluido'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          comerciante_id?: string
          cliente_nome?: string
          cliente_telefone?: string
          servico_nome?: string
          servico_preco?: number
          servico_duracao?: number
          data_agendamento?: string
          horario_inicio?: string
          horario_fim?: string
          status?: 'pendente' | 'confirmado' | 'cancelado' | 'concluido'
          created_at?: string
          updated_at?: string
        }
      }
      configuracoes_admin: {
        Row: {
          id: string
          chave_pix: string
          planos: {
            essential: { name: string; price: number }
            complete: { name: string; price: number }
          }
          affiliate: {
            commission: number
            minSales: number
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chave_pix: string
          planos: {
            essential: { name: string; price: number }
            complete: { name: string; price: number }
          }
          affiliate: {
            commission: number
            minSales: number
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chave_pix?: string
          planos?: {
            essential: { name: string; price: number }
            complete: { name: string; price: number }
          }
          affiliate?: {
            commission: number
            minSales: number
          }
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}