# Deploy no Netlify - Sistema de Pedidos Hennings

## Passos para o Deploy:

### 1. Via GitHub (Recomendado)

1. Crie um repositório no GitHub
2. Faça push do código para o GitHub
3. No Netlify, conecte com o GitHub
4. Selecione o repositório
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

### 2. Deploy Manual

1. Execute `npm run build` localmente
2. Faça upload da pasta `dist` no Netlify
3. Configure os redirects no painel do Netlify

### 3. Via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --build
netlify deploy --prod
```

## Arquivos de Configuração Criados:

- `netlify.toml` - Configuração principal do Netlify
- `_redirects` - Redirecionamentos para SPA
- `.nvmrc` - Versão do Node.js
- `README.md` - Documentação do projeto

## Funcionalidades do Sistema:

✅ Sistema de pedidos por funcionário
✅ Catálogo de produtos com cores diferenciadas
✅ Setor como informação global
✅ Design 100% responsivo
✅ Integração WhatsApp
✅ Geração de relatórios
✅ Persistência local de dados

## URLs Importantes:

- Desenvolvimento: http://localhost:5174
- Produção: [URL será gerada pelo Netlify]

## Suporte:

Em caso de problemas no deploy, verifique:

1. Se todas as dependências estão instaladas
2. Se o build local funciona
3. Se os arquivos de configuração estão corretos
