import api from './api';

const produtoService = {
  async listarProdutos() {
    try {
      const response = await api.get('/produtos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  },

  async criarProduto(novoProduto) {
    try {
      const { foto, ...produtoSemFoto } = novoProduto;

      const response = await api.post('/produtos', produtoSemFoto);
      const produtoCriado = response.data;

      if (foto) {
        await this.uploadFoto(produtoCriado.id, foto);

        const produtoAtualizado = await api.get(`/produtos/${produtoCriado.id}`);
        return produtoAtualizado.data;
      }

      return produtoCriado;
    } catch (error) {
      console.error(`Erro ao cadastrar produto: ${error}`);
      throw error;
    }
  },

  async atualizarProduto(id, dadosAtualizados) {
    try {
      const { foto, ...produtoSemFoto } = dadosAtualizados;

      const response = await api.put(`/produtos/edit/${id}`, produtoSemFoto);

      if (foto) {
        await this.uploadFoto(id, foto);
      }

      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto com ID ${id}:`, error);
      throw error;
    }
  },

  async deletarProduto(id) {
    try {
      const response = await api.delete(`/produtos/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar produto com ID ${id}:`, error);
      throw error;
    }
  },

  async uploadFoto(id, file) {
    try {
      const formData = new FormData();
      formData.append('foto', file);

      const response = await api.post(`/produtos/upload-photo/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch (error) {
      console.error(`Erro ao fazer upload da foto do produto ${id}:`, error);
      throw error;
    }
  }
};

export default produtoService;
