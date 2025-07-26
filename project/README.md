# 🍴 Sistema de Pedidos de Lanche - Hennings

Sistema web moderno para gerenciamento de pedidos de lanche da empresa Hennings, com interface responsiva e funcionalidades avançadas de gestão.

## ✨ Funcionalidades

### � Gestão de Pedidos

- **Pedidos por Funcionário**: Sistema organizado por colaborador
- **Catálogo de Produtos**: Interface visual com preços e descrições
- **Setores Personalizáveis**: Organização por departamentos
- **Cálculo Automático**: Totais por funcionário e geral

### 💰 Sistema de Troco para Coca

- **Limites Diários**: R$ 15,00 (dias úteis) / R$ 25,00 (sábados)
- **Cálculo Inteligente**: Converte troco automaticamente em Coca-Cola (R$ 13,00)
- **Estatísticas**: Acompanhamento do troco total e cocas possíveis

### 📱 Comunicação

- **WhatsApp Integration**: Envio direto de pedidos com privacidade
- **Relatórios PDF**: Geração automática com layout profissional
- **Email**: Envio de relatórios por email com anexo PDF

### 🎨 Interface

- **Design Responsivo**: Otimizado para desktop, tablet e mobile
- **iOS Compatible**: Download de PDF funcional no iPhone/iPad
- **Interface Limpa**: Design moderno com Tailwind CSS

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **PDF**: jsPDF + AutoTable
- **Email**: EmailJS
- **Icons**: Lucide React
- **Storage**: LocalStorage

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Setup Local

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/pedido-lanche-hennings.git
cd pedido-lanche-hennings
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente** (opcional)

```bash
# Para funcionalidade de email
VITE_EMAILJS_PUBLIC_KEY=sua_chave_publica
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID=seu_template_id
```

4. **Execute o projeto**

```bash
npm run dev
```

5. **Acesse no navegador**

```
http://localhost:5173
```

## 🏗️ Build e Deploy

### Build para Produção

```bash
npm run build
```

### Deploy no Netlify

1. Conecte seu repositório ao Netlify
2. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: 18

### Deploy Manual

1. Faça o build: `npm run build`
2. Faça upload da pasta `dist/` para seu servidor

## 📖 Como Usar

### 1. Configuração Inicial

- Defina o setor do pedido (ex: "Administrativo", "Produção")
- O setor será aplicado a todos os pedidos da sessão

### 2. Adicionando Pedidos

- Clique em "Adicionar Funcionário"
- Digite o nome do colaborador
- Selecione produtos do catálogo
- Ajuste quantidades conforme necessário

### 3. Sistema de Troco

- O sistema calcula automaticamente o troco disponível
- Converte o troco em Coca-Colas quando possível
- Respeita os limites diários (R$ 15 úteis / R$ 25 sábados)

### 4. Finalização

- **WhatsApp**: Envia pedido sem expor preços individuais
- **PDF**: Gera relatório completo para controle interno
- **Email**: Envia relatório por email (requer configuração)

## 🔧 Configuração Avançada

### EmailJS Setup

1. Crie conta no [EmailJS](https://www.emailjs.com/)
2. Configure um service (Gmail, Outlook, etc.)
3. Crie um template de email
4. Adicione as chaves no código ou variáveis de ambiente

### Customização de Produtos

Edite o arquivo `src/data/products.ts` para:

- Adicionar novos produtos
- Alterar preços
- Modificar categorias
- Ativar/desativar itens

### Limites de Troco

Ajuste em `src/components/OrderSummary.tsx`:

```typescript
const WEEKDAY_LIMIT = 15.0; // Limite dias úteis
const SATURDAY_LIMIT = 25.0; // Limite sábados
const COCA_PRICE = 13.0; // Preço da Coca-Cola
```

## 📱 Compatibilidade

### Navegadores Suportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos Móveis

- iOS 14+ (iPhone/iPad)
- Android 8+
- Design responsivo para todas as telas

### Funcionalidades Específicas iOS

- Download de PDF otimizado
- Interface adaptada para Safari
- Instruções contextuais para salvar arquivos

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da Hennings e destina-se ao uso interno da empresa.

## 🆘 Suporte

Para dúvidas ou problemas:

- Abra uma issue no GitHub
- Entre em contato com a equipe de TI da Hennings

---

**Desenvolvido com ❤️ para Hennings**
