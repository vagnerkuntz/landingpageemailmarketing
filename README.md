
# LPEM (Landing Page & E-mail Marketing)

dbname = dblpem
dbuser = lpem
dbpassword = 12345678

portas
3000 = accounts
3001 = contacts
3002 = messages

#### Projeto desenvolvido apenas para conclusão de curso.

💡 Pagina para vender E-mail Marketing e Landing page com alta conversão para os buscadores, acessibilidade e facilidade até para as pessoas com mais dificuldade.

- Criar oportunidades para freelancers de Design de Layouts 
- Oportunidade para micro, pequena e grandes empresas para ter um e-mail ‘marketing’
- Oportunidade para ‘e-commerce’ ter uma página unica para captura de ‘leads’ com um e-mail agradável
- Página de Leads com grande parte customizavel pelo cliente e com facilidade, exemplo: cores, textos e imagens
- Sistema 'multitenancy' com uma separação lógica no mesmo banco de dados

 Alguns conceitos de microserviços seram implementados
 accounts-service = crud de contas e autenticação

 ** Testes de integração somente autenticado

 ## Funcionalidades
 Contas de usuário 
 Lista de contatos 
 Campanhas de e-mails

 ## SOFT DELETE
 Não vamos deletar realmente os dados, vamos só ocultar pelo banco para termos um relatorio mais completo

 ## Stack de desenvolvimento
 * ReactJS
 * NodeJS
 * TypeScript
 * Sequelize

 ## Infraestrutura
 * MySQL
 * Amazon AWS

 ## Protocolos
 * REST (api)
 * JSON (retorno da api)
 * JWT (parte de segurança)

 ## Gerar chaves publicas e privadas
 * Em produção deve ser geradas e utilizando o OpenSSL
 * em Dev: https://www.csfieldguide.org.nz/en/interactives/rsa-key-generator/
 * em produção remover o envio das chaves para o git

# ClickUp
:link: https://sharing.clickup.com/36948462/b/h/6-380852897-2/36d992ad5b8d759

# Pacotes para analisar o uso
- helmet = para corrigir algumas falhas que são bastante comuns nas paginas web
- artillery.io = para fazer testes de 'stress' e verificar quantos usuários ou acessos à página / API aguenta "considerando a hospedagem"
- jest-axe para validar acessibilidade durante os testes (IDE)
- react-axe para ver erros de acessibilidade no console (IDE)
- stylelint caso também se preocupe com semântica no CSS (IDE).
- https://www.npmjs.com/package/@djpfs/react-vlibras-typescript (Pacote de tradução para libras)

## Validações que ainda podemos fazer para melhorar a segurança
* Adicionar captcha nos formulários
* Limitar a quantidade de tentativas de 'login' (ou de passar tokens)
* WAF (web application firewall)
* 
