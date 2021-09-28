
# LPEM (Landing Page & E-mail Marketing)

💡 Pagina para vender E-mail Marketing e Landing page com alta conversão para os buscadores, acessibilidade e facilidade até para as pessoas com mais dificuldade.

- Criar oportunidades para freelancers de Design de Layouts 
- Oportunidade para micro, pequena e grandes empresas para ter um e-mail marketing
- Oportunidade para e-commerce ter uma pagina unica para captura de leads com um e-mail agradável
- Página de Leads com grande parte customizavel pelo cliente e com facilidade, exemplo: cores, textos e imagens
- Sistema multi-tenancy com uma separação lógica no mesmo banco de dados

 alguns conceitos de microserviços seram implementados
 accounts-service = crud de contas e autenticação

 ** testes de integração somente autenticado

 ## Funcionalidades
 Contas de usuário 
 Lista de contatos 
 Campanhas de emails 

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

 ## Gerar as chaves publicas e privadas
 * Em produção deve ser geradas utilizando o OpenSSL
 * em Dev: https://www.csfieldguide.org.nz/en/interactives/rsa-key-generator/
 * em produção remover o envio das chaves para o git

# TRELLO
:link: https://trello.com/invite/b/Z6UrZAE8/8da644f59725eec72baf9e584a7c8c3f/lpem

# PACOTES
- helmet = para corrigir algumas falhas que são bastante comuns nas paginas web
- artillery.io = para fazer testes de stress e verificar quantos usuários ou acessos a pagina / API aguenta "considerando a hospedagem"
- jest-axe para validar acessibilidade durante os testes (IDE)
- react-axe para ver erros de acessibilidade no console (IDE)
- stylelint caso também se preocupe com semântica no CSS (IDE).
- https://www.npmjs.com/package/@djpfs/react-vlibras-typescript (Pacote de tradução para libras)

## Validações que ainda podemos fazer para melhorar a segurança
* adicionar captcha
* limitar a quantidade de tentativas de login (ou de passar tokens)
* WAF (web application firewall)
* 
