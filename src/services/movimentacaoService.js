import api from './api';

const movimentacaoService = {
  async listarMovimentacoes() {
    try {
      const response = await api.get('/movimentacoes');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar movimentações:', error);
      throw error;
    }
  },

  async listarPorProduto(produto_id) {
    try {
      const response = await api.get(`/movimentacoes/produto/${produto_id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao listar movimentações do produto ${produto_id}:`, error);
      throw error;
    }
  },

  async registrarMovimentacao(dados) {
    try {
      const response = await api.post('/movimentacoes', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      throw error;
    }
  },
};

export default movimentacaoService;
