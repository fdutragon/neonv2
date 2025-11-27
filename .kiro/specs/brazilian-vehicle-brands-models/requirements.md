# Requirements Document

## Introduction

Este documento especifica os requisitos para adicionar uma funcionalidade de seleção de marcas e modelos de veículos comercializados no Brasil (incluindo carros e motos) na página de cadastro de veículos da concessionária. O objetivo é facilitar o preenchimento do formulário, reduzir erros de digitação e padronizar os dados de marca e modelo no sistema.

## Glossary

- **Sistema de Cadastro**: Interface administrativa para adicionar ou editar veículos no catálogo da concessionária
- **Marca**: Fabricante do veículo (ex: Volkswagen, Honda, BMW)
- **Modelo**: Nome específico do veículo dentro de uma marca (ex: Gol, Civic, X5)
- **Categoria de Veículo**: Tipo de veículo (carro ou moto)
- **Administrador**: Usuário com permissões para gerenciar o catálogo de veículos

## Requirements

### Requirement 1

**User Story:** Como administrador, eu quero selecionar a marca do veículo a partir de uma lista das principais marcas comercializadas no Brasil, para que eu possa cadastrar veículos de forma padronizada e sem erros de digitação.

#### Acceptance Criteria

1. WHEN o administrador acessa o campo de marca no formulário de cadastro THEN o Sistema de Cadastro SHALL exibir um campo de seleção (dropdown ou autocomplete) com as principais marcas de carros comercializadas no Brasil
2. WHEN o administrador digita no campo de marca THEN o Sistema de Cadastro SHALL filtrar as opções disponíveis em tempo real baseado no texto digitado
3. WHEN o administrador seleciona uma marca da lista THEN o Sistema de Cadastro SHALL preencher o campo de marca com o valor selecionado
4. WHEN nenhuma marca corresponde ao filtro digitado THEN o Sistema de Cadastro SHALL permitir que o administrador insira uma marca personalizada manualmente
5. THE Sistema de Cadastro SHALL incluir no mínimo 30 marcas de carros populares no mercado brasileiro (incluindo marcas nacionais, asiáticas, europeias e americanas)

### Requirement 2

**User Story:** Como administrador, eu quero selecionar o modelo do veículo a partir de uma lista de modelos relacionados à marca escolhida, para que eu possa cadastrar veículos com informações precisas e consistentes.

#### Acceptance Criteria

1. WHEN o administrador seleciona uma marca THEN o Sistema de Cadastro SHALL habilitar o campo de modelo e exibir os modelos mais populares daquela marca
2. WHEN o administrador digita no campo de modelo THEN o Sistema de Cadastro SHALL filtrar os modelos disponíveis em tempo real baseado no texto digitado
3. WHEN o administrador altera a marca selecionada THEN o Sistema de Cadastro SHALL limpar o campo de modelo e atualizar a lista de modelos disponíveis
4. WHEN nenhum modelo corresponde ao filtro digitado THEN o Sistema de Cadastro SHALL permitir que o administrador insira um modelo personalizado manualmente
5. THE Sistema de Cadastro SHALL incluir no mínimo 10 modelos populares para cada marca cadastrada

### Requirement 3

**User Story:** Como administrador, eu quero ter acesso às principais marcas e modelos de motos comercializadas no Brasil, para que eu possa cadastrar tanto carros quanto motos no sistema.

#### Acceptance Criteria

1. THE Sistema de Cadastro SHALL incluir no mínimo 15 marcas de motos populares no mercado brasileiro (incluindo Honda, Yamaha, Suzuki, Kawasaki, BMW Motorrad, Harley-Davidson, Ducati, entre outras)
2. WHEN o administrador seleciona uma marca de moto THEN o Sistema de Cadastro SHALL exibir os modelos de motos mais populares daquela marca
3. THE Sistema de Cadastro SHALL incluir no mínimo 8 modelos populares para cada marca de moto cadastrada
4. WHEN o administrador está cadastrando uma moto THEN o Sistema de Cadastro SHALL aplicar as mesmas funcionalidades de autocomplete e filtro disponíveis para carros

### Requirement 4

**User Story:** Como administrador, eu quero que a lista de marcas e modelos seja organizada de forma lógica, para que eu possa encontrar rapidamente o que preciso durante o cadastro.

#### Acceptance Criteria

1. WHEN o Sistema de Cadastro exibe a lista de marcas THEN o Sistema de Cadastro SHALL ordenar as marcas alfabeticamente
2. WHEN o Sistema de Cadastro exibe a lista de modelos THEN o Sistema de Cadastro SHALL ordenar os modelos alfabeticamente
3. WHEN o administrador abre o campo de seleção THEN o Sistema de Cadastro SHALL exibir as opções de forma clara com boa legibilidade
4. THE Sistema de Cadastro SHALL separar visualmente marcas de carros e marcas de motos quando ambas estiverem disponíveis no mesmo campo

### Requirement 5

**User Story:** Como administrador, eu quero que o sistema mantenha compatibilidade com veículos já cadastrados, para que os dados existentes não sejam perdidos ou corrompidos.

#### Acceptance Criteria

1. WHEN o administrador edita um veículo existente com marca não presente na lista predefinida THEN o Sistema de Cadastro SHALL exibir e permitir a edição da marca personalizada
2. WHEN o administrador edita um veículo existente com modelo não presente na lista predefinida THEN o Sistema de Cadastro SHALL exibir e permitir a edição do modelo personalizado
3. WHEN o Sistema de Cadastro salva um veículo com marca ou modelo personalizado THEN o Sistema de Cadastro SHALL armazenar os valores exatamente como inseridos pelo administrador
4. THE Sistema de Cadastro SHALL manter o comportamento atual de validação e salvamento de dados de veículos
