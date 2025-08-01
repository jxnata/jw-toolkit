# 🗺️ LS Maps

[![React Native](https://img.shields.io/badge/React%20Native-0.79.3-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.11-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **LS Maps** é um aplicativo React Native desenvolvido para facilitar o gerenciamento de territórios e designações para congregações das Testemunhas de Jeová. Uma ferramenta completa para organização do serviço de campo.

## 📋 Índice

- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📱 Capturas de Tela](#-capturas-de-tela)
- [🚀 Como Executar](#-como-executar)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🎨 Design System](#-design-system)
- [👥 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

## ✨ Funcionalidades

### 🗺️ Gerenciamento de Territórios

- **Criação e Edição**: Crie e edite territórios geográficos com coordenadas precisas
- **Visualização de Mapas**: Interface intuitiva para visualizar territórios em mapas
- **Organização Hierárquica**: Estrutura organizacional por cidades e congregações

### 👥 Sistema de Usuários

- **Múltiplos Níveis de Acesso**:
    - **Administrador (Nível 1)**: Acesso completo a todas as funcionalidades
    - **Editor (Nível 2)**: Acesso administrativo limitado
    - **Publicador (Nível 3)**: Acesso básico para designações

### 📋 Sistema de Designações

- **Atribuição de Territórios**: Designe territórios para publicadores
- **Acompanhamento**: Rastreamento completo de designações ativas
- **Histórico**: Visualize histórico de designações por publicador

### 🔄 Fluxo de Aprovação

- **Solicitações de Registro**: Sistema de aprovação para novos publicadores
- **Revisão Administrativa**: Interface para revisar e aprovar solicitações
- **Notificações**: Alertas em tempo real para mudanças de status

### 📊 Relatórios e Exportação

- **Geração de PDF**: Exporte dados de territórios em formato PDF
- **Relatórios Detalhados**: Visualize estatísticas e informações organizacionais
- **Exportação de Dados**: Extraia informações para análise externa

### 🔔 Notificações em Tempo Real

- **Push Notifications**: Alertas instantâneos para mudanças de designação
- **Sincronização**: Atualizações automáticas entre dispositivos
- **OneSignal Integration**: Sistema robusto de notificações

## 🛠️ Tecnologias Utilizadas

### Core Technologies

- **[React Native](https://reactnative.dev/)** - Framework para desenvolvimento mobile
- **[Expo](https://expo.dev/)** - Plataforma de desenvolvimento e build
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[Expo Router](https://expo.github.io/router/)** - Roteamento baseado em arquivos

### UI/UX

- **[NativeWind](https://www.nativewind.dev/)** - Tailwind CSS para React Native
- **[Lucide React Native](https://lucide.dev/)** - Biblioteca de ícones
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** - Animações nativas

### Backend & Data

- **[Appwrite](https://appwrite.io/)** - Backend-as-a-Service
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de estado e cache
- **[React Hook Form](https://react-hook-form.com/)** - Formulários performáticos

### Maps & Location

- **[Expo Maps](https://docs.expo.dev/versions/latest/sdk/maps/)** - Integração com mapas
- **[Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)** - Serviços de localização
- **[Geolib](https://github.com/manuelbieh/geolib)** - Utilitários de geolocalização

### Analytics & Notifications

- **[Firebase Analytics](https://firebase.google.com/docs/analytics)** - Análise de uso
- **[OneSignal](https://onesignal.com/)** - Push notifications
- **[Google Sign-In](https://developers.google.com/identity/sign-in/android)** - Autenticação social

## 📱 Capturas de Tela

> _Capturas de tela serão adicionadas aqui_

## 🚀 Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Instalação

1. **Clone o repositório**

    ```bash
    git clone https://github.com/jxnata/jw-toolkit.git
    cd jw-toolkit
    ```

2. **Instale as dependências**

    ```bash
    npm install
    # ou
    yarn install
    ```

3. **Configure as variáveis de ambiente**

    ```bash
    cp .env.example .env
    ```

    Edite o arquivo `.env` com suas configurações:

    ```env
    GOOGLE_MAPS_API_KEY=sua_chave_api_aqui
    APPWRITE_ENDPOINT=sua_url_appwrite
    APPWRITE_PROJECT_ID=seu_project_id
    ```

4. **Execute o projeto**

    ```bash
    # Desenvolvimento
    npm start
    # ou
    yarn start

    # Para Android
    npm run android

    # Para iOS
    npm run ios
    ```

### Scripts Disponíveis

```bash
npm run start          # Inicia o servidor de desenvolvimento
npm run android        # Executa no Android
npm run ios           # Executa no iOS
npm run web           # Executa na web
npm run format        # Formata o código com Prettier
npm run lint          # Executa o linter
npm run lint-fix      # Corrige problemas do linter
npm run test          # Executa os testes
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas do Expo Router
│   ├── (app)/             # Rotas autenticadas
│   │   ├── admin/         # Páginas administrativas
│   │   ├── publisher/     # Páginas de publicadores
│   │   └── sign-in/       # Autenticação
├── components/            # Componentes reutilizáveis
├── hooks/                 # Custom hooks
├── interfaces/            # Tipos TypeScript
├── services/              # Serviços externos
├── utils/                 # Utilitários
└── themes/               # Configurações de tema
```

### Convenções de Nomenclatura

- **Arquivos**: Sempre use kebab-case (`user-profile.tsx`, `map-details.tsx`)
- **Componentes**: PascalCase para componentes React
- **Hooks**: camelCase com prefixo `use` (`useAssignment.ts`)
- **Interfaces**: PascalCase com prefixo `I` quando necessário

## 🎨 Design System

### Paleta de Cores

```javascript
// Cores principais
primary: {
  50: '#fcf9ee',    // Laranja/Marrom (#bb7424)
  500: '#d4942c',
  600: '#bb7424',   // Cor principal
  950: '#3c1d0c'
}

success: {
  50: '#f7f9f4',    // Verde (#719453)
  500: '#719453',
  950: '#182211'
}

danger: {
  50: '#fbf5f5',    // Vermelho (#bf616a)
  500: '#bf616a',
  950: '#39181f'
}
```

### Tipografia

- **Família**: Urbanist (regular, medium, semibold, bold, extrabold, black)
- **Ícones**: jw-icons para ícones customizados
- **Classes**: `font-regular`, `font-medium`, `font-semibold`, `font-bold`

### Componentes

Todos os componentes seguem o padrão de design com NativeWind e são responsivos para diferentes tamanhos de tela.

## 👥 Contribuindo

Agradecemos seu interesse em contribuir com o LS Maps!

### Como Contribuir

1. **Fork o projeto**
2. **Crie uma branch para sua feature**
    ```bash
    git checkout -b feature/nova-funcionalidade
    ```
3. **Faça suas alterações**
4. **Siga os padrões de código**
    - Use TypeScript
    - Siga as convenções de nomenclatura
    - Use NativeWind para estilização
    - Adicione testes quando apropriado
5. **Commit suas alterações**
    ```bash
    git commit -m "feat: adiciona nova funcionalidade"
    ```
6. **Push para a branch**
    ```bash
    git push origin feature/nova-funcionalidade
    ```
7. **Abra um Pull Request**

### Padrões de Commit

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação de código
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de manutenção

### Código de Conduta

Este projeto segue um código de conduta baseado no respeito mútuo. Esperamos que todos os contribuidores:

- Sejam respeitosos e inclusivos
- Mantenham foco no objetivo do projeto
- Sigam as diretrizes de contribuição
- Reportem problemas de forma construtiva

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Suporte

- **Issues**: [GitHub Issues](https://github.com/jxnata/jw-toolkit/issues)

---
