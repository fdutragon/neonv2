# Configuração da API Groq para Geração Automática de Descrições

## O que foi implementado

A funcionalidade de geração automática de descrições de veículos usando a API do Groq já está implementada no formulário de cadastro de veículos (`src/pages/admin/VehicleForm.tsx`).

## Como configurar

1. **Obter uma chave da API Groq:**
   - Acesse https://console.groq.com/
   - Crie uma conta ou faça login
   - Gere uma nova API key

2. **Configurar a variável de ambiente:**
   - Abra o arquivo `.env` na raiz do projeto
   - Substitua `your_groq_api_key_here` pela sua chave real:
   ```
   VITE_GROQ_API_KEY=gsk_sua_chave_aqui
   ```

3. **Reiniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## Como usar

1. Acesse o painel administrativo em `/admin`
2. Vá para "Gerenciar Veículos" e clique em "Adicionar Novo Veículo"
3. Preencha os campos básicos:
   - Marca
   - Modelo
   - Ano
   - Preço
   - Quilometragem
   - Combustível
   - Categoria
   - Especificações técnicas (motor, potência, câmbio)

4. Clique no botão **"Gerar automaticamente"** na seção de Descrição
5. Aguarde alguns segundos enquanto a IA gera uma descrição comercial atrativa
6. A descrição será preenchida automaticamente no campo de texto
7. Você pode editar a descrição gerada se desejar

## Características da descrição gerada

- **Tamanho:** 120-180 palavras
- **Estilo:** Comercial, conciso e atrativo
- **Idioma:** Português brasileiro
- **Conteúdo:** Foca em benefícios, desempenho, conforto, tecnologia e segurança
- **Tom:** Premium, objetivo e confiável (alinhado com a marca Neon Multimarcas)

## Modelo de IA utilizado

- **Modelo:** llama-3.1-70b-versatile (Groq)
- **Temperatura:** 0.6 (equilíbrio entre criatividade e consistência)

## Tratamento de erros

Se a geração falhar:
- Verifique se a chave da API está configurada corretamente
- Verifique sua conexão com a internet
- Verifique se você tem créditos disponíveis na sua conta Groq
- Uma mensagem de erro será exibida com detalhes do problema
