# 🚀 Deploy do Sistema de Pedidos Hennings

## ✅ Repositório GitHub Configurado

- **Repositório**: https://github.com/Fcondera/pedidolanche
- **Status**: ✅ Conectado e sincronizado

## 🚀 Próximos Passos: Deploy no Netlify

### 1. Conectar Netlify ao GitHub

1. Acesse [Netlify.com](https://www.netlify.com)
2. Faça login/cadastro
3. Clique em "New site from Git"
4. Escolha "GitHub" como provider
5. Selecione o repositório `Fcondera/pedidolanche`

### 2. Configurações de Build

```
Build command: npm run build
Publish directory: dist
Node version: 18
```

### 3. Deploy Automático

- ✅ A cada push na branch `main`
- ✅ Preview de PRs automático
- ✅ URL única gerada automaticamente

### 4. Configurações Opcionais

#### EmailJS (Para funcionalidade de email)

Se quiser ativar o envio de emails:

1. Crie conta no [EmailJS](https://www.emailjs.com)
2. Configure um service (Gmail, Outlook, etc.)
3. Crie um template de email
4. No Netlify, vá em Site Settings > Environment Variables:
   ```
   VITE_EMAILJS_PUBLIC_KEY=sua_chave_publica
   VITE_EMAILJS_SERVICE_ID=seu_service_id
   VITE_EMAILJS_TEMPLATE_ID=seu_template_id
   ```

#### Domínio Customizado (Opcional)

- No Netlify: Site Settings > Domain management
- Adicione seu domínio personalizado
- Configure DNS conforme instruções

## 📱 Acesso ao Sistema

- **GitHub**: https://github.com/Fcondera/pedidolanche
- **App ao vivo**: https://pedidolanche.netlify.app (após deploy)
- **Admin Netlify**: https://app.netlify.com

## 📋 Checklist de Deploy

- [x] ✅ Código limpo e otimizado
- [x] ✅ Documentação completa (README.md)
- [x] ✅ Build funcionando sem erros
- [x] ✅ .gitignore configurado
- [x] ✅ Commit inicial feito
- [ ] 🔲 Repositório GitHub criado
- [ ] 🔲 Push para GitHub
- [ ] 🔲 Deploy no Netlify configurado
- [ ] 🔲 Testes em produção realizados

## 🔧 Comandos Úteis

```bash
# Desenvolvimento local
npm install
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Verificar problemas de lint
npm run lint
```

## 📞 Suporte

Para problemas técnicos ou dúvidas:

- Abra uma issue no GitHub
- Entre em contato com a equipe de TI da Hennings
